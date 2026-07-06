"use client";

import { useState, useMemo } from "react";
import { AdminLayout, StatusPill, AdminButton } from "./AdminLayout";
import { auditLog, type AuditCategory, type AuditSeverity } from "@/lib/audit-log";
import {
  Search,
  Building2,
  CreditCard,
  Star,
  User,
  Settings as SettingsIcon,
  Shield,
  Wrench,
  Download,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";
import { useDocumentTitle } from "@/components/showcase/SeoStructuredData";
import { exportToCsv } from "@/lib/csv-export";

const CATEGORY_ICONS: Record<AuditCategory, typeof Building2> = {
  business: Building2,
  subscription: CreditCard,
  review: Star,
  user: User,
  system: Wrench,
  security: Shield,
  config: SettingsIcon,
};

// Module-level flag — ensures seed runs only once per page load
let auditEventsSeeded = false;

function seedAuditEventsOnce() {
  if (auditEventsSeeded) return;
  if (auditLog.getRecent(1).length > 0) {
    auditEventsSeeded = true;
    return;
  }
  const events = [
    { action: "business.approved", actor: "admin@verifiedbusiness.in", target: "b1", details: { name: "Sankalp" } },
    { action: "subscription.upgraded", actor: "system", target: "b1", details: { from: "monthly", to: "yearly" } },
    { action: "review.flagged", actor: "moderation", target: "r3", details: { reason: "Reported as spam" } },
    { action: "business.submitted", actor: "user@example.com", target: "b25", details: { name: "New Restaurant" } },
    { action: "config.updated", actor: "admin@verifiedbusiness.in", details: { key: "monthly_price", value: 999 } },
    { action: "review.approved", actor: "admin@verifiedbusiness.in", target: "r5" },
    { action: "subscription.cancelled", actor: "system", target: "b8", details: { reason: "Payment failed" } },
    { action: "business.verified", actor: "admin@verifiedbusiness.in", target: "b4" },
  ];
  events.forEach((e) => auditLog.info(e.action, e));
  auditEventsSeeded = true;
}

export function AdminAuditLogView({
  onViewChange,
  onExitAdmin,
}: {
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
}) {
  useDocumentTitle("Audit Log | Admin · VerifiedBusiness.in");

  // Seed mock events on first render (module-level guard, no effect needed)
  seedAuditEventsOnce();

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | AuditCategory>("all");
  const [filterSeverity, setFilterSeverity] = useState<"all" | AuditSeverity>("all");

  const events = auditLog.getRecent(100);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (filterCategory !== "all" && e.category !== filterCategory) return false;
      if (filterSeverity !== "all" && e.severity !== filterSeverity) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${e.action} ${e.actor} ${e.target ?? ""} ${JSON.stringify(e.details ?? {})}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [events, search, filterCategory, filterSeverity]);

  const counts = auditLog.getCounts();

  return (
    <AdminLayout
      activeView="admin-audit-log"
      onViewChange={onViewChange}
      onExitAdmin={onExitAdmin}
      title="Audit log"
      subtitle={`${events.length} recent events · compliance + security tracking`}
      actions={
        <div className="flex items-center gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => {
              exportToCsv(`audit-log-${Date.now()}.csv`, filtered, [
                { key: "timestamp", label: "Timestamp" },
                { key: "category", label: "Category" },
                { key: "action", label: "Action" },
                { key: "severity", label: "Severity" },
                { key: "actor", label: "Actor" },
                { key: "target", label: "Target" },
                { key: "details", label: "Details", format: (e) => JSON.stringify(e.details ?? {}) },
              ]);
            }}
          >
            <Download size={14} strokeWidth={2.5} />
            Export
          </AdminButton>
          <AdminButton variant="secondary" size="sm" onClick={() => onViewChange("admin-dashboard")}>
            Back to dashboard
          </AdminButton>
        </div>
      }
    >
      {/* Category summary */}
      <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {(Object.entries(counts) as [AuditCategory, number][]).map(([cat, count]) => {
          const Icon = CATEGORY_ICONS[cat];
          const isActive = filterCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(isActive ? "all" : cat)}
              className="text-left border rounded-[10px] p-3 transition-all duration-150"
              style={{
                backgroundColor: isActive ? "var(--color-accent-light)" : "var(--color-surface)",
                borderColor: isActive ? "var(--color-accent-border)" : "var(--color-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  size={14}
                  strokeWidth={2.2}
                  style={{ color: isActive ? "var(--color-accent)" : "var(--color-text-tertiary)" }}
                />
                <span
                  className="font-medium capitalize"
                  style={{
                    color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {cat}
                </span>
              </div>
              <p
                className="font-display font-bold"
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "var(--text-lg)",
                }}
              >
                {count}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
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
            placeholder="Search by action, actor, target, details..."
            className="w-full bg-transparent border-0 outline-none py-2.5"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
            }}
          />
        </div>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value as typeof filterSeverity)}
          className="px-3 py-2.5 border rounded-[8px] bg-[var(--color-surface)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
            borderColor: "var(--color-border-strong)",
          }}
        >
          <option value="all">All severities</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
        {(filterCategory !== "all" || filterSeverity !== "all" || search) && (
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterCategory("all");
              setFilterSeverity("all");
              setSearch("");
            }}
          >
            Clear filters
          </AdminButton>
        )}
      </div>

      {/* Audit events list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="border border-dashed border-[var(--color-border-strong)] rounded-[12px] bg-[var(--color-surface)] p-12 text-center">
            <p
              className="font-display font-semibold"
              style={{ color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}
            >
              No audit events match
            </p>
            <p
              className="mt-1"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            >
              Try adjusting your filters or clear them to see all events.
            </p>
          </div>
        ) : (
          filtered.map((event) => {
            const Icon = CATEGORY_ICONS[event.category];
            return (
              <div
                key={event.id}
                className="border rounded-[10px] p-4 flex items-start gap-3"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: event.severity === "critical" ? "var(--color-warning)" : "var(--color-border)",
                  borderLeftWidth: event.severity === "critical" ? 4 : 1,
                }}
              >
                {/* Category icon */}
                <div
                  className="shrink-0 inline-flex items-center justify-center mt-0.5"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--color-accent-light)",
                  }}
                >
                  <Icon size={16} strokeWidth={2.2} style={{ color: "var(--color-accent)" }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="font-display font-semibold"
                      style={{
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-jakarta), sans-serif",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {event.action}
                    </span>
                    <StatusPill
                      status={
                        event.severity === "critical" ? "cancelled" :
                        event.severity === "warning" ? "pending" : "verified"
                      }
                      label={event.severity}
                    />
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      <strong style={{ color: "var(--color-text-primary)" }}>Actor:</strong> {event.actor}
                    </span>
                    {event.target && (
                      <span
                        style={{
                          color: "var(--color-text-secondary)",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "var(--text-xs)",
                        }}
                      >
                        <strong style={{ color: "var(--color-text-primary)" }}>Target:</strong> {event.target}
                      </span>
                    )}
                    <span
                      style={{
                        color: "var(--color-text-tertiary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {new Date(event.timestamp).toLocaleString("en-IN")}
                    </span>
                  </div>
                  {event.details && Object.keys(event.details).length > 0 && (
                    <div
                      className="mt-2 p-2 rounded-[6px] font-mono"
                      style={{
                        backgroundColor: "var(--color-surface-2)",
                        color: "var(--color-text-secondary)",
                        fontSize: 11,
                        lineHeight: "16px",
                      }}
                    >
                      {JSON.stringify(event.details)}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <p
        className="mt-4"
        style={{
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-xs)",
        }}
      >
        Showing {filtered.length} of {events.length} events · In-memory ring buffer (last 200 events).
        In production, events persist to a tamper-proof database table.
      </p>
    </AdminLayout>
  );
}
