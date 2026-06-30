"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/directory-data";

/**
 * CategoryTile — homepage grid tile.
 *
 * Spec: bg surface, 1px border, radius-lg, padding 20px 16px, text-center,
 * shadow-xs default. Hover: border accent-border, shadow-sm, icon scale(1.08),
 * 200ms ease.
 */
export function CategoryTile({
  category,
  onClick,
  className,
}: {
  category: Category;
  onClick?: (c: Category) => void;
  className?: string;
}) {
  const Icon = category.icon;
  return (
    <button
      type="button"
      onClick={() => onClick?.(category)}
      className={cn(
        "group text-center transition-all duration-200 ease-out",
        "border border-[var(--color-border)] rounded-[16px] bg-[var(--color-surface)]",
        "p-5 shadow-[var(--shadow-xs)]",
        "hover:border-[var(--color-accent-border)] hover:shadow-[var(--shadow-sm)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
        className,
      )}
      aria-label={`Browse ${category.name} — ${category.listingCount.toLocaleString("en-IN")} listings`}
    >
      <div
        className="mx-auto mb-3 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-[1.08]"
        style={{
          width: 48,
          height: 48,
          backgroundColor: "var(--color-accent-light)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <Icon
          size={24}
          strokeWidth={2}
          style={{ color: "var(--color-accent)" }}
          aria-hidden
        />
      </div>
      <p
        className="font-medium leading-tight"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
        }}
      >
        {category.name}
      </p>
      <p
        className="mt-1 leading-tight"
        style={{
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-xs)",
        }}
      >
        {category.listingCount.toLocaleString("en-IN")} listings
      </p>
    </button>
  );
}

export function CategoryTileSkeleton() {
  return (
    <div className="border border-[var(--color-border)] rounded-[16px] bg-[var(--color-surface)] p-5 text-center">
      <div className="skeleton-shimmer mx-auto mb-3 w-12 h-12 rounded-[10px]" />
      <div className="skeleton-shimmer mx-auto h-4 w-20 rounded-md" />
      <div className="skeleton-shimmer mx-auto mt-2 h-3 w-16 rounded-md" />
    </div>
  );
}
