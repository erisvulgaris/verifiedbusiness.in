"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Star,
  CreditCard,
  Settings,
  ArrowLeft,
  BarChart3,
  ScrollText,
} from "lucide-react";
import type { ViewKey } from "@/components/showcase/TopNav";

/**
 * AdminLayout — shared sidebar + header for all admin views.
 *
 * Premium differentiator: admin panel uses the same design tokens as the
 * public site (warm whites, India blue accent) so it feels like one product,
 * not a tacked-on backend.
 */

const ADMIN_NAV: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "admin-businesses", label: "Businesses", icon: Building2 },
  { key: "admin-reviews", label: "Reviews", icon: Star },
  { key: "admin-subscriptions", label: "Subscriptions", icon: CreditCard },
  { key: "admin-analytics", label: "Analytics", icon: BarChart3 },
  { key: "admin-audit-log", label: "Audit Log", icon: ScrollText },
  { key: "admin-settings", label: "Settings", icon: Settings },
];

export function AdminLayout({
  activeView,
  onViewChange,
  onExitAdmin,
  title,
  subtitle,
  actions,
  children,
}: {
  activeView: ViewKey;
  onViewChange: (v: ViewKey) => void;
  onExitAdmin: () => void;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="directory-container py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside>
          {/* Back to site */}
          <button
            type="button"
            onClick={onExitAdmin}
            className="mb-4 inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--color-accent)]"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
            }}
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back to site
          </button>

          {/* Admin label */}
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1.5 font-display font-bold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: "var(--color-accent-light)",
                color: "var(--color-accent)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.5px",
              }}
            >
              ADMIN PANEL
            </span>
          </div>

          {/* Nav */}
          <nav aria-label="Admin sections">
            <ul className="space-y-1">
              {ADMIN_NAV.map((item) => {
                const isActive = activeView === item.key;
                const Icon = item.icon;
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => onViewChange(item.key)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] transition-all duration-150 text-left",
                        isActive
                          ? "bg-[var(--color-accent)] text-[var(--color-text-inverse)]"
                          : "hover:bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]",
                      )}
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-sm)",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      <Icon size={16} strokeWidth={2.2} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <div className="min-w-0">
          {/* Header */}
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(var(--text-2xl), 4vw, var(--text-3xl))",
                  lineHeight: "40px",
                  letterSpacing: "-0.3px",
                  color: "var(--color-text-primary)",
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className="mt-1"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-base)",
                    lineHeight: "24px",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Shared admin UI primitives ---------------- */

/** KPI card — used in dashboard */
export function KpiCard({
  label,
  value,
  delta,
  deltaPositive = true,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  accent?: boolean;
}) {
  return (
    <div
      className="border rounded-[12px] p-5"
      style={{
        backgroundColor: accent ? "var(--color-accent)" : "var(--color-surface)",
        borderColor: accent ? "var(--color-accent)" : "var(--color-border)",
        color: accent ? "var(--color-text-inverse)" : "var(--color-text-primary)",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <p
          style={{
            color: accent ? "rgba(255,255,255,0.85)" : "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
        {Icon && (
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              backgroundColor: accent ? "rgba(255,255,255,0.2)" : "var(--color-accent-light)",
            }}
          >
            <Icon
              size={16}
              strokeWidth={2.2}
              style={{ color: accent ? "#FFFFFF" : "var(--color-accent)" }}
            />
          </div>
        )}
      </div>
      <p
        className="font-display font-bold"
        style={{
          fontSize: "var(--text-2xl)",
          lineHeight: "32px",
          letterSpacing: "-0.3px",
        }}
      >
        {value}
      </p>
      {delta && (
        <p
          className="mt-2 font-medium"
          style={{
            color: accent
              ? "rgba(255,255,255,0.85)"
              : deltaPositive
                ? "var(--color-success)"
                : "var(--color-warning)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          {deltaPositive ? "▲" : "▼"} {delta}
        </p>
      )}
    </div>
  );
}

/** Status pill — colored badge for subscription/verification status */
export function StatusPill({
  status,
  label,
}: {
  status: "active" | "expired" | "pending" | "cancelled" | "verified" | "unverified" | "free";
  label: string;
}) {
  const styles: Record<string, { bg: string; color: string }> = {
    active: { bg: "var(--color-success-light)", color: "var(--color-success)" },
    verified: { bg: "var(--color-success-light)", color: "var(--color-success)" },
    expired: { bg: "var(--color-warning-light)", color: "var(--color-warning)" },
    pending: { bg: "var(--color-warning-light)", color: "var(--color-warning)" },
    unverified: { bg: "var(--color-warning-light)", color: "var(--color-warning)" },
    cancelled: { bg: "var(--color-surface-2)", color: "var(--color-text-tertiary)" },
    free: { bg: "var(--color-surface-2)", color: "var(--color-text-tertiary)" },
  };
  const s = styles[status] ?? styles.free;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full font-medium"
      style={{
        backgroundColor: s.bg,
        color: s.color,
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "var(--text-xs)",
      }}
    >
      {label}
    </span>
  );
}

/** Admin table wrapper */
export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[var(--color-border)] rounded-[12px] bg-[var(--color-surface)] overflow-hidden overflow-x-auto">
      <table className="w-full" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "var(--color-surface-2)" }}>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 font-display font-semibold"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.3px",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** Admin button — primary/secondary variants */
export function AdminButton({
  variant = "primary",
  size = "md",
  children,
  ...props
}: {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--color-accent)",
      color: "var(--color-text-inverse)",
      border: "none",
    },
    secondary: {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text-primary)",
      border: "1.5px solid var(--color-border-strong)",
    },
    danger: {
      backgroundColor: "var(--color-warning)",
      color: "#FFFFFF",
      border: "none",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--color-text-secondary)",
      border: "1px solid var(--color-border)",
    },
  };
  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 12px", fontSize: "var(--text-xs)" },
    md: { padding: "10px 18px", fontSize: "var(--text-sm)" },
  };
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center gap-1.5 rounded-[8px] transition-all duration-150 hover:shadow-[var(--shadow-sm)] disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        ...variants[variant],
        ...sizes[size],
        fontFamily: "var(--font-jakarta), sans-serif",
        fontWeight: 600,
        cursor: props.disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
