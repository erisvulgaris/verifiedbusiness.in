#!/usr/bin/env node
/**
 * Maintenance cron script — runs the full maintenance cycle and logs the result.
 *
 * This script is designed to be invoked by a cron scheduler every 15 minutes.
 * It calls the /api/maintenance/run endpoint and logs the outcome.
 *
 * Usage:
 *   node scripts/maintenance-cron.js
 *   bun scripts/maintenance-cron.js
 *
 * Exit codes:
 *   0 — maintenance ran successfully (even if warnings were found)
 *   1 — maintenance failed to run (infrastructure error)
 *   2 — critical issues detected (health check failed)
 */

import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const MAINTENANCE_LOG = join(process.cwd(), ".health", "cron.log");
const HEALTH_DIR = join(process.cwd(), ".health");

// Ensure health dir exists
if (!existsSync(HEALTH_DIR)) {
  mkdirSync(HEALTH_DIR, { recursive: true });
}

function logCron(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  appendFileSync(MAINTENANCE_LOG, line);
  console.log(line.trimEnd());
}

async function runMaintenanceViaAPI() {
  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
  const url = `${baseUrl}/api/maintenance/run`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CRON_SECRET ? { "x-cron-secret": process.env.CRON_SECRET } : {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const body = await response.json().catch(() => ({ error: "Invalid JSON response" }));
    return { ok: response.ok, status: response.status, body };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      body: { error: err instanceof Error ? err.message : String(err) },
    };
  }
}

async function main() {
  logCron("Cron maintenance cycle starting");

  const result = await runMaintenanceViaAPI();

  if (!result.ok) {
    logCron(`ERROR: Maintenance API call failed (status ${result.status})`);
    logCron(`Response: ${JSON.stringify(result.body).slice(0, 500)}`);
    return 1;
  }

  const body = result.body;
  const healthStatus = body?.healthReport?.status ?? "unknown";
  const tasks = body?.tasks ?? [];
  const criticalTasks = tasks.filter((t) => t.severity === "critical");
  const warningTasks = tasks.filter((t) => t.severity === "warning");

  logCron(
    `Maintenance completed: health=${healthStatus}, tasks=${tasks.length} ` +
    `(critical=${criticalTasks.length}, warning=${warningTasks.length}), ` +
    `duration=${body?.durationMs ?? "??"}ms`,
  );

  for (const task of criticalTasks) {
    logCron(`CRITICAL: ${task.title}`);
  }

  if (criticalTasks.length > 0) {
    return 2;
  }

  return 0;
}

main()
  .then((exitCode) => {
    if (exitCode !== 0) {
      process.exit(exitCode);
    }
  })
  .catch((err) => {
    logCron(`FATAL: Cron script crashed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  });
