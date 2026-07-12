import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/reviews — List reviews (optionally filtered by businessId)
 * POST /api/reviews — Create a review
 */
export async function GET(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get("businessId");
    const status = url.searchParams.get("status");
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 100);

    const where: Record<string, unknown> = {};
    if (businessId) where.businessId = businessId;
    if (status) where.status = status;

    const reviews = await db.review.findMany({
      where,
      take: limit,
      orderBy: { helpful: "desc" },
      include: { business: { select: { name: true } } },
    });

    return NextResponse.json({ reviews, total: reviews.length });
  } catch (err) {
    logger.error("Failed to list reviews", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const body = await request.json();

    if (!body.businessId || !body.author || !body.rating || !body.text) {
      return NextResponse.json({ error: "Missing required fields: businessId, author, rating, text" }, { status: 400 });
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const initials = body.author.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

    const review = await db.review.create({
      data: {
        businessId: body.businessId,
        author: body.author,
        initials,
        rating: body.rating,
        date: new Date().toISOString().slice(0, 10),
        text: body.text,
        status: "pending",
      },
    });

    // Update business rating + reviewCount
    const allReviews = await db.review.findMany({ where: { businessId: body.businessId, status: "approved" } });
    const avgRating = allReviews.length > 0 ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length : 0;
    await db.business.update({
      where: { id: body.businessId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length },
    });

    logger.info("Review created", { id: review.id, businessId: body.businessId });
    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    logger.error("Failed to create review", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
