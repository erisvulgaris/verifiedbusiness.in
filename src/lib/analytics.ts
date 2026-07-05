"use client";

import { logger } from "@/lib/logger";

/**
 * Client-side analytics event tracking.
 *
 * Tracks user interactions (page views, searches, clicks) and sends them
 * to an analytics endpoint. In production, this would forward to Mixpanel,
 * Amplitude, or a self-hosted analytics service.
 *
 * For now, events are batched and logged via the structured logger + sent
 * to /api/analytics (which logs them server-side).
 *
 * Usage:
 *   import { track } from "@/lib/analytics";
 *   track.event("business_viewed", { id: "b1", name: "Sankalp" });
 *   track.pageView("home");
 */

type EventType =
  | "page_view"
  | "search"
  | "business_viewed"
  | "favorite_added"
  | "favorite_removed"
  | "compare_added"
  | "compare_removed"
  | "category_selected"
  | "location_selected"
  | "review_submitted"
  | "listing_submitted"
  | "contact_clicked"
  | "phone_copied"
  | "directions_clicked"
  | "website_clicked"
  | "filter_applied"
  | "sort_changed"
  | "export_csv"
  | "admin_action"
  | "command_palette_opened"
  | "keyboard_shortcut_used";

interface AnalyticsEvent {
  type: EventType;
  timestamp: string;
  props?: Record<string, unknown>;
  sessionId: string;
  pageUrl: string;
}

const BATCH_SIZE = 10;
const BATCH_TIMEOUT_MS = 5000;
let batch: AnalyticsEvent[] = [];
let batchTimer: ReturnType<typeof setTimeout> | null = null;

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "verifiedbusiness:session-id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

async function flushBatch(): Promise<void> {
  if (batch.length === 0) return;
  const events = [...batch];
  batch = [];
  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }

  try {
    // Fire-and-forget — don't block UI
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events }),
      keepalive: true, // Allow request to complete even if page unloads
    }).catch(() => {
      // Silently fail — analytics is non-critical
    });
  } catch {
    // Silently fail
  }
}

function addToBatch(event: AnalyticsEvent): void {
  batch.push(event);
  if (batch.length >= BATCH_SIZE) {
    void flushBatch();
  } else if (!batchTimer) {
    batchTimer = setTimeout(() => void flushBatch(), BATCH_TIMEOUT_MS);
  }
}

export const track = {
  /** Track a custom event with optional properties */
  event(type: EventType, props?: Record<string, unknown>): void {
    if (typeof window === "undefined") return;
    addToBatch({
      type,
      timestamp: new Date().toISOString(),
      props,
      sessionId: getSessionId(),
      pageUrl: window.location.pathname,
    });
  },

  /** Track a page view */
  pageView(page: string): void {
    this.event("page_view", { page });
  },

  /** Track a search query */
  search(query: string, resultsCount: number, location?: string): void {
    this.event("search", { query, resultsCount, location });
  },

  /** Track a business being viewed */
  businessViewed(businessId: string, businessName: string): void {
    this.event("business_viewed", { businessId, businessName });
  },

  /** Track admin actions */
  adminAction(action: string, target?: string): void {
    this.event("admin_action", { action, target });
  },

  /** Flush pending events immediately (e.g., on page unload) */
  flush(): void {
    void flushBatch();
  },
};

// Flush on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    track.flush();
  });
}
