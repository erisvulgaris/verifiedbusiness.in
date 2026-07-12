/**
 * Admin data helpers — stats, revenue, pending businesses, flagged reviews.
 *
 * All helpers operate on the mock BUSINESSES array. In production, replace
 * with Prisma queries. Function signatures stay the same.
 */

import {
  BUSINESSES,
  SUBSCRIPTION_PLANS,
  type Business,
  type Subscription,
  type SubscriptionPlan,
  type SubscriptionStatus,
  type Review,
} from "./directory-data";

/* ---------------- Types ---------------- */

export interface AdminStats {
  totalBusinesses: number;
  verifiedBusinesses: number;
  unverifiedBusinesses: number;
  pendingApprovals: number;
  activeSubscriptions: number;
  monthlySubscriptions: number;
  yearlySubscriptions: number;
  freeListings: number;
  flaggedReviews: number;
  totalReviews: number;
  mrr: number; // Monthly Recurring Revenue (₹)
  arr: number; // Annual Recurring Revenue (₹)
  totalRevenue: number; // All-time
}

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  planBreakdown: {
    free: { count: number; revenue: number };
    starter: { count: number; revenue: number };
    growth: { count: number; revenue: number };
    premium: { count: number; revenue: number };
    elite: { count: number; revenue: number };
    enterprise: { count: number; revenue: number };
    ultimate: { count: number; revenue: number };
    [key: string]: { count: number; revenue: number };
  };
  churnRate: number; // percentage
  expiringIn7Days: number;
  expiringIn30Days: number;
}

export interface RevenueTrendPoint {
  month: string;
  revenue: number;
  subscriptions: number;
}

export interface FlaggedReview {
  businessId: string;
  businessName: string;
  review: Review;
  flagReason: string;
  flaggedAt: string;
}

/* ---------------- Stats ---------------- */

export function getAdminStats(): AdminStats {
  const verified = BUSINESSES.filter((b) => b.verified);
  const unverified = BUSINESSES.filter((b) => !b.verified);
  const allReviews = BUSINESSES.flatMap((b) => b.reviews ?? []);
  const flagged = getFlaggedReviews();

  const activeSubs = BUSINESSES.filter(
    (b) => b.subscription.status === "active" && b.subscription.plan !== "free",
  );

  // Calculate revenue across all paid plans
  const totalRevenue = activeSubs.reduce((sum, b) => {
    const plan = SUBSCRIPTION_PLANS[b.subscription.plan as keyof typeof SUBSCRIPTION_PLANS];
    return sum + (plan?.price ?? 0);
  }, 0);
  const mrr = totalRevenue / 12; // All plans are annual, so MRR = annual/12
  const arr = mrr * 12;

  return {
    totalBusinesses: BUSINESSES.length,
    verifiedBusinesses: verified.length,
    unverifiedBusinesses: unverified.length,
    pendingApprovals: unverified.length,
    activeSubscriptions: activeSubs.length,
    monthlySubscriptions: activeSubs.filter((s) => s.subscription.plan === "starter" || s.subscription.plan === "growth").length,
    yearlySubscriptions: activeSubs.filter((s) => ["premium", "elite", "enterprise", "ultimate"].includes(s.subscription.plan)).length,
    freeListings: BUSINESSES.filter((b) => b.subscription.plan === "free").length,
    flaggedReviews: flagged.length,
    totalReviews: allReviews.length,
    mrr: Math.round(mrr),
    arr: Math.round(arr),
    totalRevenue: totalRevenue,
  };
}

/* ---------------- Revenue ---------------- */

export function getRevenueMetrics(): RevenueMetrics {
  const activeSubs = BUSINESSES.filter(
    (b) => b.subscription.status === "active" && b.subscription.plan !== "free",
  );
  const monthly = activeSubs.filter((s) => s.subscription.plan === "growth");
  const yearly = activeSubs.filter((s) => s.subscription.plan === "ultimate");
  const free = BUSINESSES.filter((b) => b.subscription.plan === "free");

  const monthlyRevenue = monthly.length * SUBSCRIPTION_PLANS.monthly.price;
  const yearlyRevenue = yearly.length * SUBSCRIPTION_PLANS.yearly.price;

  // Churn: expired + cancelled / total ever subscribed
  const allPaid = BUSINESSES.filter((b) => b.subscription.plan !== "free");
  const churned = allPaid.filter(
    (b) => b.subscription.status === "expired" || b.subscription.status === "cancelled",
  );
  const churnRate = allPaid.length > 0 ? (churned.length / allPaid.length) * 100 : 0;

  // Expiring soon
  const now = new Date();
  const expiring7 = BUSINESSES.filter((b) => {
    if (!b.subscription.endDate || b.subscription.plan === "free") return false;
    const end = new Date(b.subscription.endDate);
    const days = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 7;
  }).length;

  const expiring30 = BUSINESSES.filter((b) => {
    if (!b.subscription.endDate || b.subscription.plan === "free") return false;
    const end = new Date(b.subscription.endDate);
    const days = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 30;
  }).length;

  return {
    mrr: Math.round(monthlyRevenue + yearlyRevenue / 12),
    arr: Math.round((monthlyRevenue + yearlyRevenue / 12) * 12),
    totalRevenue: totalRevenue,
    totalRevenue,
    totalRevenue,
    planBreakdown: {
      free: { count: free.length, revenue: 0 },
      starter: { count: activeSubs.filter((s) => s.subscription.plan === "starter").length, revenue: activeSubs.filter((s) => s.subscription.plan === "starter").length * 999 },
      growth: { count: activeSubs.filter((s) => s.subscription.plan === "growth").length, revenue: activeSubs.filter((s) => s.subscription.plan === "growth").length * 4999 },
      premium: { count: activeSubs.filter((s) => s.subscription.plan === "premium").length, revenue: activeSubs.filter((s) => s.subscription.plan === "premium").length * 14999 },
      elite: { count: activeSubs.filter((s) => s.subscription.plan === "elite").length, revenue: activeSubs.filter((s) => s.subscription.plan === "elite").length * 29999 },
      enterprise: { count: activeSubs.filter((s) => s.subscription.plan === "enterprise").length, revenue: activeSubs.filter((s) => s.subscription.plan === "enterprise").length * 49999 },
      ultimate: { count: activeSubs.filter((s) => s.subscription.plan === "ultimate").length, revenue: activeSubs.filter((s) => s.subscription.plan === "ultimate").length * 499999 },
    },
    churnRate: Math.round(churnRate * 10) / 10,
    expiringIn7Days: expiring7,
    expiringIn30Days: expiring30,
  };
}

/** Revenue trend for the last 6 months (deterministic mock data). */
export function getRevenueTrend(): RevenueTrendPoint[] {
  const now = new Date();
  const months: RevenueTrendPoint[] = [];
  const baseRevenue = 35000;

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = d.toLocaleDateString("en-US", { month: "short" });
    // Deterministic growth pattern
    const growth = 1 + (5 - i) * 0.12;
    const revenue = Math.round(baseRevenue * growth + (i * 2345));
    const subscriptions = Math.round(28 + (5 - i) * 4);
    months.push({ month: monthLabel, revenue, subscriptions });
  }
  return months;
}

/* ---------------- Pending businesses ---------------- */

export function getPendingBusinesses(): Business[] {
  return BUSINESSES.filter((b) => !b.verified);
}

/* ---------------- Flagged reviews (mock) ---------------- */

const FLAG_REASONS = [
  "Reported as spam",
  "Inappropriate language",
  "Promotional content",
  "Disputed rating",
  "Personal information",
];

export function getFlaggedReviews(): FlaggedReview[] {
  const flagged: FlaggedReview[] = [];
  // Deterministically flag some reviews for moderation
  BUSINESSES.forEach((b) => {
    if (!b.reviews) return;
    b.reviews.forEach((r, i) => {
      // Flag ~15% of reviews deterministically
      const hash = (b.id.charCodeAt(1) ?? 0) + r.rating + i;
      if (hash % 7 === 0) {
        flagged.push({
          businessId: b.id,
          businessName: b.name,
          review: r,
          flagReason: FLAG_REASONS[hash % FLAG_REASONS.length],
          flaggedAt: "2026-06-28",
        });
      }
    });
  });
  return flagged;
}

/* ---------------- Subscription helpers ---------------- */

export function getBusinessesByPlan(plan: SubscriptionPlan): Business[] {
  return BUSINESSES.filter((b) => b.subscription.plan === plan);
}

export function getBusinessesByStatus(status: SubscriptionStatus): Business[] {
  return BUSINESSES.filter((b) => b.subscription.status === status);
}

export function getExpiringSubscriptions(days: number): Business[] {
  const now = new Date();
  return BUSINESSES.filter((b) => {
    if (!b.subscription.endDate || b.subscription.plan === "free") return false;
    const end = new Date(b.subscription.endDate);
    const diff = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= days;
  });
}

/* ---------------- Top categories ---------------- */

export interface CategoryStat {
  name: string;
  slug: string;
  count: number;
  verifiedCount: number;
}

export function getTopCategories(limit = 5): CategoryStat[] {
  const map = new Map<string, CategoryStat>();
  for (const b of BUSINESSES) {
    const existing = map.get(b.categorySlug);
    if (existing) {
      existing.count++;
      if (b.verified) existing.verifiedCount++;
    } else {
      map.set(b.categorySlug, {
        name: b.category,
        slug: b.categorySlug,
        count: 1,
        verifiedCount: b.verified ? 1 : 0,
      });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/* ---------------- Recent activity (mock) ---------------- */

export interface ActivityItem {
  id: string;
  type: "listing" | "subscription" | "review" | "verification" | "payment";
  message: string;
  timestamp: string;
  actor: string;
}

export function getRecentActivity(limit = 8): ActivityItem[] {
  return [
    { id: "a1", type: "subscription", message: "Sankalp South Indian Restaurant upgraded to Yearly plan", timestamp: "2 hours ago", actor: "system" },
    { id: "a2", type: "listing", message: "New listing submitted: Carz Service Hub", timestamp: "5 hours ago", actor: "carz.service@hub.in" },
    { id: "a3", type: "review", message: "Review flagged on Aster CMI Hospital", timestamp: "8 hours ago", actor: "moderation" },
    { id: "a4", type: "verification", message: "Allen Career Institute verified", timestamp: "1 day ago", actor: "admin@verifiedbusiness.in" },
    { id: "a5", type: "payment", message: "Payment received: ₹9,999 from Oberoi Realty", timestamp: "1 day ago", actor: "razorpay" },
    { id: "a6", type: "subscription", message: "Anand Sweets renewed Monthly plan", timestamp: "2 days ago", actor: "system" },
    { id: "a7", type: "listing", message: "Tunday Kababi updated operating hours", timestamp: "3 days ago", actor: "tunday@kababi.in" },
    { id: "a8", type: "review", message: "5 new reviews published", timestamp: "3 days ago", actor: "system" },
  ].slice(0, limit);
}

/* ---------------- Formatting helpers ---------------- */

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}
