"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface CompareContextValue {
  compareList: string[];
  isInCompare: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  maxItems: number;
}

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

const STORAGE_KEY = "verifiedbusiness:compare";
const MAX_ITEMS = 3;

export function CompareProvider({ children }: { children: ReactNode }) {
  // Lazy initializer — reads from localStorage on the client, empty on SSR.
  const [compareList, setCompareList] = useState<string[]>(() => {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
    } catch {
      /* ignore */
    }
  }, [compareList]);

  const toggleCompare = useCallback((id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((c) => c !== id);
      }
      if (prev.length >= MAX_ITEMS) {
        return prev; // ignore — max reached
      }
      return [...prev, id];
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareList((prev) => prev.filter((c) => c !== id));
  }, []);

  const isInCompare = useCallback((id: string) => compareList.includes(id), [compareList]);
  const clearCompare = useCallback(() => setCompareList([]), []);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isInCompare,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        maxItems: MAX_ITEMS,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    return {
      compareList: [],
      isInCompare: () => false,
      toggleCompare: () => {},
      removeFromCompare: () => {},
      clearCompare: () => {},
      maxItems: MAX_ITEMS,
    };
  }
  return ctx;
}
