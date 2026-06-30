"use client";

import { cn } from "@/lib/utils";
import {
  MapPin,
  Clock,
  CreditCard,
  Phone,
  ArrowRight,
  Star,
} from "lucide-react";
import type { Business } from "@/lib/directory-data";
import {
  CategoryChip,
  OpenBadge,
  RatingBadge,
  UnverifiedBadge,
  VerifiedBadge,
} from "./Badges";

/**
 * ListingCard — the workhorse of any directory page.
 *
 * Spec (premium differentiator #4): use 1px border as primary boundary;
 * reserve shadow for hover. Card padding 20px. Hover: border accent-border,
 * shadow md, transition 200ms ease.
 *
 * No entrance animations (ruins F-pattern scanning).
 */
export function ListingCard({
  business,
  onOpen,
  className,
}: {
  business: Business;
  onOpen?: (b: Business) => void;
  className?: string;
}) {
  return (
    <article
      onClick={() => onOpen?.(business)}
      className={cn(
        "group relative cursor-pointer text-left",
        "transition-all duration-200 ease-out",
        "border border-[var(--color-border)] rounded-[10px]",
        "bg-[var(--color-surface)] p-5",
        "hover:border-[var(--color-accent-border)] hover:shadow-[var(--shadow-md)]",
        "focus-within:border-[var(--color-accent-border)] focus-within:shadow-[var(--shadow-md)]",
        className,
      )}
      tabIndex={0}
      role="link"
      aria-label={`${business.name} — view details`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.(business);
        }
      }}
    >
      {/* Header row: name + view details link */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className="font-display font-semibold leading-tight line-clamp-2"
            style={{
              fontSize: "var(--text-lg)",
              lineHeight: "24px",
              color: "var(--color-text-primary)",
              letterSpacing: "-0.2px",
            }}
          >
            {business.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <CategoryChip label={business.category} variant="compact" />
            {business.verified ? (
              <VerifiedBadge />
            ) : (
              <UnverifiedBadge />
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(business);
          }}
          className="inline-flex items-center gap-1 font-medium shrink-0"
          style={{
            color: "var(--color-accent)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          View Details
          <ArrowRight
            size={14}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* Rating + open-status row */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1">
          <Star
            size={14}
            strokeWidth={2.2}
            className="fill-[var(--color-warning)]"
            style={{ color: "var(--color-warning)" }}
          />
          <RatingBadge rating={business.rating} reviewCount={business.reviewCount} />
        </span>
        <OpenBadge open={business.openNow} />
      </div>

      {/* Meta rows: address / hours / payment */}
      <dl
        className="mt-4 space-y-2"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
          lineHeight: "20px",
        }}
      >
        <div className="flex items-start gap-2">
          <MapPin
            size={14}
            strokeWidth={2}
            className="mt-0.5 shrink-0"
            style={{ color: "var(--color-text-tertiary)" }}
            aria-hidden
          />
          <dd className="min-w-0">
            {business.address}, {business.locality}, {business.city} —{" "}
            <span style={{ color: "var(--color-text-tertiary)" }}>
              {business.pincode}
            </span>
          </dd>
        </div>
        <div className="flex items-start gap-2">
          <Clock
            size={14}
            strokeWidth={2}
            className="mt-0.5 shrink-0"
            style={{ color: "var(--color-text-tertiary)" }}
            aria-hidden
          />
          <dd>{business.hours}</dd>
        </div>
        <div className="flex items-start gap-2">
          <CreditCard
            size={14}
            strokeWidth={2}
            className="mt-0.5 shrink-0"
            style={{ color: "var(--color-text-tertiary)" }}
            aria-hidden
          />
          <dd>{business.paymentMethods.join(" · ")}</dd>
        </div>
      </dl>

      {/* Phone CTA (bottom) */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <span
          className="inline-flex items-center gap-2 font-medium"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          <Phone size={14} strokeWidth={2} style={{ color: "var(--color-accent)" }} />
          {business.phone}
        </span>
        <span
          className="font-medium"
          style={{
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          {business.yearsActive}+ yrs
        </span>
      </div>
    </article>
  );
}

/**
 * Skeleton — shimmer placeholder for loading state.
 * Spec: skeleton shimmer pulse, 1.5s infinite.
 */
export function ListingCardSkeleton() {
  return (
    <div className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="skeleton-shimmer h-5 w-3/4 rounded-md" />
          <div className="skeleton-shimmer h-4 w-24 rounded-full" />
        </div>
        <div className="skeleton-shimmer h-4 w-20 rounded-md" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="skeleton-shimmer h-4 w-16 rounded-md" />
        <div className="skeleton-shimmer h-4 w-20 rounded-md" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton-shimmer h-3 w-full rounded-md" />
        <div className="skeleton-shimmer h-3 w-5/6 rounded-md" />
        <div className="skeleton-shimmer h-3 w-2/3 rounded-md" />
      </div>
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="skeleton-shimmer h-4 w-32 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Empty state — premium differentiator #7: zero orphan sections.
 */
export function ListingCardEmpty({ query }: { query?: string }) {
  return (
    <div className="border border-dashed border-[var(--color-border-strong)] rounded-[10px] bg-[var(--color-surface)] p-10 text-center">
      <p
        className="font-display font-semibold"
        style={{
          color: "var(--color-text-primary)",
          fontSize: "var(--text-lg)",
        }}
      >
        No businesses found
      </p>
      <p
        className="mt-2 mx-auto max-w-md"
        style={{
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          lineHeight: "20px",
        }}
      >
        {query
          ? `We couldn't find any matches for "${query}". Try a different category, city, or pincode.`
          : "Try adjusting your filters or searching for a broader category. We add new verified listings every day."}
      </p>
      <button
        type="button"
        className="mt-4 inline-flex items-center gap-1.5 font-medium px-4 py-2 rounded-[10px]"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-text-inverse)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
        }}
      >
        Browse all categories
      </button>
    </div>
  );
}
