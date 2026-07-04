"use client";

import { AdminLayout, KpiCard, StatusPill, AdminButton } from "./AdminLayout";
import {
  getAdminStats,
  getRevenueTrend,
  getTopCategories,
  getRecentActivity,
  formatINR,
  formatNumber,
  type ActivityItem,
} from "@/lib/admin-data";
import {
  Building2,
  BadgeCheck,
  CreditCard,
  TrendingUp,
  Star,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  DollarSign,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";

export function AdminDashboardView({
  onViewChange,
  onExitAdmin,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
}) {
  useDocumentTitle("Admin Dashboard | VerifiedBusiness.in");

  const stats = getAdminStats();
  const revenueTrend = getRevenueTrend();
  const topCategories = getTopCategories(5);
  const activity = getRecentActivity(6);

  const maxRevenue = Math.max(...revenueTrend.map((r) => r.revenue));
  const maxCategory = Math.max(...topCategories.map((c) => c.count));

  return (
    <AdminLayout
      activeView="admin-dashboard"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="Dashboard"
      subtitle="Platform overview — last 30 days"
      actions={
        <AdminButton variant="secondary" size="sm" onClick={() => onViewChange("admin-businesses")}>
          <Building2 size={14} strokeWidth={2.5} />
          Manage businesses
        </AdminButton>
      }
    >
      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          label="Total businesses"
          value={formatNumber(stats.totalBusinesses)}
          delta="+12% vs last month"
          deltaPositive
          icon={Building2}
        />
        <KpiCard
          label="Verified"
          value={formatNumber(stats.verifiedBusinesses)}
          delta={`${Math.round((stats.verifiedBusinesses / stats.totalBusinesses) * 100)}% of total`}
          deltaPositive
          icon={BadgeCheck}
        />
        <KpiCard
          label="Active subscriptions"
          value={formatNumber(stats.activeSubscriptions)}
          delta={`${stats.monthlySubscriptions} monthly · ${stats.yearlySubscriptions} yearly`}
          deltaPositive
          icon={CreditCard}
          accent
        />
        <KpiCard
          label="Monthly revenue (MRR)"
          value={formatINR(stats.mrr)}
          delta="+18% vs last month"
          deltaPositive
          icon={TrendingUp}
        />
        <KpiCard
          label="Pending approvals"
          value={formatNumber(stats.pendingApprovals)}
          delta={stats.pendingApprovals > 0 ? "Needs attention" : "All caught up"}
          deltaPositive={stats.pendingApprovals === 0}
          icon={AlertTriangle}
        />
        <KpiCard
          label="Flagged reviews"
          value={formatNumber(stats.flaggedReviews)}
          delta={stats.flaggedReviews > 0 ? "Awaiting moderation" : "None"}
          deltaPositive={stats.flaggedReviews === 0}
          icon={Star}
        />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue trend chart */}
        <div className="border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2
                className="font-display font-semibold"
                style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)" }}
              >
                Revenue trend
              </h2>
              <p
                style={{
                  color: "var(--color-text-tertiary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                }}
              >
                Last 6 months · INR
              </p>
            </div>
            <span
              className="font-display font-bold"
              style={{ color: "var(--color-success)", fontSize: "var(--text-sm)" }}
            >
              ▲ 42%
            </span>
          </div>
          {/* Bar chart */}
          <div className="flex items-end justify-between gap-2 h-40">
            {revenueTrend.map((point) => {
              const heightPct = (point.revenue / maxRevenue) * 100;
              return (
                <div key={point.month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-[4px] transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: "var(--color-accent)",
                      minHeight: 8,
                    }}
                    title={`${point.month}: ${formatINR(point.revenue)}`}
                  />
                  <span
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 11,
                    }}
                  >
                    {point.month}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
            <span
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            >
              This month
            </span>
            <span
              className="font-display font-bold"
              style={{ color: "var(--color-text-primary)", fontSize: "var(--text-lg)" }}
            >
              {formatINR(revenueTrend[revenueTrend.length - 1].revenue)}
            </span>
          </div>
        </div>

        {/* Subscription donut + breakdown */}
        <div className="border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] p-5">
          <h2
            className="font-display font-semibold mb-1"
            style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)" }}
          >
            Subscription plans
          </h2>
          <p
            className="mb-5"
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            Active distribution
          </p>

          {/* Stacked bar (simpler than donut, no external lib) */}
          <div className="flex h-3 rounded-full overflow-hidden mb-5">
            <div
              style={{
                width: `${(stats.freeListings / stats.totalBusinesses) * 100}%`,
                backgroundColor: "var(--color-border-strong)",
              }}
              title={`Free: ${stats.freeListings}`}
            />
            <div
              style={{
                width: `${(stats.monthlySubscriptions / stats.totalBusinesses) * 100}%`,
                backgroundColor: "var(--color-accent)",
              }}
              title={`Monthly: ${stats.monthlySubscriptions}`}
            />
            <div
              style={{
                width: `${(stats.yearlySubscriptions / stats.totalBusinesses) * 100}%`,
                backgroundColor: "var(--color-success)",
              }}
              title={`Yearly: ${stats.yearlySubscriptions}`}
            />
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <LegendRow
              color="var(--color-border-strong)"
              label="Free"
              count={stats.freeListings}
              total={stats.totalBusinesses}
            />
            <LegendRow
              color="var(--color-accent)"
              label="Monthly · ₹999"
              count={stats.monthlySubscriptions}
              total={stats.totalBusinesses}
            />
            <LegendRow
              color="var(--color-success)"
              label="Yearly · ₹9,999"
              count={stats.yearlySubscriptions}
              total={stats.totalBusinesses}
            />
          </div>
        </div>
      </div>

      {/* Bottom row: top categories + recent activity */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top categories */}
        <div className="border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] p-5">
          <h2
            className="font-display font-semibold mb-5"
            style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)" }}
          >
            Top categories by listings
          </h2>
          <div className="space-y-3">
            {topCategories.map((cat) => {
              const widthPct = (cat.count / maxCategory) * 100;
              return (
                <div key={cat.slug}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="font-medium"
                      style={{
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {cat.name}
                    </span>
                    <span
                      style={{
                        color: "var(--color-text-tertiary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {cat.count} listings · {cat.verifiedCount} verified
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--color-surface-2)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: "var(--color-accent)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div className="border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="font-display font-semibold"
              style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)" }}
            >
              Recent activity
            </h2>
            <button
              type="button"
              className="font-medium transition-colors hover:text-[var(--color-accent)]"
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              View all
            </button>
          </div>
          <ul className="space-y-3">
            {activity.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickAction
          icon={Building2}
          title="Review pending"
          description={`${stats.pendingApprovals} businesses awaiting approval`}
          onClick={() => onViewChange("admin-businesses")}
        />
        <QuickAction
          icon={Star}
          title="Moderate reviews"
          description={`${stats.flaggedReviews} reviews need attention`}
          onClick={() => onViewChange("admin-reviews")}
        />
        <QuickAction
          icon={CreditCard}
          title="View revenue"
          description={`${formatINR(stats.mrr)} MRR · ${formatINR(stats.arr)} ARR`}
          onClick={() => onViewChange("admin-subscriptions")}
        />
      </div>
    </AdminLayout>
  );
}

/* ---------------- Sub-components ---------------- */

function LegendRow({
  color,
  label,
  count,
  total,
}: {
  color: string;
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className="inline-block"
          style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color }}
        />
        <span
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="font-display font-semibold"
          style={{
            color: "var(--color-text-primary)",
            fontSize: "var(--text-sm)",
          }}
        >
          {count}
        </span>
        <span
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          ({pct}%)
        </span>
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const iconMap: Record<ActivityItem["type"], typeof Building2> = {
    listing: FileText,
    subscription: CreditCard,
    review: Star,
    verification: BadgeCheck,
    payment: DollarSign,
  };
  const Icon = iconMap[item.type];
  return (
    <li className="flex items-start gap-3">
      <div
        className="shrink-0 inline-flex items-center justify-center mt-0.5"
        style={{
          width: 28,
          height: 28,
          borderRadius: "var(--radius-sm)",
          backgroundColor: "var(--color-accent-light)",
        }}
      >
        <Icon size={14} strokeWidth={2.2} style={{ color: "var(--color-accent)" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="leading-snug"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          {item.message}
        </p>
        <p
          className="mt-0.5"
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          {item.timestamp} · by {item.actor}
        </p>
      </div>
    </li>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-start gap-3 border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] p-4 text-left transition-all duration-200 hover:border-[var(--color-accent-border)] hover:shadow-[var(--shadow-sm)]"
    >
      <div
        className="shrink-0 inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--color-accent-light)",
        }}
      >
        <Icon size={18} strokeWidth={2.2} style={{ color: "var(--color-accent)" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="font-display font-semibold"
          style={{
            color: "var(--color-text-primary)",
            fontSize: "var(--text-sm)",
          }}
        >
          {title}
        </p>
        <p
          className="mt-0.5"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
            lineHeight: "16px",
          }}
        >
          {description}
        </p>
      </div>
      <ArrowRight
        size={14}
        strokeWidth={2.5}
        className="shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-0.5"
        style={{ color: "var(--color-text-tertiary)" }}
      />
    </button>
  );
}
