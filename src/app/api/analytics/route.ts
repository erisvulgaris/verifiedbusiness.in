import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/analytics
 *
 * Receives batched analytics events from the client.
 * Logs them via the structured logger (server-side).
 *
 * In production, this would forward to Mixpanel/Amplitude/Datadog.
 *
 * Rate limited: 100 req/min per IP (analytics is high-volume but non-critical)
 */
export async function POST(request: Request) {
  // Rate limit
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const body = await request.json();
    const events = Array.isArray(body?.events) ? body.events : [];

    if (events.length === 0) {
      return NextResponse.json({ received: 0 });
    }

    // Log each event (batched in production)
    for (const event of events) {
      logger.info("Analytics event", {
        type: event.type,
        page: event.pageUrl,
        session: event.sessionId?.slice(0, 16),
        ...event.props,
      });
    }

    return NextResponse.json({
      received: events.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error("Analytics endpoint error", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }
}

/**
 * GET /api/analytics
 *
 * Returns recent analytics event counts (for admin dashboard).
 * In production, this would query the analytics database.
 */
export async function GET(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  // Mock analytics summary — in production, query from analytics store
  return NextResponse.json({
    summary: {
      totalEvents: 0,
      uniqueSessions: 0,
      topEvents: {},
      last24h: {
        pageViews: 0,
        searches: 0,
        businessViews: 0,
        favoriteAdds: 0,
        compareAdds: 0,
      },
    },
    note: "Analytics aggregation not yet implemented — events are logged but not aggregated",
    timestamp: new Date().toISOString(),
  });
}
