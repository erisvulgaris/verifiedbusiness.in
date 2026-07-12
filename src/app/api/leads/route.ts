import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/leads — List leads (optionally filtered by businessId)
 * POST /api/leads — Create a lead (customer enquiry / Get Quote)
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

    const leads = await db.lead.findMany({
      where,
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { business: { select: { name: true, phone: true, email: true } } },
    });

    return NextResponse.json({ leads, total: leads.length });
  } catch (err) {
    logger.error("Failed to list leads", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const body = await request.json();

    if (!body.businessId || !body.name || !body.phone || !body.message) {
      return NextResponse.json({ error: "Missing required fields: businessId, name, phone, message" }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        businessId: body.businessId,
        name: body.name,
        phone: body.phone,
        email: body.email ?? null,
        message: body.message,
        source: body.source ?? "website",
        status: "new",
      },
    });

    logger.info("Lead created", { id: lead.id, businessId: body.businessId, name: body.name });

    // In production: send email/SMS to business owner here
    // await sendLeadNotification(business, lead);

    return NextResponse.json(lead, { status: 201 });
  } catch (err) {
    logger.error("Failed to create lead", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
