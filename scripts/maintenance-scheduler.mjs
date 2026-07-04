#!/usr/bin/env node
/**
 * Background maintenance scheduler.
 *
 * Runs the maintenance cycle every 15 minutes as a long-running process.
 * Intended to be started alongside the Next.js dev server in development,
 * or as a sidecar container in production.
 *
 * Usage:
 *   node scripts/maintenance-scheduler.mjs
 *   bun scripts/maintenance-scheduler.mjs
 *
 * The scheduler:
 *  - Waits 60s after startup before the first run (lets the server warm up)
 *  - Runs maintenance every 15 minutes (900000ms)
 *  - Logs to .health/scheduler.log
 *  - Handles SIGINT/SIGTERM for clean shutdown
 *  - Never crashes — all errors are caught and logged
 */

import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const INITIAL_DELAY_MS = 60 * 1000; // 1 minute
const MAINTENANCE_LOG = join(process.cwd(), ".health", "scheduler.log");
const HEALTH_DIR = join(process.cwd(), ".health");

if (!existsSync(HEALTH_DIR)) {
  mkdirSync(HEALTH_DIR, { recursive: true });
}

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  appendFileSync(MAINTENANCE_LOG, line);
  console.log(line.trimEnd());
}

async function runMaintenanceCycle() {
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

    const body = await response.json().catch(() => ({ error: "Invalid JSON" }));
    const healthStatus = body?.healthReport?.status ?? "unknown";
    const taskCount = body?.tasks?.length ?? 0;
    const criticalCount = body?.tasks?.filter((t) => t.severity === "critical").length ?? 0;

    if (response.ok && criticalCount === 0) {
      log(`Maintenance OK: health=${healthStatus}, tasks=${taskCount}, duration=${body?.durationMs ?? "??"}ms`);
    } else if (criticalCount > 0) {
      const titles = body.tasks.filter((t) => t.severity === "critical").map((t) => t.title).join("; ");
      log(`Maintenance CRITICAL: ${criticalCount} critical tasks — ${titles}`);
    } else {
      log(`Maintenance returned ${response.status}: ${JSON.stringify(body).slice(0, 300)}`);
    }
  } catch (err) {
    log(`Maintenance cycle failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

log(`Scheduler starting — interval=${INTERVAL_MS / 1000}s, initialDelay=${INITIAL_DELAY_MS / 1000}s`);

let intervalId = null;
let running = false;

// Schedule the first run after the initial delay
const startTimeout = setTimeout(() => {
  runMaintenanceCycle().finally(() => {
    running = false;
  });
  running = true;

  // Schedule recurring runs
  intervalId = setInterval(() => {
    if (running) {
      log("Skipping cycle — previous run still in progress");
      return;
    }
    running = true;
    runMaintenanceCycle().finally(() => {
      running = false;
    });
  }, INTERVAL_MS);
}, INITIAL_DELAY_MS);

// Clean shutdown
function shutdown(signal) {
  log(`Received ${signal}, shutting down scheduler`);
  clearTimeout(startTimeout);
  if (intervalId) clearInterval(intervalId);
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Keep the process alive
process.stdin.resume();
