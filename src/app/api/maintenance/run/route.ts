import { NextResponse } from "next/server";
import { runMaintenance } from "@/lib/maintenance";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/maintenance/run
 *
 * Triggers a full maintenance cycle. Intended to be called by the recurring
 * cron job every 15 minutes, but can also be triggered manually.
 *
 * Returns the full maintenance result including health report, cleanup stats,
 * and any detected maintenance tasks.
 *
 * Security: in production, this endpoint requires a CRON_SECRET header.
 */
export async function POST(request: Request) {
  // Rate limit
  const limited = checkRateLimit(request);
  if (limited) return limited;

  // In production, require a secret header to prevent abuse
  if (process.env.NODE_ENV === "production") {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const provided = request.headers.get("x-cron-secret");
      if (provided !== secret) {
        logger.warn("Maintenance endpoint rejected — invalid secret");
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 },
        );
      }
    }
  }

  try {
    logger.info("Maintenance triggered via API");
    const result = await runMaintenance();

    const httpStatus = result.healthReport.status === "fail" ? 503 : 200;

    return NextResponse.json(result, {
      status: httpStatus,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err) {
    logger.error("Maintenance endpoint crashed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      {
        error: "Maintenance run failed",
        message: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/maintenance/run
 *
 * Reads the latest health report from disk (without triggering a new run).
 */
export async function GET() {
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const reportPath = path.join(process.cwd(), ".health", "latest.json");

    const content = await fs.readFile(reportPath, "utf-8");
    const report = JSON.parse(content);

    return NextResponse.json(report, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      {
        message: "No maintenance report available yet",
        timestamp: new Date().toISOString(),
      },
      { status: 404 },
    );
  }
}
