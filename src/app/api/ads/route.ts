import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/ads — List ad campaigns (optionally filtered by businessId or status)
 * POST /api/ads — Create an ad campaign
 */
export async function GET(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get("businessId");
    const status = url.searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (businessId) where.businessId = businessId;
    if (status) where.status = status;

    const campaigns = await db.adCampaign.findMany({
      where,
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { business: { select: { name: true } } },
    });

    return NextResponse.json({ campaigns, total: campaigns.length });
  } catch (err) {
    logger.error("Failed to list ad campaigns", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const body = await request.json();

    if (!body.businessId || !body.headline || !body.description) {
      return NextResponse.json({ error: "Missing required fields: businessId, headline, description" }, { status: 400 });
    }

    const campaign = await db.adCampaign.create({
      data: {
        businessId: body.businessId,
        platform: body.platform ?? "meta",
        status: "draft",
        headline: body.headline,
        description: body.description,
        imageUrl: body.imageUrl ?? null,
        targetCity: body.targetCity ?? null,
        targetRadius: body.targetRadius ?? 10,
        budget: body.budget ?? 0,
      },
    });

    logger.info("Ad campaign created", { id: campaign.id, businessId: body.businessId });

    // In production: submit to Meta Marketing API here
    // await createMetaCampaign(campaign);

    return NextResponse.json(campaign, { status: 201 });
  } catch (err) {
    logger.error("Failed to create ad campaign", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
