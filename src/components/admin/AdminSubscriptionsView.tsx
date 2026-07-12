"use client";

import { useState, useMemo } from "react";
import { AdminLayout, KpiCard, StatusPill, AdminButton, AdminTable } from "./AdminLayout";
import {
  getRevenueMetrics,
  getRevenueTrend,
  formatINR,
  formatNumber,
} from "@/lib/admin-data";
import { BUSINESSES, SUBSCRIPTION_PLANS, type SubscriptionStatus } from "@/lib/directory-data";
import {
  TrendingUp,
  DollarSign,
  RefreshCw,
  AlertCircle,
  Calendar,
  Download,
  Search,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";

export function AdminSubscriptionsView({
  onViewChange,
  onExitAdmin,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
}) {
  useDocumentTitle("Subscriptions & Revenue | Admin · VerifiedBusiness.in");

  const metrics = getRevenueMetrics();
  const trend = getRevenueTrend();
  const [filterStatus, setFilterStatus] = useState<"all" | SubscriptionStatus>("all");
  const [filterPlan, setFilterPlan] = useState<"all" | "free" | "growth" | "ultimate">("all");
  const [search, setSearch] = useState("");

  const subscribed = BUSINESSES.filter((b) => b.subscription.plan !== "free");

  const filtered = useMemo(() => {
    return subscribed.filter((b) => {
      if (filterStatus !== "all" && b.subscription.status !== filterStatus) return false;
      if (filterPlan !== "all" && b.subscription.plan !== filterPlan) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!b.name.toLowerCase().includes(q) && !b.city.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [subscribed, filterStatus, filterPlan, search]);

  const maxRevenue = Math.max(...trend.map((t) => t.revenue));

  return (
    <AdminLayout
      activeView="admin-subscriptions"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="Subscriptions & revenue"
      subtitle="Track MRR, ARR, churn, and manage active subscriptions"
      actions={
        <AdminButton variant="secondary" size="sm">
          <Download size={14} strokeWidth={2.5} />
          Export CSV
        </AdminButton>
      }
    >
      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="MRR"
          value={formatINR(metrics.mrr)}
          delta="+18% MoM"
          deltaPositive
          icon={TrendingUp}
          accent
        />
        <KpiCard
          label="ARR"
          value={formatINR(metrics.arr)}
          delta="+24% YoY"
          deltaPositive
          icon={DollarSign}
        />
        <KpiCard
          label="Total revenue"
          value={formatINR(metrics.totalRevenue)}
          delta="All-time"
          icon={DollarSign}
        />
        <KpiCard
          label="Churn rate"
          value={`${metrics.churnRate}%`}
          delta={metrics.churnRate > 5 ? "Above target" : "Within target"}
          deltaPositive={metrics.churnRate <= 5}
          icon={RefreshCw}
        />
      </div>

      {/* Plan breakdown */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {(["free", "starter", "growth", "premium", "elite", "enterprise", "ultimate"] as const).map((pk) => {
          const planCount = BUSINESSES.filter((b) => b.subscription.plan === pk && b.subscription.status === "active").length;
          const planRevenue = planCount * (SUBSCRIPTION_PLANS[pk]?.price ?? 0);
          return (
            <PlanCard
              key={pk}
              planKey={pk}
              count={planCount}
              revenue={planRevenue}
            />
          );
        })}
      </div>

      {/* Revenue chart */}
      <div className="mt-6 border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] p-5">
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
              Last 6 months
            </p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-48">
          {trend.map((point) => {
            const heightPct = (point.revenue / maxRevenue) * 100;
            return (
              <div key={point.month} className="flex-1 flex flex-col items-center gap-2 h-full">
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="w-full rounded-t-[4px] transition-all duration-300 hover:opacity-80 relative group"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: "var(--color-accent)",
                      minHeight: 8,
                    }}
                  >
                    <div
                      className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded whitespace-nowrap"
                      style={{
                        backgroundColor: "var(--color-text-primary)",
                        color: "var(--color-text-inverse)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    >
                      {formatINR(point.revenue)}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 11,
                    }}
                  >
                    {point.month}
                  </p>
                  <p
                    className="font-medium"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 10,
                    }}
                  >
                    {point.subscriptions} subs
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expiring alerts */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="border rounded-[12px] p-4 flex items-center gap-3"
          style={{
            backgroundColor: "var(--color-warning-light)",
            borderColor: "var(--color-warning)",
          }}
        >
          <AlertCircle size={20} strokeWidth={2.5} style={{ color: "var(--color-warning)" }} />
          <div className="flex-1">
            <p
              className="font-display font-semibold"
              style={{ color: "var(--color-text-primary)", fontSize: "var(--text-sm)" }}
            >
              {metrics.expiringIn7Days} subscriptions expiring in 7 days
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              Send renewal reminders to avoid churn
            </p>
          </div>
        </div>
        <div
          className="border rounded-[12px] p-4 flex items-center gap-3"
          style={{
            backgroundColor: "var(--color-surface-2)",
            borderColor: "var(--color-border)",
          }}
        >
          <Calendar size={20} strokeWidth={2.5} style={{ color: "var(--color-accent)" }} />
          <div className="flex-1">
            <p
              className="font-display font-semibold"
              style={{ color: "var(--color-text-primary)", fontSize: "var(--text-sm)" }}
            >
              {metrics.expiringIn30Days} subscriptions expiring in 30 days
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              Consider offering yearly upgrade discount
            </p>
          </div>
        </div>
      </div>

      {/* Subscriptions table */}
      <div className="mt-6">
        <h2
          className="font-display font-bold mb-4"
          style={{ fontSize: "var(--text-xl)", color: "var(--color-text-primary)" }}
        >
          Active subscriptions
        </h2>

        {/* Filters */}
        <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 flex-1 border rounded-[8px]"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-strong)",
            }}
          >
            <Search size={16} strokeWidth={2} style={{ color: "var(--color-text-tertiary)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by business name or city..."
              className="w-full bg-transparent border-0 outline-none py-2.5"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            />
          </div>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value as typeof filterPlan)}
            className="px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
              borderColor: "var(--color-border-strong)",
            }}
          >
            <option value="all">All plans</option>
            <option value="starter">Starter (₹999)</option>
            <option value="growth">Growth (₹4,999)</option>
            <option value="premium">Premium (₹14,999)</option>
            <option value="elite">Elite (₹29,999)</option>
            <option value="enterprise">Enterprise (₹49,999)</option>
            <option value="ultimate">Ultimate (₹4,99,999)</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
              borderColor: "var(--color-border-strong)",
            }}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <AdminTable headers={["Business", "Plan", "Status", "Amount", "Start", "End", "Auto-renew"]}>
          {filtered.map((b) => (
            <tr
              key={b.id}
              className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors"
            >
              <td className="px-4 py-3">
                <p
                  className="font-medium"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {b.name}
                </p>
                <p
                  style={{
                    color: "var(--color-text-tertiary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {b.city}
                </p>
              </td>
              <td className="px-4 py-3">
                <span
                  className="font-medium"
                  style={{
                    color: "var(--color-accent)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {SUBSCRIPTION_PLANS[b.subscription.plan].label}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusPill
                  status={b.subscription.status}
                  label={b.subscription.status.charAt(0).toUpperCase() + b.subscription.status.slice(1)}
                />
              </td>
              <td className="px-4 py-3">
                <span
                  className="font-display font-semibold"
                  style={{
                    color: "var(--color-text-primary)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {formatINR(b.subscription.amount)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {b.subscription.startDate || "—"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {b.subscription.endDate || "—"}
                </span>
              </td>
              <td className="px-4 py-3">
                {b.subscription.autoRenew ? (
                  <span
                    className="inline-flex items-center gap-1 font-medium"
                    style={{
                      color: "var(--color-success)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    <RefreshCw size={10} strokeWidth={2.5} />
                    On
                  </span>
                ) : (
                  <span
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    Off
                  </span>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center">
                <p
                  className="font-display font-semibold"
                  style={{ color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}
                >
                  No subscriptions match
                </p>
                <p
                  className="mt-1"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  Try a different filter.
                </p>
              </td>
            </tr>
          )}
        </AdminTable>

        <p
          className="mt-3"
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          Showing {filtered.length} of {subscribed.length} paid subscriptions
        </p>
      </div>
    </AdminLayout>
  );
}

/* ---------------- Plan card ---------------- */
function PlanCard({
  planKey,
  count,
  revenue,
}: {
  planKey: "free" | "starter" | "growth" | "premium" | "elite" | "enterprise" | "ultimate";
  count: number;
  revenue: number;
}) {
  const plan = SUBSCRIPTION_PLANS[planKey];
  const isFree = planKey === "free";
  return (
    <div
      className="border rounded-[12px] p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: isFree ? "var(--color-border)" : "var(--color-accent-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p
          className="font-display font-semibold"
          style={{ color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}
        >
          {plan.label}
        </p>
        <span
          className="font-display font-bold"
          style={{
            color: isFree ? "var(--color-text-tertiary)" : "var(--color-accent)",
            fontSize: "var(--text-lg)",
          }}
        >
          {plan.price === 0 ? "₹0" : formatINR(plan.price)}
        </span>
      </div>
      <p
        className="font-display font-bold"
        style={{ color: "var(--color-text-primary)", fontSize: "var(--text-2xl)", letterSpacing: "-0.3px" }}
      >
        {formatNumber(count)}
      </p>
      <p
        style={{
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-xs)",
        }}
      >
        {count === 1 ? "business" : "businesses"}
      </p>
      <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          Revenue
        </p>
        <p
          className="font-display font-semibold"
          style={{ color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}
        >
          {formatINR(revenue)}
        </p>
      </div>
    </div>
  );
}
