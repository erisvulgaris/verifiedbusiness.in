"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/lib/directory-data";

/**
 * FAQAccordion — clean edge-to-edge items.
 *
 * Spec: container 1px border, radius-md, overflow hidden.
 * Item closed: bg surface, padding 16px 20px, bottom border.
 * Item open: bg surface-2, answer padding 0 20px 16px.
 * Chevron rotates 200ms ease. Question: Inter 500 base. Answer: Inter 400 base.
 * Open transition: 250ms ease-out.
 */
export function FAQAccordion({
  items,
  className,
}: {
  items: FAQItem[];
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div
      className={cn(
        "border border-[var(--color-border)] rounded-[10px] overflow-hidden",
        className,
      )}
    >
      {items.map((item, i) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "border-b border-[var(--color-border)] last:border-b-0",
            )}
            style={{
              backgroundColor: isOpen
                ? "var(--color-surface-2)"
                : "var(--color-surface)",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              id={`faq-trigger-${item.id}`}
              className="w-full flex items-center justify-between gap-4 text-left p-4 sm:p-5 transition-colors duration-150 hover:bg-[var(--color-surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
            >
              <span
                className="font-medium"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-base)",
                  fontWeight: 500,
                  lineHeight: "24px",
                }}
              >
                {item.question}
              </span>
              <ChevronDown
                size={18}
                strokeWidth={2}
                className={cn(
                  "shrink-0 transition-transform duration-200 ease-out",
                  isOpen && "rotate-180",
                )}
                style={{ color: "var(--color-text-tertiary)" }}
                aria-hidden
              />
            </button>
            {/* Height transition: 250ms ease-out */}
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-trigger-${item.id}`}
              className={cn(
                "grid transition-all duration-250 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
              style={{ transitionDuration: "250ms" }}
            >
              <div className="overflow-hidden">
                <p
                  className="px-4 sm:px-5 pb-4"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-base)",
                    lineHeight: "24px",
                  }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
