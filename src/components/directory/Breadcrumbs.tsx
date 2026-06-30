"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

/**
 * Breadcrumbs — contextual navigation.
 *
 * Spec: Inter 400 sm. Active page: text-primary, 500. Parent links: text-tertiary.
 * Hover: accent. Separator: "/" character. Padding 12px 0.
 *
 * Note: per design spec, separator is the "/" character (not chevron icon).
 * We keep it as a character literal to match the spec.
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("py-3", className)}
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "var(--text-sm)",
        lineHeight: "20px",
      }}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={i}>
              <li>
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="transition-colors duration-150 hover:text-[var(--color-accent)] hover:underline"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {item.label}
                  </button>
                )}
              </li>
              {!isLast && (
                <li
                  aria-hidden
                  className="select-none"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

// Tiny chevron variant — alternative separator if spec is relaxed later.
export function BreadcrumbChevronSeparator() {
  return (
    <ChevronRight
      size={12}
      strokeWidth={2}
      style={{ color: "var(--color-text-tertiary)" }}
      aria-hidden
    />
  );
}
