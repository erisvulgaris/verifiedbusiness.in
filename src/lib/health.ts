import { logger } from "@/lib/logger";

/**
 * Health check system.
 *
 * Provides liveness and readiness checks for the application, suitable for
 * use by Kubernetes-style probes, container orchestration, and the recurring
 * maintenance cron job.
 *
 * Checks are intentionally lightweight and fast (< 100ms each) so they can
 * run on every request without impacting performance.
 */

export type HealthStatus = "pass" | "warn" | "fail";

export interface HealthCheckResult {
  name: string;
  status: HealthStatus;
  latencyMs: number;
  message?: string;
  details?: Record<string, unknown>;
}

export interface HealthReport {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  checks: HealthCheckResult[];
  version: string;
  environment: string;
}

/** A single health check function. Should complete in < 1000ms. */
type HealthCheck = () => Promise<Omit<HealthCheckResult, "name" | "latencyMs">>;

/** Measure execution time of an async function in milliseconds. */
async function measureLatency<T>(fn: () => Promise<T>): Promise<{ result: T; latencyMs: number }> {
  const start = performance.now();
  const result = await fn();
  const latencyMs = Math.round(performance.now() - start);
  return { result, latencyMs };
}

/** Reduce an array of statuses to the worst overall status. */
function aggregateStatuses(statuses: HealthStatus[]): HealthStatus {
  if (statuses.includes("fail")) return "fail";
  if (statuses.includes("warn")) return "warn";
  return "pass";
}

// ---------- Individual health checks ----------

const checkProcess: HealthCheck = async () => {
  const mem = process.memoryUsage();
  const heapUsedMb = mem.heapUsed / (1024 * 1024);
  const heapTotalMb = mem.heapTotal / (1024 * 1024);
  const rssMb = mem.rss / (1024 * 1024);

  // Use absolute thresholds — V8 expands heapTotal dynamically, so
  // a high used/total ratio is normal and not a leak indicator.
  // Real concerns are:
  //  - heap used > 1GB (approaching V8 default limit ~1.5-4GB)
  //  - RSS > 2GB (process may be killed by OOM)
  if (heapUsedMb > 1024) {
    return {
      status: "fail",
      message: "Heap usage critically high (>1GB)",
      details: { heapUsedMb: heapUsedMb.toFixed(1), heapTotalMb: heapTotalMb.toFixed(1), rssMb: rssMb.toFixed(1) },
    };
  }
  if (rssMb > 2048) {
    return {
      status: "fail",
      message: "RSS critically high (>2GB) — OOM risk",
      details: { heapUsedMb: heapUsedMb.toFixed(1), heapTotalMb: heapTotalMb.toFixed(1), rssMb: rssMb.toFixed(1) },
    };
  }
  if (heapUsedMb > 500) {
    return {
      status: "warn",
      message: "Heap usage elevated (>500MB)",
      details: { heapUsedMb: heapUsedMb.toFixed(1), heapTotalMb: heapTotalMb.toFixed(1), rssMb: rssMb.toFixed(1) },
    };
  }
  return {
    status: "pass",
    message: "Process healthy",
    details: { heapUsedMb: heapUsedMb.toFixed(1), heapTotalMb: heapTotalMb.toFixed(1), rssMb: rssMb.toFixed(1) },
  };
};

const checkEventLoopLag: HealthCheck = async () => {
  // Measure event loop lag — how delayed is a 0ms timer?
  return new Promise((resolve) => {
    const start = performance.now();
    setImmediate(() => {
      const lag = performance.now() - start;
      if (lag > 100) {
        resolve({ status: "fail", message: "Event loop lag high (>100ms)", details: { lagMs: lag.toFixed(1) } });
      } else if (lag > 50) {
        resolve({ status: "warn", message: "Event loop lag elevated (>50ms)", details: { lagMs: lag.toFixed(1) } });
      } else {
        resolve({ status: "pass", message: "Event loop responsive", details: { lagMs: lag.toFixed(1) } });
      }
    });
  });
};

const checkDiskSpace: HealthCheck = async () => {
  try {
    const fs = await import("fs/promises");
    const os = await import("os");
    const path = await import("path");

    // Check the tmpdir is writable (proxy for disk health)
    const tmpDir = os.tmpdir();
    const testFile = path.join(tmpDir, `.bharat-health-${Date.now()}`);
    await fs.writeFile(testFile, "ok");
    await fs.unlink(testFile);

    return {
      status: "pass",
      message: "Temp directory writable",
      details: { tmpDir },
    };
  } catch (err) {
    return {
      status: "fail",
      message: "Temp directory not writable",
      details: { error: err instanceof Error ? err.message : String(err) },
    };
  }
};

/**
 * Check database connectivity.
 * Times out after 2s so a hung DB doesn't stall the health endpoint.
 */
const checkDatabase: HealthCheck = async () => {
  try {
    // Lazy import so this doesn't run during SSR of other pages
    const { db } = await import("@/lib/db");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    try {
      // Simple connectivity check — $queryRaw with a trivial query
      await Promise.race([
        db.$queryRaw`SELECT 1`,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("DB query timeout (2s)")), 2000),
        ),
      ]);
      return { status: "pass", message: "Database reachable" };
    } finally {
      clearTimeout(timeout);
    }
  } catch (err) {
    return {
      status: "fail",
      message: "Database unreachable",
      details: { error: err instanceof Error ? err.message : String(err) },
    };
  }
};

/**
 * Check that the mock data layer (directory-data.ts) is importable and
 * structurally valid. This catches import errors and data corruption.
 */
const checkMockDataIntegrity: HealthCheck = async () => {
  try {
    const { BUSINESSES, CATEGORIES, INDIA_STATES } = await import(
      "@/lib/directory-data"
    );

    const issues: string[] = [];

    if (!Array.isArray(BUSINESSES) || BUSINESSES.length === 0) {
      issues.push("BUSINESSES is empty or not an array");
    }
    if (!Array.isArray(CATEGORIES) || CATEGORIES.length === 0) {
      issues.push("CATEGORIES is empty or not an array");
    }
    if (!Array.isArray(INDIA_STATES) || INDIA_STATES.length === 0) {
      issues.push("INDIA_STATES is empty or not an array");
    }

    // Spot-check required fields on first business
    const sample = BUSINESSES[0];
    if (sample) {
      const required = ["id", "name", "category", "rating", "address", "city", "phone", "pincode"];
      for (const field of required) {
        if (!(field in sample) || sample[field as keyof typeof sample] == null) {
          issues.push(`Business ${sample.id ?? "?"} missing field: ${field}`);
        }
      }
    }

    // Check for duplicate IDs
    const ids = new Set<string>();
    for (const b of BUSINESSES) {
      if (ids.has(b.id)) {
        issues.push(`Duplicate business ID: ${b.id}`);
      }
      ids.add(b.id);
    }

    if (issues.length > 0) {
      return {
        status: "fail",
        message: "Mock data integrity issues detected",
        details: { issues, businessCount: BUSINESSES.length },
      };
    }

    return {
      status: "pass",
      message: "Mock data intact",
      details: { businesses: BUSINESSES.length, categories: CATEGORIES.length, states: INDIA_STATES.length },
    };
  } catch (err) {
    return {
      status: "fail",
      message: "Failed to import mock data",
      details: { error: err instanceof Error ? err.message : String(err) },
    };
  }
};

// ---------- Health check registry ----------

/** All registered health checks, keyed by name. */
const registry = new Map<string, HealthCheck>();

registry.set("process", checkProcess);
registry.set("event-loop", checkEventLoopLag);
registry.set("disk", checkDiskSpace);
registry.set("database", checkDatabase);
registry.set("mock-data", checkMockDataIntegrity);

/** Register a custom health check. */
export function registerHealthCheck(name: string, check: HealthCheck): void {
  registry.set(name, check);
}

/**
 * Run a subset of health checks (liveness probe).
 * Fast checks only — process, event-loop. No external dependencies.
 */
export async function runLivenessChecks(): Promise<HealthReport> {
  const checksToRun = ["process", "event-loop"];
  const results: HealthCheckResult[] = [];

  for (const name of checksToRun) {
    const check = registry.get(name);
    if (!check) continue;
    const { result, latencyMs } = await measureLatency(check);
    results.push({ name, latencyMs, ...result });
  }

  return {
    status: aggregateStatuses(results.map((r) => r.status)),
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: results,
    version: process.env.npm_package_version ?? "0.0.0",
    environment: process.env.NODE_ENV ?? "development",
  };
}

/**
 * Run ALL health checks (readiness probe + maintenance cron).
 * Includes database and data integrity checks.
 */
export async function runAllHealthChecks(): Promise<HealthReport> {
  const results: HealthCheckResult[] = [];

  for (const [name, check] of registry) {
    try {
      const { result, latencyMs } = await measureLatency(check);
      results.push({ name, latencyMs, ...result });
    } catch (err) {
      results.push({
        name,
        status: "fail",
        latencyMs: 0,
        message: "Health check threw unexpectedly",
        details: { error: err instanceof Error ? err.message : String(err) },
      });
    }
  }

  const report: HealthReport = {
    status: aggregateStatuses(results.map((r) => r.status)),
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: results,
    version: process.env.npm_package_version ?? "0.0.0",
    environment: process.env.NODE_ENV ?? "development",
  };

  if (report.status === "fail") {
    logger.error("Health check failed", { status: report.status, failedChecks: results.filter((r) => r.status === "fail").map((r) => r.name) });
  } else if (report.status === "warn") {
    logger.warn("Health check warnings", { status: report.status, warnChecks: results.filter((r) => r.status === "warn").map((r) => r.name) });
  } else {
    logger.debug("Health check passed", { latencyMs: results.reduce((sum, r) => sum + r.latencyMs, 0) });
  }

  return report;
}
