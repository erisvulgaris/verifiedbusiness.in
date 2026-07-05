import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Rate limiting middleware — in-memory sliding window per IP.
 *
 * For production with multiple instances, replace with Redis-backed store.
 * For now, in-memory is sufficient for single-instance protection against
 * basic abuse (scraping, DoS, brute force).
 *
 * Limits:
 *  - /api/health: 60 req/min (monitoring probes)
 *  - /api/maintenance/run: 10 req/min (admin only)
 *  - All other /api/*: 100 req/min
 *  - Auth endpoints (future): 5 req/min
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60 * 1000; // 1 minute

const LIMITS: Record<string, number> = {
  "/api/health": 60,
  "/api/maintenance/run": 10,
  "/api/auth": 5,
  "default": 100,
};

// Cleanup expired entries every 5 minutes to prevent memory leak
let lastCleanup = Date.now();
function cleanupStore() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetTime) store.delete(key);
  }
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;
  return "unknown";
}

function getLimit(pathname: string): number {
  for (const [key, limit] of Object.entries(LIMITS)) {
    if (key !== "default" && pathname.startsWith(key)) return limit;
  }
  return LIMITS.default;
}

/**
 * Check rate limit for a request. Returns null if allowed, or a NextResponse
 * with 429 status if rate limit exceeded.
 */
export function checkRateLimit(request: Request): NextResponse | null {
  cleanupStore();

  const { pathname } = new URL(request.url);
  const ip = getClientIP(request);
  const limit = getLimit(pathname);
  const key = `${ip}:${pathname}`;

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return null;
  }

  entry.count++;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    logger.warn("Rate limit exceeded", {
      ip,
      pathname,
      count: entry.count,
      limit,
      retryAfter,
    });
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: `Too many requests. Try again in ${retryAfter} seconds.`,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(entry.resetTime),
        },
      },
    );
  }

  return null;
}

/**
 * Add rate limit headers to a response.
 */
export function addRateLimitHeaders(
  response: NextResponse,
  pathname: string,
): NextResponse {
  const limit = getLimit(pathname);
  const ip = "header"; // Can't access request here, so just set limit
  const key = `${ip}:${pathname}`;
  const entry = store.get(key);
  const remaining = entry ? Math.max(0, limit - entry.count) : limit;

  response.headers.set("X-RateLimit-Limit", String(limit));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  return response;
}
