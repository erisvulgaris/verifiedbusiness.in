"use client";

import { AdminLayout, KpiCard, AdminButton, AdminTable, StatusPill } from "./AdminLayout";
import {
  TrendingUp,
  Search,
  Eye,
  Heart,
  GitCompare,
  Star,
  Users,
  Clock,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";

/**
 * AdminAnalyticsView — analytics dashboard showing user behavior metrics.
 *
 * In production, this would query the analytics store (Mixpanel/Amplitude/Datadog).
 * For now, shows mock data with the same structure as real analytics.
 */
export function AdminAnalyticsView({
  onViewChange,
  onExitAdmin,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
}) {
  useDocumentTitle("Analytics | Admin · VerifiedBusiness.in");

  // Mock analytics data (deterministic)
  const totalEvents = 4821;
  const uniqueSessions = 1247;
  const pageViews = 3105;
  const searches = 842;
  const businessViews = 654;
  const favoriteAdds = 128;
  const compareAdds = 67;
  const avgSessionDuration = "3m 42s";
  const bounceRate = "32%";

  // Top pages
  const topPages = [
    { page: "Home", views: 1247, pct: 40 },
    { page: "Browse", views: 654, pct: 21 },
    { page: "Business Detail", views: 521, pct: 17 },
    { page: "Search", views: 312, pct: 10 },
    { page: "Categories", views: 198, pct: 6 },
    { page: "Locations", views: 156, pct: 5 },
  ];

  // Top searches
  const topSearches = [
    { query: "restaurant", count: 142, results: 4 },
    { query: "hospital", count: 98, results: 2 },
    { query: "bengaluru", count: 87, results: 6 },
    { query: "ac repair", count: 64, results: 1 },
    { query: "lawyer", count: 52, results: 2 },
  ];

  // Event breakdown for chart
  const eventBreakdown = [
    { type: "Page Views", count: pageViews, color: "var(--color-accent)" },
    { type: "Searches", count: searches, color: "var(--color-success)" },
    { type: "Business Views", count: businessViews, color: "var(--color-warning)" },
    { type: "Favorites", count: favoriteAdds, color: "#EC4899" },
    { type: "Compares", count: compareAdds, color: "#8B5CF6" },
  ];
  const maxEvent = Math.max(...eventBreakdown.map((e) => e.count));

  // 7-day trend (deterministic mock)
  const trend = [
    { day: "Mon", events: 612 },
    { day: "Tue", events: 734 },
    { day: "Wed", events: 689 },
    { day: "Thu", events: 821 },
    { day: "Fri", events: 945 },
    { day: "Sat", events: 567 },
    { day: "Sun", events: 453 },
  ];
  const maxTrend = Math.max(...trend.map((t) => t.events));

  return (
    <AdminLayout
      activeView="admin-analytics"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="Analytics"
      subtitle="User behavior + engagement metrics · last 7 days"
      actions={
        <AdminButton variant="secondary" size="sm" onClick={() => onViewChange("admin-dashboard")}>
          Back to dashboard
        </AdminButton>
      }
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total events"
          value={totalEvents.toLocaleString("en-IN")}
          delta="+15% vs last week"
          deltaPositive
          icon={TrendingUp}
          accent
        />
        <KpiCard
          label="Unique sessions"
          value={uniqueSessions.toLocaleString("en-IN")}
          delta="+8% vs last week"
          deltaPositive
          icon={Users}
        />
        <KpiCard
          label="Avg session"
          value={avgSessionDuration}
          delta="+22s vs last week"
          deltaPositive
          icon={Clock}
        />
        <KpiCard
          label="Bounce rate"
          value={bounceRate}
          delta="-3% vs last week"
          deltaPositive
          icon={TrendingUp}
        />
      </div>

      {/* Event trend chart */}
      <div className="mt-6 border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] p-5">
        <h2
          className="font-display font-semibold mb-1"
          style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)" }}
        >
          Events over time
        </h2>
        <p
          className="mb-5"
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          Last 7 days · daily event count
        </p>
        <div className="flex items-end justify-between gap-2 h-40">
          {trend.map((point) => {
            const heightPct = (point.events / maxTrend) * 100;
            return (
              <div key={point.day} className="flex-1 flex flex-col items-center gap-2">
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
                    {point.events}
                  </div>
                </div>
                <span
                  style={{
                    color: "var(--color-text-tertiary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 11,
                  }}
                >
                  {point.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column: Event breakdown + Top searches */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event breakdown */}
        <div className="border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] p-5">
          <h2
            className="font-display font-semibold mb-5"
            style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)" }}
          >
            Event breakdown
          </h2>
          <div className="space-y-4">
            {eventBreakdown.map((e) => {
              const pct = (e.count / totalEvents) * 100;
              return (
                <div key={e.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block"
                        style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: e.color }}
                      />
                      <span
                        style={{
                          color: "var(--color-text-primary)",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "var(--text-sm)",
                        }}
                      >
                        {e.type}
                      </span>
                    </div>
                    <span
                      className="font-display font-semibold"
                      style={{
                        color: "var(--color-text-primary)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {e.count.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--color-surface-2)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${(e.count / maxEvent) * 100}%`, backgroundColor: e.color }}
                    />
                  </div>
                  <p
                    className="mt-1"
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    {pct.toFixed(1)}% of total events
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top searches */}
        <div className="border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] p-5">
          <h2
            className="font-display font-semibold mb-5"
            style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)" }}
          >
            Top searches
          </h2>
          <div className="space-y-3">
            {topSearches.map((s, i) => (
              <div
                key={s.query}
                className="flex items-center justify-between gap-3 py-2 px-3 rounded-[8px] transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className="font-display font-bold shrink-0"
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontSize: "var(--text-sm)",
                      width: 20,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="font-medium truncate"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    &ldquo;{s.query}&rdquo;
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    {s.results} results
                  </span>
                  <span
                    className="font-display font-semibold"
                    style={{
                      color: "var(--color-accent)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {s.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top pages table */}
      <div className="mt-6">
        <h2
          className="font-display font-bold mb-4"
          style={{ fontSize: "var(--text-xl)", color: "var(--color-text-primary)" }}
        >
          Top pages
        </h2>
        <AdminTable headers={["#", "Page", "Views", "% of total"]}>
          {topPages.map((p, i) => (
            <tr
              key={p.page}
              className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors"
            >
              <td className="px-4 py-3">
                <span
                  className="font-display font-bold"
                  style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)" }}
                >
                  {i + 1}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className="font-medium"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {p.page}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className="font-display font-semibold"
                  style={{ color: "var(--color-text-primary)", fontSize: "var(--text-sm)" }}
                >
                  {p.views.toLocaleString("en-IN")}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden max-w-[100px]"
                    style={{ backgroundColor: "var(--color-surface-2)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.pct * 2.5}%`, backgroundColor: "var(--color-accent)" }}
                    />
                  </div>
                  <span
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    {p.pct}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </AdminLayout>
  );
}
