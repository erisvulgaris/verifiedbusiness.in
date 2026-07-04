"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface RecentlyViewedContextValue {
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | undefined>(undefined);

const STORAGE_KEY = "verifiedbusiness:recently-viewed";
const MAX_ITEMS = 6;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  // Lazy initializer — reads from localStorage on the client, empty on SSR.
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed)) return parsed.slice(0, MAX_ITEMS);
      }
    } catch {
      /* ignore */
    }
    return [];
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch {
      /* ignore */
    }
  }, [recentlyViewed]);

  const addRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => {
      const without = prev.filter((x) => x !== id);
      return [id, ...without].slice(0, MAX_ITEMS);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => setRecentlyViewed([]), []);

  return (
    <RecentlyViewedContext.Provider
      value={{ recentlyViewed, addRecentlyViewed, clearRecentlyViewed }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) {
    return {
      recentlyViewed: [],
      addRecentlyViewed: () => {},
      clearRecentlyViewed: () => {},
    };
  }
  return ctx;
}
