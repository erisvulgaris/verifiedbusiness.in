import { NextResponse } from "next/server";

/**
 * GET /api
 *
 * API root — returns metadata about the available endpoints.
 * Useful for discovery and as a sanity check that the API is up.
 */
export async function GET() {
  return NextResponse.json({
    name: "VerifiedBusiness.in API",
    version: "1.0.0",
    description: "Premium local business directory for India",
    endpoints: {
      health: {
        path: "/api/health",
        method: "GET",
        description: "Liveness probe (fast)",
        params: "?deep=true for full readiness checks",
      },
      maintenance: {
        path: "/api/maintenance/run",
        method: "POST",
        description: "Trigger a maintenance cycle (cron-invoked)",
      },
      maintenanceLatest: {
        path: "/api/maintenance/run",
        method: "GET",
        description: "Read the latest maintenance report",
      },
    },
    documentation: "/style-guide",
    timestamp: new Date().toISOString(),
  });
}
