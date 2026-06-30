"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  CornerDownLeft,
  MapPin,
  Building2,
  Heart,
  GitCompare,
  Home,
  LayoutGrid,
  Compass,
  BookOpen,
  Plus,
  Star,
  X,
} from "lucide-react";
import { BUSINESSES, CATEGORIES, INDIA_STATES } from "@/lib/directory-data";
import type { ViewKey } from "./TopNav";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  group: "Navigate" | "Businesses" | "Categories" | "Locations" | "Actions";
  action: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onNavigate,
  onOpenBusiness,
  onSearch,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (v: ViewKey) => void;
  onOpenBusiness: (id: string) => void;
  onSearch: (q: { query: string; location: string }) => void;
}) {
  const [query, setQueryState] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Custom setQuery that also resets active index — avoids effect cascade
  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    setActiveIndex(0);
  }, []);

  // Focus input when palette opens (no setState — just DOM focus)
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Build all items
  const allItems: CommandItem[] = [
    // Navigate
    {
      id: "nav-home",
      label: "Go to Home",
      hint: "Homepage",
      icon: Home,
      group: "Navigate",
      action: () => onNavigate("home"),
    },
    {
      id: "nav-browse",
      label: "Browse businesses",
      hint: "Category listing",
      icon: Compass,
      group: "Navigate",
      action: () => onNavigate("category"),
    },
    {
      id: "nav-categories",
      label: "All categories",
      hint: "12 categories",
      icon: LayoutGrid,
      group: "Navigate",
      action: () => onNavigate("all-categories"),
    },
    {
      id: "nav-locations",
      label: "Browse by location",
      hint: "States & cities",
      icon: MapPin,
      group: "Navigate",
      action: () => onNavigate("locations"),
    },
    {
      id: "nav-favorites",
      label: "Your favorites",
      hint: "Saved businesses",
      icon: Heart,
      group: "Navigate",
      action: () => onNavigate("favorites"),
    },
    {
      id: "nav-compare",
      label: "Compare businesses",
      hint: "Side-by-side",
      icon: GitCompare,
      group: "Navigate",
      action: () => onNavigate("compare"),
    },
    {
      id: "nav-style-guide",
      label: "Style guide",
      hint: "Design system",
      icon: BookOpen,
      group: "Navigate",
      action: () => onNavigate("style-guide"),
    },
    // Actions
    {
      id: "action-list",
      label: "List your business",
      hint: "Free listing",
      icon: Plus,
      group: "Actions",
      action: () => onNavigate("list-business"),
    },
    // Categories
    ...CATEGORIES.map((c) => ({
      id: `cat-${c.slug}`,
      label: c.name,
      hint: `${c.listingCount.toLocaleString("en-IN")} listings`,
      icon: c.icon,
      group: "Categories" as const,
      action: () => onNavigate("category"),
    })),
    // Locations
    ...INDIA_STATES.slice(0, 8).map((s) => ({
      id: `state-${s.code}`,
      label: s.name,
      hint: `${s.cityCount} cities`,
      icon: MapPin,
      group: "Locations" as const,
      action: () => onNavigate("locations"),
    })),
    // Businesses
    ...BUSINESSES.map((b) => ({
      id: `biz-${b.id}`,
      label: b.name,
      hint: `${b.category} · ${b.city}`,
      icon: Star,
      group: "Businesses" as const,
      action: () => onOpenBusiness(b.id),
    })),
  ];

  // Filter by query
  const filtered = query.trim()
    ? allItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.hint?.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q)
        );
      })
    : allItems;

  // Group filtered items
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const groupOrder: CommandItem["group"][] = ["Navigate", "Actions", "Businesses", "Categories", "Locations"];
  const flatFiltered = groupOrder.flatMap((g) => grouped[g] ?? []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = flatFiltered[activeIndex];
        if (item) {
          item.action();
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [flatFiltered, activeIndex, onClose],
  );

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(26, 25, 23, 0.4)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Palette */}
      <div
        className="relative w-full max-w-2xl border rounded-[16px] overflow-hidden flex flex-col"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-lg)",
          maxHeight: "70vh",
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]"
        >
          <Search size={18} strokeWidth={2} style={{ color: "var(--color-text-tertiary)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses, categories, locations, or jump to..."
            aria-label="Command palette search"
            className="flex-1 bg-transparent border-0 outline-none placeholder:text-[var(--color-text-tertiary)]"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-base)",
            }}
          />
          <kbd
            className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded font-mono"
            style={{
              backgroundColor: "var(--color-surface-2)",
              color: "var(--color-text-tertiary)",
              fontSize: 11,
              border: "1px solid var(--color-border)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="flex-1 overflow-y-auto py-2">
          {flatFiltered.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p
                className="font-display font-semibold"
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "var(--text-base)",
                }}
              >
                No matches for "{query}"
              </p>
              <p
                className="mt-1"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                }}
              >
                Try a different keyword — or press ESC to close.
              </p>
            </div>
          ) : (
            groupOrder.map((groupName) => {
              const items = grouped[groupName];
              if (!items || items.length === 0) return null;
              return (
                <div key={groupName} className="mb-1">
                  <div
                    className="px-4 py-1.5 font-display font-semibold"
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontSize: 11,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {groupName}
                  </div>
                  {items.map((item) => {
                    const idx = flatFiltered.indexOf(item);
                    const isActive = idx === activeIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-idx={idx}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => {
                          item.action();
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100"
                        style={{
                          backgroundColor: isActive ? "var(--color-accent-light)" : "transparent",
                        }}
                      >
                        <Icon
                          size={16}
                          strokeWidth={2}
                          style={{
                            color: isActive ? "var(--color-accent)" : "var(--color-text-tertiary)",
                          }}
                        />
                        <span
                          className="flex-1 min-w-0 truncate"
                          style={{
                            color: isActive ? "var(--color-accent)" : "var(--color-text-primary)",
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "var(--text-sm)",
                            fontWeight: isActive ? 500 : 400,
                          }}
                        >
                          {item.label}
                        </span>
                        {item.hint && (
                          <span
                            className="hidden sm:block shrink-0"
                            style={{
                              color: "var(--color-text-tertiary)",
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "var(--text-xs)",
                            }}
                          >
                            {item.hint}
                          </span>
                        )}
                        {isActive && (
                          <CornerDownLeft
                            size={12}
                            strokeWidth={2.5}
                            style={{ color: "var(--color-accent)" }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-[var(--color-border)]"
          style={{ backgroundColor: "var(--color-surface-2)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1"
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11,
              }}
            >
              <kbd
                className="inline-flex items-center justify-center font-mono"
                style={{
                  minWidth: 18,
                  height: 18,
                  padding: "0 4px",
                  borderRadius: 4,
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                ↑
              </kbd>
              <kbd
                className="inline-flex items-center justify-center font-mono"
                style={{
                  minWidth: 18,
                  height: 18,
                  padding: "0 4px",
                  borderRadius: 4,
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                ↓
              </kbd>
              to navigate
            </span>
            <span
              className="hidden sm:inline-flex items-center gap-1"
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11,
              }}
            >
              <kbd
                className="inline-flex items-center justify-center font-mono"
                style={{
                  minWidth: 18,
                  height: 18,
                  padding: "0 4px",
                  borderRadius: 4,
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                ↵
              </kbd>
              to select
            </span>
          </div>
          <span
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11,
            }}
          >
            {flatFiltered.length} result{flatFiltered.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook that registers a global Cmd+K / Ctrl+K shortcut to toggle the palette.
 */
export function useCommandPaletteShortcut(onToggle: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onToggle]);
}

/**
 * Floating trigger button — shows the Cmd+K hint.
 */
export function CommandPaletteTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-all duration-150 hover:border-[var(--color-accent)]"
      style={{
        color: "var(--color-text-tertiary)",
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "var(--text-sm)",
      }}
      aria-label="Open command palette"
    >
      <Search size={14} strokeWidth={2} />
      <span className="hidden lg:inline">Search or jump to...</span>
      <kbd
        className="inline-flex items-center justify-center font-mono"
        style={{
          minWidth: 22,
          height: 20,
          padding: "0 4px",
          borderRadius: 4,
          backgroundColor: "var(--color-surface-2)",
          color: "var(--color-text-tertiary)",
          fontSize: 11,
          border: "1px solid var(--color-border)",
        }}
      >
        ⌘K
      </kbd>
    </button>
  );
}
