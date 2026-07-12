"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

/**
 * DarkModeToggle — premium animated dark/light mode switch.
 *
 * Persists preference to localStorage. Applies .dark class to <html>.
 * Uses CSS custom property overrides for dark theme.
 *
 * Premium animation: the icon morphs between sun/moon with a
 * spring scale + rotate transition.
 */

type Theme = "light" | "dark";

const STORAGE_KEY = "verifiedbusiness:theme";

export function useTheme() {
  // Lazy initializer — read from localStorage during first render (no effect needed)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "dark" || stored === "light") {
        applyTheme(stored);
        return stored;
      }
    } catch {
      // ignore
    }
    return "light";
  });

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function DarkModeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="relative inline-flex items-center justify-center transition-all duration-150 hover:bg-[var(--color-surface-2)]"
      style={{
        width: 40,
        height: 40,
        borderRadius: "var(--radius-md)",
        color: "var(--color-text-secondary)",
      }}
    >
      <AnimatePresence mode="wait">
        {theme === "light" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Sun size={18} strokeWidth={2} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Moon size={18} strokeWidth={2} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
