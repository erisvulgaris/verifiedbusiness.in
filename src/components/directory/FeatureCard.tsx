"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * FeatureCard — 2-column grid (desktop) / 1-column (mobile).
 *
 * Spec: bg surface-2, 1px border, radius-lg, padding 20px.
 * Icon: 20px, color accent, container 36x36 bg accent-light radius-sm.
 * Title: Inter 500, sm. Description: Inter 400, sm.
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-[var(--color-border)] rounded-[16px] p-5",
        className,
      )}
      style={{ backgroundColor: "var(--color-surface-2)" }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          backgroundColor: "var(--color-accent-light)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <Icon
          size={20}
          strokeWidth={2}
          style={{ color: "var(--color-accent)" }}
          aria-hidden
        />
      </div>
      <h3
        className="mt-3 font-medium leading-snug"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
        }}
      >
        {title}
      </h3>
      <p
        className="mt-1 leading-snug"
        style={{
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          lineHeight: "20px",
        }}
      >
        {description}
      </p>
    </div>
  );
}
