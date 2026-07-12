import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/notifications — List notifications for current user
 * POST /api/notifications — Create a notification
 */
export async function GET(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get("unread") === "true";

    const where: Record<string, unknown> = {};
    if (unreadOnly) where.read = false;

    const notifications = await db.notification.findMany({
      where,
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = await db.notification.count({ where: { read: false } });

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    logger.error("Failed to list notifications", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  try {
    const body = await request.json();

    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Missing required fields: title, description" }, { status: 400 });
    }

    const notification = await db.notification.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type ?? "info",
        userId: body.userId ?? null,
        actionUrl: body.actionUrl ?? null,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (err) {
    logger.error("Failed to create notification", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
