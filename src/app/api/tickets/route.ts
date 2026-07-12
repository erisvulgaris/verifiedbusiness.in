import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/tickets — List support tickets
 * POST /api/tickets — Create a support ticket
 */
export async function GET(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tickets = await db.supportTicket.findMany({
      where,
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets, total: tickets.length });
  } catch (err) {
    logger.error("Failed to list tickets", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const body = await request.json();

    if (!body.subject || !body.fromEmail || !body.message) {
      return NextResponse.json({ error: "Missing required fields: subject, fromEmail, message" }, { status: 400 });
    }

    const ticket = await db.supportTicket.create({
      data: {
        subject: body.subject,
        fromEmail: body.fromEmail,
        fromName: body.fromName ?? body.fromEmail,
        businessId: body.businessId ?? null,
        category: body.category ?? "general",
        priority: body.priority ?? "medium",
        status: "open",
        message: body.message,
      },
    });

    logger.info("Support ticket created", { id: ticket.id, subject: body.subject });
    return NextResponse.json(ticket, { status: 201 });
  } catch (err) {
    logger.error("Failed to create ticket", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
