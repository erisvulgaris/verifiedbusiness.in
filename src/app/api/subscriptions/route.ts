import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { SUBSCRIPTION_PLANS } from "@/lib/directory-data";

/**
 * GET /api/subscriptions — List all subscriptions (admin)
 * POST /api/subscriptions — Create/update a subscription (activate plan)
 */
export async function GET(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) where.subscriptionStatus = status;
    where.subscriptionPlan = { not: "free" };

    const subscriptions = await db.business.findMany({
      where,
      select: {
        id: true,
        name: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        subscriptionAmount: true,
        subscriptionAutoRenew: true,
      },
      take: 50,
      orderBy: { subscriptionEnd: "asc" },
    });

    return NextResponse.json({ subscriptions, total: subscriptions.length });
  } catch (err) {
    logger.error("Failed to list subscriptions", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const body = await request.json();

    if (!body.businessId || !body.plan) {
      return NextResponse.json({ error: "Missing required fields: businessId, plan" }, { status: 400 });
    }

    const plan = SUBSCRIPTION_PLANS[body.plan as keyof typeof SUBSCRIPTION_PLANS];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    // Try to update, if business doesn't exist in DB, return error
    let business;
    try {
      business = await db.business.update({
        where: { id: body.businessId },
        data: {
          subscriptionPlan: body.plan,
          subscriptionStatus: "active",
          subscriptionStart: now,
          subscriptionEnd: plan.durationDays > 0 ? endDate : null,
          subscriptionAmount: plan.price,
          subscriptionAutoRenew: body.autoRenew ?? true,
          verified: body.plan !== "free",
        },
      });

      // Increment ad credit
      if (plan.adCredit > 0) {
        await db.business.update({
          where: { id: body.businessId },
          data: { adCredit: { increment: plan.adCredit } },
        });
      }
    } catch {
      return NextResponse.json({ error: "Business not found in database. Mock data businesses exist only in TypeScript, not in the database." }, { status: 404 });
    }

    // Create invoice
    const invoiceNumber = `INV-${Date.now()}-${body.businessId.slice(-4)}`;
    await db.invoice.create({
      data: {
        businessId: body.businessId,
        invoiceNumber,
        amount: plan.price,
        plan: body.plan,
        period: `1 year (${now.toISOString().slice(0, 10)} to ${endDate.toISOString().slice(0, 10)})`,
        status: "paid",
      },
    });

    logger.info("Subscription activated", { businessId: body.businessId, plan: body.plan, amount: plan.price });

    return NextResponse.json({ business, invoiceNumber }, { status: 200 });
  } catch (err) {
    logger.error("Failed to activate subscription", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to activate subscription" }, { status: 500 });
  }
}
