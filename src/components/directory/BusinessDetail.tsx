"use client";

import { cn } from "@/lib/utils";
import {
  Phone,
  MapPin,
  Globe,
  Navigation,
  Clock,
  CreditCard,
  Star,
  Copy,
  Check,
  Printer,
} from "lucide-react";
import { useState } from "react";
import type { Business } from "@/lib/directory-data";
import { CategoryChip, OpenBadge, PlanBadge, RatingBadge, VerifiedBadge } from "./Badges";
import { useDirectoryToast } from "@/components/showcase/useDirectoryToast";
import { isBusinessOpen } from "@/lib/business-hours";

/**
 * BusinessDetailHeader — detail page hero.
 *
 * Spec: bg surface-2, 1px bottom border, padding 32px 24px desktop / 20px 16px mobile.
 * H1: Plus Jakarta 700, 2xl desktop / xl mobile, text-primary, letter-spacing -0.3px.
 * Category badge inline below name 8px gap. Verified badge with check icon.
 * Last updated: Inter 400 xs, text-tertiary, below category badge.
 */
export function BusinessDetailHeader({
  business,
  className,
}: {
  business: Business;
  className?: string;
}) {
  return (
    <header
      className={cn("border-b border-[var(--color-border)]", className)}
      style={{
        backgroundColor: "var(--color-surface-2)",
        padding: "clamp(20px, 4vw, 32px) clamp(16px, 3vw, 24px)",
      }}
    >
      <div className="directory-container max-w-[1000px] !px-0">
        <div className="flex flex-col gap-3">
          {/* H1 — business name */}
          <h1
            className="font-display font-bold"
            style={{
              color: "var(--color-text-primary)",
              fontSize: "clamp(var(--text-xl), 4vw, var(--text-2xl))",
              lineHeight: "36px",
              letterSpacing: "-0.3px",
            }}
          >
            {business.name}
          </h1>

          {/* Category chip + verified + open status, inline */}
          <div className="flex flex-wrap items-center gap-2">
            <CategoryChip label={business.category} variant="compact" />
            {business.verified && <VerifiedBadge />}
            <OpenBadge open={isBusinessOpen(business.weeklyHours)} />
            {business.subscription?.plan === "yearly" && business.subscription.status === "active" && (
              <PlanBadge plan="yearly" />
            )}
            {business.subscription?.plan === "monthly" && business.subscription.status === "active" && (
              <PlanBadge plan="monthly" />
            )}
          </div>

          {/* Rating row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <Star
                size={16}
                strokeWidth={2.2}
                className="fill-[var(--color-warning)]"
                style={{ color: "var(--color-warning)" }}
              />
              <RatingBadge rating={business.rating} reviewCount={business.reviewCount} />
            </span>
            <span
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              · {business.yearsActive}+ years in business
            </span>
          </div>

          {/* Last updated (tertiary) */}
          <p
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            Last updated 14 days ago ·{" "}
            <button
              type="button"
              className="transition-colors hover:text-[var(--color-accent)] hover:underline"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Report an update
            </button>
          </p>
        </div>
      </div>
    </header>
  );
}

/**
 * ContactActions — primary Call + secondary Directions / Website buttons.
 *
 * Spec:
 *  - Primary (Call): accent bg, inverse text, Plus Jakarta 600 base, radius-md,
 *    padding 14px 24px, shadow-sm. Hover: accent-hover, shadow-md, 150ms.
 *  - Secondary: surface bg, primary text, 1.5px border-strong, radius-md,
 *    padding 13px 24px. Hover: border accent, text accent.
 *  - Mobile sticky CTA bar: surface bg, 1px top border, shadow 0 -4px 16px rgba,
 *    padding 12px 16px, equal-width buttons, gap 10px.
 */
export function ContactActions({
  business,
  variant = "inline",
  className,
}: {
  business: Business;
  variant?: "inline" | "sticky";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const toast = useDirectoryToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(business.phone);
      setCopied(true);
      toast.copied(business.phone);
      setTimeout(() => setCopied(false), 1500); // spec: 1.5s tooltip
    } catch {
      /* ignore */
    }
  };

  if (variant === "sticky") {
    return (
      <div
        className={cn("flex items-center gap-2.5", className)}
        style={{
          backgroundColor: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          boxShadow: "0 -4px 16px rgba(26, 25, 23, 0.08)",
          padding: "12px 16px",
        }}
      >
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 inline-flex items-center justify-center gap-2 transition-all duration-150"
          style={secondaryBtnStyle}
        >
          {copied ? <Check size={16} strokeWidth={2.5} /> : <Phone size={16} strokeWidth={2} />}
          {copied ? "Copied!" : "Call"}
        </button>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            `${business.name}, ${business.address}, ${business.pincode}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 transition-all duration-150"
          style={primaryBtnStyle}
        >
          <Navigation size={16} strokeWidth={2} />
          Directions
        </a>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {/* Primary — Call */}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 transition-all duration-150 hover:shadow-[var(--shadow-md)]"
        style={{
          ...primaryBtnStyle,
          flex: "0 0 auto",
        }}
        aria-label={`Call ${business.name} at ${business.phone}`}
      >
        <Phone size={16} strokeWidth={2.5} />
        {copied ? "Copied!" : "Call now"}
      </button>

      {/* Secondary — Directions */}
      <a
        href={`https://maps.google.com/?q=${encodeURIComponent(
          `${business.name}, ${business.address}, ${business.pincode}`,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 transition-all duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        style={{ ...secondaryBtnStyle, flex: "0 0 auto" }}
      >
        <Navigation size={16} strokeWidth={2} />
        Directions
      </a>

      {/* Secondary — Website (if present) */}
      {business.website && (
        <a
          href={`https://${business.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 transition-all duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          style={{ ...secondaryBtnStyle, flex: "0 0 auto" }}
        >
          <Globe size={16} strokeWidth={2} />
          Website
        </a>
      )}

      {/* Copy phone (subtle icon button) */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy phone number"
        title="Copy phone number"
        className="inline-flex items-center justify-center transition-colors duration-150 hover:text-[var(--color-accent)]"
        style={{
          color: copied ? "var(--color-success)" : "var(--color-text-tertiary)",
          width: 44,
          height: 44,
          borderRadius: "var(--radius-md)",
        }}
      >
        {copied ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} strokeWidth={2} />}
      </button>

      {/* Print button */}
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined") window.print();
        }}
        aria-label="Print business details"
        title="Print"
        className="inline-flex items-center justify-center transition-colors duration-150 hover:text-[var(--color-accent)]"
        style={{
          color: "var(--color-text-tertiary)",
          width: 44,
          height: 44,
          borderRadius: "var(--radius-md)",
        }}
      >
        <Printer size={18} strokeWidth={2} />
      </button>
    </div>
  );
}

const primaryBtnStyle: React.CSSProperties = {
  backgroundColor: "var(--color-accent)",
  color: "var(--color-text-inverse)",
  fontFamily: "var(--font-jakarta), sans-serif",
  fontWeight: 600,
  fontSize: "var(--text-base)",
  lineHeight: "20px",
  borderRadius: "var(--radius-md)",
  padding: "14px 24px",
  boxShadow: "var(--shadow-sm)",
  border: "none",
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  backgroundColor: "var(--color-surface)",
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 500,
  fontSize: "var(--text-base)",
  lineHeight: "20px",
  borderRadius: "var(--radius-md)",
  padding: "13px 24px",
  border: "1.5px solid var(--color-border-strong)",
  cursor: "pointer",
  textDecoration: "none",
};

/**
 * InfoBlock — renders the address / hours / payment info rows.
 * Used below the contact actions on the detail page.
 */
export function InfoBlock({ business }: { business: Business }) {
  const rows = [
    {
      icon: MapPin,
      label: "Address",
      value: `${business.address}, ${business.locality}, ${business.city}, ${business.state} — ${business.pincode}`,
    },
    {
      icon: Clock,
      label: "Hours",
      value: business.hours,
    },
    {
      icon: CreditCard,
      label: "Payment methods",
      value: business.paymentMethods.join(" · "),
    },
    {
      icon: Phone,
      label: "Phone",
      value: business.phone,
    },
  ];

  return (
    <div className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
      {rows.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-start gap-3 p-4 sm:p-5"
        >
          <div
            className="shrink-0 flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              backgroundColor: "var(--color-accent-light)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <Icon
              size={18}
              strokeWidth={2}
              style={{ color: "var(--color-accent)" }}
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <p
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
                lineHeight: "16px",
                marginBottom: 4,
              }}
            >
              {label}
            </p>
            <p
              className="break-words"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-base)",
                lineHeight: "24px",
              }}
            >
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * HighlightsList — bullet list of business highlights.
 */
export function HighlightsList({ highlights }: { highlights: string[] }) {
  return (
    <ul className="space-y-2.5">
      {highlights.map((h, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span
            className="mt-1 inline-flex items-center justify-center shrink-0"
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              backgroundColor: "var(--color-success-light)",
            }}
          >
            <Check
              size={10}
              strokeWidth={3}
              style={{ color: "var(--color-success)" }}
            />
          </span>
          <span
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-base)",
              lineHeight: "24px",
            }}
          >
            {h}
          </span>
        </li>
      ))}
    </ul>
  );
}
