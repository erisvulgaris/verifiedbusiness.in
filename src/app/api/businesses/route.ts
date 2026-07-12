import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/businesses — List businesses with filters
 * POST /api/businesses — Create a new business listing
 */
export async function GET(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const city = url.searchParams.get("city");
    const verified = url.searchParams.get("verified");
    const plan = url.searchParams.get("plan");
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 100);
    const offset = parseInt(url.searchParams.get("offset") ?? "0");

    const where: Record<string, unknown> = {};
    if (category) where.categorySlug = category;
    if (city) where.cityId = city;
    if (verified === "true") where.verified = true;
    if (plan) where.subscriptionPlan = plan;

    const businesses = await db.business.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { rating: "desc" },
      include: { category: true, reviews: { take: 3, orderBy: { helpful: "desc" } } },
    });

    return NextResponse.json({ businesses, total: businesses.length, limit, offset });
  } catch (err) {
    logger.error("Failed to list businesses", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.phone || !body.address) {
      return NextResponse.json({ error: "Missing required fields: name, phone, address" }, { status: 400 });
    }

    // Ensure category exists, create if not
    const categorySlug = body.categorySlug ?? "restaurants";
    try {
      await db.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: { name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1), slug: categorySlug, description: `${categorySlug} category` },
      });
    } catch {
      // Category might already exist, ignore
    }

    const business = await db.business.create({
      data: {
        name: body.name,
        categorySlug: body.categorySlug ?? "restaurants",
        address: body.address,
        pincode: body.pincode ?? "",
        phone: body.phone,
        website: body.website ?? null,
        email: body.email ?? null,
        hours: body.hours ?? "9:00 AM – 9:00 PM",
        description: body.description ?? "",
        paymentMethods: JSON.stringify(body.paymentMethods ?? []),
        highlights: JSON.stringify(body.highlights ?? []),
        tags: JSON.stringify(body.tags ?? []),
        subscriptionPlan: "free",
        subscriptionStatus: "active",
        claimStatus: "unclaimed",
      },
    });

    logger.info("Business created", { id: business.id, name: business.name });
    return NextResponse.json(business, { status: 201 });
  } catch (err) {
    logger.error("Failed to create business", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 });
  }
}
