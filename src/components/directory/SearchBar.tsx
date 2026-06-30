"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, MapPin, ChevronDown } from "lucide-react";

/**
 * SearchBar — homepage hero search.
 *
 * Spec: container bg --color-surface, 1.5px border --color-border-strong,
 * radius-lg, shadow-md, padding 6px 6px 6px 16px. Focused: border accent,
 * shadow-lg. Inputs transparent, 16px Inter 400. Vertical divider 1px
 * --color-border. Search button: accent bg, radius-md (smaller than container),
 * padding 12px 24px, Plus Jakarta 600 16px.
 */
export function SearchBar({
  className,
  onSearch,
}: {
  className?: string;
  onSearch?: (q: { query: string; location: string }) => void;
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [focused, setFocused] = useState<"query" | "location" | null>(null);

  return (
    <div
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        className,
      )}
      style={{
        backgroundColor: "var(--color-surface)",
        border: `1.5px solid ${
          focused ? "var(--color-accent)" : "var(--color-border-strong)"
        }`,
        borderRadius: "var(--radius-lg)",
        boxShadow: focused ? "var(--shadow-lg)" : "var(--shadow-md)",
        padding: "6px 6px 6px 16px",
      }}
    >
      {/* What */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <Search
          size={18}
          strokeWidth={2}
          className="shrink-0"
          style={{ color: "var(--color-text-tertiary)" }}
          aria-hidden
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused("query")}
          onBlur={() => setFocused(null)}
          placeholder="What are you looking for?"
          aria-label="Search query"
          className="w-full bg-transparent border-0 outline-none placeholder:text-[var(--color-text-tertiary)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-base)",
            lineHeight: "24px",
            paddingBlock: "12px",
          }}
        />
      </div>

      {/* Divider */}
      <div
        aria-hidden
        className="hidden sm:block self-stretch"
        style={{
          width: 1,
          backgroundColor: "var(--color-border)",
          marginBlock: "auto",
          height: 24,
        }}
      />

      {/* Where */}
      <div className="hidden sm:flex flex-1 items-center gap-2 min-w-0">
        <MapPin
          size={18}
          strokeWidth={2}
          className="shrink-0"
          style={{ color: "var(--color-text-tertiary)" }}
          aria-hidden
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onFocus={() => setFocused("location")}
          onBlur={() => setFocused(null)}
          placeholder="City, locality, or pincode"
          aria-label="Location"
          className="w-full bg-transparent border-0 outline-none placeholder:text-[var(--color-text-tertiary)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-base)",
            lineHeight: "24px",
            paddingBlock: "12px",
          }}
        />
        <ChevronDown
          size={14}
          strokeWidth={2}
          style={{ color: "var(--color-text-tertiary)" }}
          aria-hidden
        />
      </div>

      {/* Search button */}
      <button
        type="button"
        onClick={() => onSearch?.({ query, location })}
        className="shrink-0 inline-flex items-center justify-center gap-2 transition-all duration-150 hover:bg-[var(--color-accent-hover)]"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-text-inverse)",
          borderRadius: "var(--radius-md)",
          padding: "12px 24px",
          fontFamily: "var(--font-jakarta), sans-serif",
          fontWeight: 600,
          fontSize: "var(--text-base)",
          lineHeight: "20px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <span className="hidden sm:inline">Search</span>
        <Search size={16} strokeWidth={2.5} className="sm:hidden" />
      </button>
    </div>
  );
}
