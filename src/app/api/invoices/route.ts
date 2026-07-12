import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/invoices — List invoices (optionally filtered by businessId)
 */
export async function GET(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get("businessId");

    const where: Record<string, unknown> = {};
    if (businessId) where.businessId = businessId;

    const invoices = await db.invoice.findMany({
      where,
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { business: { select: { name: true } } },
    });

    return NextResponse.json({ invoices, total: invoices.length });
  } catch (err) {
    logger.error("Failed to list invoices", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
