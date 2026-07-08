"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, TrendingUp, X } from "lucide-react";

/**
 * SearchSuggestions — AI-powered search suggestions dropdown.
 *
 * Shows trending searches, recent searches, and AI-suggested queries
 * based on the current input. Premium autocomplete experience.
 */

const TRENDING_SEARCHES = [
  "Restaurants in Bengaluru",
  "Hospitals near me",
  "AC repair services",
  "Lawyers in Mumbai",
  "Wedding photographers",
  "Gyms in Pune",
];

const AI_SUGGESTIONS = [
  { query: "Best South Indian restaurants", icon: "🍛", category: "Restaurants" },
  { query: "24/7 pharmacies nearby", icon: "💊", category: "Pharmacies" },
  { query: "Top-rated lawyers for property disputes", icon: "⚖️", category: "Legal" },
  { query: "Affordable gyms with personal trainers", icon: "💪", category: "Fitness" },
  { query: "Wedding photographers with candid style", icon: "📸", category: "Photography" },
];

export function SearchSuggestions({
  query,
  onSelect,
  visible,
}: {
  query: string;
  onSelect: (suggestion: string) => void;
  visible: boolean;
}) {
  const recentSearches = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("verifiedbusiness:recent-searches");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, [query]); // Re-read when query changes

  // Filter AI suggestions based on query
  const filteredAI = useMemo(() => {
    if (!query.trim()) return AI_SUGGESTIONS;
    const q = query.toLowerCase();
    return AI_SUGGESTIONS.filter((s) => s.query.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }, [query]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute top-full left-0 right-0 mt-2 z-50 border rounded-[16px] overflow-hidden glass-strong"
        style={{
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* AI suggestions */}
        {filteredAI.length > 0 && (
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2 px-2">
              <Sparkles size={12} strokeWidth={2.5} style={{ color: "var(--color-accent)" }} />
              <span
                style={{
                  color: "var(--color-text-tertiary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                AI Suggestions
              </span>
            </div>
            {filteredAI.slice(0, 3).map((s, i) => (
              <motion.button
                key={s.query}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                type="button"
                onClick={() => onSelect(s.query)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-left transition-colors hover:bg-[var(--color-accent-light)]"
              >
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {s.query}
                  </p>
                  <p
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 11,
                    }}
                  >
                    {s.category}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="p-3 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 mb-2 px-2">
              <Clock size={12} strokeWidth={2.5} style={{ color: "var(--color-text-tertiary)" }} />
              <span
                style={{
                  color: "var(--color-text-tertiary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Recent
              </span>
            </div>
            {recentSearches.slice(0, 3).map((s: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(s)}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-left transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <Clock size={12} strokeWidth={2} style={{ color: "var(--color-text-tertiary)" }} />
                <span
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {s}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Trending */}
        <div className="p-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 mb-2 px-2">
            <TrendingUp size={12} strokeWidth={2.5} style={{ color: "var(--color-success)" }} />
            <span
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Trending
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TRENDING_SEARCHES.slice(0, 4).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSelect(s)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-150 hover:scale-105"
                style={{
                  backgroundColor: "var(--color-surface-2)",
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <TrendingUp size={10} strokeWidth={2.5} style={{ color: "var(--color-success)" }} />
                {s}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Need Clock icon
import { Clock } from "lucide-react";

/**
 * Hook to save recent searches to localStorage.
 */
export function useRecentSearches() {
  const saveSearch = (query: string) => {
    if (typeof window === "undefined" || !query.trim()) return;
    try {
      const stored = localStorage.getItem("verifiedbusiness:recent-searches");
      const recent = stored ? JSON.parse(stored) : [];
      const updated = [query, ...recent.filter((s: string) => s !== query)].slice(0, 5);
      localStorage.setItem("verifiedbusiness:recent-searches", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return { saveSearch };
}
