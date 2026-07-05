import { NextResponse } from "next/server";
import { runLivenessChecks, runAllHealthChecks } from "@/lib/health";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/health
 *
 * Liveness probe. Returns 200 if the process is alive and the event loop
 * is responsive. Does NOT check external dependencies (database, disk).
 *
 * Use this for orchestrator liveness probes — it's fast (< 50ms typically).
 *
 * Query params:
 *  - ?deep=true — run ALL checks including database (slower, for readiness)
 */
export async function GET(request: Request) {
  // Rate limit
  const limited = checkRateLimit(request);
  if (limited) return limited;

  const url = new URL(request.url);
  const deep = url.searchParams.get("deep") === "true";

  try {
    const report = deep ? await runAllHealthChecks() : await runLivenessChecks();

    const httpStatus = report.status === "fail" ? 503 : 200;

    if (report.status !== "pass") {
      logger.warn("Health endpoint returning non-pass status", {
        status: report.status,
        deep,
        checks: report.checks.map((c) => ({ name: c.name, status: c.status })),
      });
    }

    return NextResponse.json(report, {
      status: httpStatus,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Health-Status": report.status,
      },
    });
  } catch (err) {
    logger.error("Health endpoint crashed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      {
        status: "fail",
        timestamp: new Date().toISOString(),
        message: "Health check itself crashed",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 503 },
    );
  }
}
