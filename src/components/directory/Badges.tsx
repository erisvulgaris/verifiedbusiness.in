"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/**
 * Category chip — accent-tinted pill used on listing cards and detail pages.
 * Spec: bg --color-accent-light, text --color-accent, Inter 500, 12px,
 * padding 3px 8px (card) or 3px 10px (pill form), radius-sm / radius-full.
 */
export function CategoryChip({
  label,
  variant = "pill",
  className,
}: {
  label: string;
  variant?: "pill" | "compact";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium leading-none",
        variant === "pill"
          ? "px-2.5 py-[3px] rounded-full"
          : "px-2 py-[3px] rounded-md",
        className,
      )}
      style={{
        backgroundColor: "var(--color-accent-light)",
        color: "var(--color-accent)",
        fontSize: "var(--text-xs)",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {label}
    </span>
  );
}

/**
 * Verified badge — for claimed listings.
 * Spec: green check circle, "Verified Listing", Inter 500 12px, success color.
 */
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium leading-none",
        className,
      )}
      style={{
        color: "var(--color-success)",
        fontSize: "var(--text-xs)",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <span
        className="inline-flex items-center justify-center"
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          backgroundColor: "var(--color-success)",
        }}
        aria-hidden
      >
        <Check size={10} strokeWidth={3} color="#FFFFFF" />
      </span>
      Verified Listing
    </span>
  );
}

/**
 * OPEN badge — green with a pulsing dot.
 * Spec: bg --color-success-light, text --color-success, Inter 500 12px,
 * 6px pulsing dot.
 */
export function OpenBadge({
  open,
  label,
  className,
}: {
  open: boolean;
  label?: string;
  className?: string;
}) {
  const text = label ?? (open ? "Open now" : "Closed");
  const color = open ? "var(--color-success)" : "var(--color-warning)";
  const bg = open ? "var(--color-success-light)" : "var(--color-warning-light)";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium leading-none px-2 py-[3px] rounded-md",
        className,
      )}
      style={{
        backgroundColor: bg,
        color,
        fontSize: "var(--text-xs)",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <span
        className="pulse-dot inline-block"
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          backgroundColor: color,
        }}
        aria-hidden
      />
      {text}
    </span>
  );
}

/**
 * Unverified badge — amber warning chip for non-verified listings.
 */
export function UnverifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium leading-none px-2 py-[3px] rounded-md",
        className,
      )}
      style={{
        backgroundColor: "var(--color-warning-light)",
        color: "var(--color-warning)",
        fontSize: "var(--text-xs)",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <span
        className="inline-block"
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          backgroundColor: "var(--color-warning)",
        }}
        aria-hidden
      />
      Unverified
    </span>
  );
}

/**
 * Rating badge — compact star + rating + review count chip.
 */
export function RatingBadge({
  rating,
  reviewCount,
  className,
}: {
  rating: number;
  reviewCount?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-baseline gap-1", className)}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <span
        className="font-semibold"
        style={{
          color: "var(--color-text-primary)",
          fontSize: "var(--text-sm)",
        }}
      >
        {rating.toFixed(1)}
      </span>
      <span
        style={{
          color: "var(--color-text-tertiary)",
          fontSize: "var(--text-xs)",
        }}
      >
        ({reviewCount?.toLocaleString("en-IN") ?? 0})
      </span>
    </span>
  );
}
