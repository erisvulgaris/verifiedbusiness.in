import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/search — Server-side full-text search across businesses
 *
 * Searches: name, category, description, locality, city, state, pincode, tags
 * Returns: paginated results with relevance sorting
 */
export async function GET(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    const location = url.searchParams.get("location") ?? "";
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 100);
    const offset = parseInt(url.searchParams.get("offset") ?? "0");

    if (!q && !location) {
      return NextResponse.json({ error: "Provide at least one of: q, location" }, { status: 400 });
    }

    // Build where clause
    const conditions: unknown[] = [];

    if (q) {
      conditions.push({
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { pincode: { contains: q } },
          { tags: { contains: q } },
          { categorySlug: { contains: q } },
        ],
      });
    }

    if (location) {
      conditions.push({
        OR: [
          { pincode: { contains: location } },
          { stateCode: { contains: location } },
        ],
      });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    const businesses = await db.business.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: [{ verified: "desc" }, { subscriptionPlan: "desc" }, { rating: "desc" }],
      select: {
        id: true,
        name: true,
        categorySlug: true,
        rating: true,
        reviewCount: true,
        address: true,
        pincode: true,
        phone: true,
        hours: true,
        verified: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        description: true,
        tags: true,
      },
    });

    const total = await db.business.count({ where });

    return NextResponse.json({
      businesses,
      total,
      limit,
      offset,
      query: q,
      location,
    });
  } catch (err) {
    logger.error("Search failed", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
