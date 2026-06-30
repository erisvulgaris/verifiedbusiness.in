import { promises as fs } from "fs";
import path from "path";
import { logger, createLogger } from "@/lib/logger";
import { runAllHealthChecks, type HealthReport } from "@/lib/health";

/**
 * Maintenance runner — executed by the recurring 15-minute cron job.
 *
 * Responsibilities:
 *  1. Run all health checks and log the report
 *  2. Clean up temporary files (logs, stale uploads)
 *  3. Detect and log recurring errors from the dev log
 *  4. Generate a health report file for observability
 *  5. Open actionable maintenance tasks (logged as structured warnings)
 *
 * This module is idempotent — running it multiple times is safe.
 * It never throws; all errors are caught and logged.
 */

const log = createLogger({ module: "maintenance" });

interface MaintenanceResult {
  ranAt: string;
  durationMs: number;
  healthReport: HealthReport;
  cleanup: {
    tempFilesRemoved: number;
    bytesFreed: number;
  };
  tasks: MaintenanceTask[];
}

export interface MaintenanceTask {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  detectedAt: string;
  action?: string;
}

/**
 * Run the full maintenance cycle. Never throws.
 */
export async function runMaintenance(): Promise<MaintenanceResult> {
  const start = performance.now();
  log.info("Maintenance cycle started");

  const tasks: MaintenanceTask[] = [];

  // 1. Health checks
  const healthReport = await runAllHealthChecks().catch((err): HealthReport => ({
    status: "fail",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "0.0.0",
    environment: process.env.NODE_ENV ?? "development",
    checks: [{
      name: "maintenance-runner",
      status: "fail",
      latencyMs: 0,
      message: "runAllHealthChecks threw",
      details: { error: err instanceof Error ? err.message : String(err) },
    }],
  }));

  // Open tasks for any failing checks
  for (const check of healthReport.checks) {
    if (check.status === "fail") {
      tasks.push({
        id: `health-fail-${check.name}`,
        severity: "critical",
        title: `Health check failed: ${check.name}`,
        description: check.message ?? "Check failed without a message",
        detectedAt: healthReport.timestamp,
        action: `Investigate ${check.name} check. Details: ${JSON.stringify(check.details ?? {})}`,
      });
    } else if (check.status === "warn") {
      tasks.push({
        id: `health-warn-${check.name}`,
        severity: "warning",
        title: `Health check warning: ${check.name}`,
        description: check.message ?? "Check warned without a message",
        detectedAt: healthReport.timestamp,
        action: `Monitor ${check.name}. Details: ${JSON.stringify(check.details ?? {})}`,
      });
    }
  }

  // 2. Cleanup temp files
  const cleanup = await cleanupTempFiles().catch((err) => {
    log.error("Temp file cleanup failed", { error: err instanceof Error ? err.message : String(err) });
    return { tempFilesRemoved: 0, bytesFreed: 0 };
  });

  if (cleanup.tempFilesRemoved > 0) {
    tasks.push({
      id: "cleanup-temp-files",
      severity: "info",
      title: "Temporary files cleaned up",
      description: `Removed ${cleanup.tempFilesRemoved} temp files (${cleanup.bytesFreed} bytes freed)`,
      detectedAt: new Date().toISOString(),
    });
  }

  // 3. Scan dev log for recurring errors
  const errorPatterns = await scanForRecurringErrors().catch((err) => {
    log.error("Error scan failed", { error: err instanceof Error ? err.message : String(err) });
    return [];
  });

  for (const pattern of errorPatterns) {
    tasks.push({
      id: `recurring-error-${pattern.hash}`,
      severity: pattern.count > 5 ? "critical" : "warning",
      title: `Recurring error detected (${pattern.count}x)`,
      description: pattern.sample,
      detectedAt: new Date().toISOString(),
      action: "Search the dev log for the full stack trace and file a bug.",
    });
  }

  // 4. Check for memory leaks (heap growth trend)
  const memTask = checkMemoryTrend();
  if (memTask) tasks.push(memTask);

  // 5. Write health report to file for observability
  await writeHealthReport(healthReport, tasks).catch((err) => {
    log.error("Failed to write health report", { error: err instanceof Error ? err.message : String(err) });
  });

  const durationMs = Math.round(performance.now() - start);

  // Log summary
  const criticalTasks = tasks.filter((t) => t.severity === "critical");
  const warningTasks = tasks.filter((t) => t.severity === "warning");

  if (criticalTasks.length > 0) {
    log.error("Maintenance cycle completed with critical issues", {
      durationMs,
      status: healthReport.status,
      criticalTasks: criticalTasks.length,
      warningTasks: warningTasks.length,
      totalTasks: tasks.length,
    });
  } else if (warningTasks.length > 0) {
    log.warn("Maintenance cycle completed with warnings", {
      durationMs,
      status: healthReport.status,
      warningTasks: warningTasks.length,
      totalTasks: tasks.length,
    });
  } else {
    log.info("Maintenance cycle completed cleanly", {
      durationMs,
      status: healthReport.status,
      totalTasks: tasks.length,
    });
  }

  return {
    ranAt: new Date().toISOString(),
    durationMs,
    healthReport,
    cleanup,
    tasks,
  };
}

// ---------- Cleanup helpers ----------

async function cleanupTempFiles(): Promise<{ tempFilesRemoved: number; bytesFreed: number }> {
  let tempFilesRemoved = 0;
  let bytesFreed = 0;

  const tempDirs = [
    "/tmp/bharat-directory",
    path.join(process.cwd(), ".tmp"),
  ];

  for (const dir of tempDirs) {
    try {
      const entries = await fs.readdir(dir).catch(() => []);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        try {
          const stat = await fs.stat(fullPath);
          // Remove files older than 1 hour
          const ageMs = Date.now() - stat.mtimeMs;
          if (ageMs > 60 * 60 * 1000) {
            bytesFreed += stat.size;
            await fs.unlink(fullPath);
            tempFilesRemoved++;
          }
        } catch {
          // file may have been removed already — skip
        }
      }
    } catch {
      // dir doesn't exist — that's fine
    }
  }

  // Truncate dev.log if it's grown too large (> 5MB)
  const devLogPath = path.join(process.cwd(), "dev.log");
  try {
    const stat = await fs.stat(devLogPath);
    if (stat.size > 5 * 1024 * 1024) {
      // Keep the last 1000 lines
      const content = await fs.readFile(devLogPath, "utf-8");
      const lines = content.split("\n");
      const truncated = lines.slice(-1000).join("\n");
      await fs.writeFile(devLogPath, truncated);
      bytesFreed += stat.size - truncated.length;
      tempFilesRemoved++;
      log.info("Truncated large dev.log", { originalSize: stat.size, newSize: truncated.length });
    }
  } catch {
    // dev.log may not exist — skip
  }

  return { tempFilesRemoved, bytesFreed };
}

// ---------- Error scanning ----------

interface ErrorPattern {
  hash: string;
  count: number;
  sample: string;
}

async function scanForRecurringErrors(): Promise<ErrorPattern[]> {
  const devLogPath = path.join(process.cwd(), "dev.log");
  let content: string;
  try {
    content = await fs.readFile(devLogPath, "utf-8");
  } catch {
    return [];
  }

  // Find lines containing "error" (case-insensitive), group by normalized pattern
  const errorLines = content
    .split("\n")
    .filter((line) => /error/i.test(line) && !/✓/.test(line));

  const groups = new Map<string, { count: number; sample: string }>();

  for (const line of errorLines) {
    // Normalize: strip timestamps, hex IDs, numbers
    const normalized = line
      .replace(/\d{4}-\d{2}-\d{2}[\d:.\sTZ]*/g, "<ts>")
      .replace(/0x[0-9a-f]+/gi, "<hex>")
      .replace(/\b\d+\b/g, "N")
      .slice(0, 200);

    // Simple hash
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = ((hash << 5) - hash + normalized.charCodeAt(i)) | 0;
    }
    const hashKey = String(hash);

    const existing = groups.get(hashKey);
    if (existing) {
      existing.count++;
    } else {
      groups.set(hashKey, { count: 1, sample: line.slice(0, 300) });
    }
  }

  // Only report patterns that appear 3+ times
  return Array.from(groups.entries())
    .filter(([, g]) => g.count >= 3)
    .map(([hash, g]) => ({ hash, count: g.count, sample: g.sample }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

// ---------- Memory trend check ----------

let lastHeapUsed = 0;
let lastHeapTime = 0;

function checkMemoryTrend(): MaintenanceTask | null {
  const mem = process.memoryUsage();
  const heapUsed = mem.heapUsed;
  const now = Date.now();

  // Need at least 2 data points 5+ minutes apart
  if (lastHeapUsed > 0 && now - lastHeapTime > 5 * 60 * 1000) {
    const growth = heapUsed - lastHeapUsed;
    const growthMb = growth / (1024 * 1024);

    // Flag if heap grew by > 50MB between cycles
    if (growthMb > 50) {
      const task: MaintenanceTask = {
        id: "memory-growth",
        severity: "warning",
        title: "Heap memory growth detected",
        description: `Heap grew by ${growthMb.toFixed(1)}MB since last cycle`,
        detectedAt: new Date().toISOString(),
        action: "Profile memory usage; look for retained references or event listener leaks.",
      };
      lastHeapUsed = heapUsed;
      lastHeapTime = now;
      return task;
    }
  }

  lastHeapUsed = heapUsed;
  lastHeapTime = now;
  return null;
}

// ---------- Health report file ----------

async function writeHealthReport(report: HealthReport, tasks: MaintenanceTask[]): Promise<void> {
  const reportDir = path.join(process.cwd(), ".health");
  await fs.mkdir(reportDir, { recursive: true });

  // Write the latest report (overwrites)
  const latestPath = path.join(reportDir, "latest.json");
  const latestContent = JSON.stringify({ ...report, tasks, maintenanceVersion: "1.0.0" }, null, 2);
  await fs.writeFile(latestPath, latestContent, "utf-8");

  // Archive a timestamped copy (keep last 24 = 6 hours at 15min intervals)
  const timestampedPath = path.join(reportDir, `report-${Date.now()}.json`);
  await fs.writeFile(timestampedPath, latestContent, "utf-8");

  // Clean up old archived reports (keep last 24)
  const archives = await fs.readdir(reportDir);
  const reportFiles = archives
    .filter((f) => f.startsWith("report-") && f.endsWith(".json"))
    .sort()
    .reverse();

  for (const old of reportFiles.slice(24)) {
    await fs.unlink(path.join(reportDir, old)).catch(() => {});
  }
}
