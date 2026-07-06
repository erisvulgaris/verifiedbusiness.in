"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";

/**
 * BackToTopButton — floating button that appears after scrolling 400px.
 *
 * Premium UX:
 *  - Smooth scroll to top on click
 *  - Fade-in animation (respects prefers-reduced-motion)
 *  - Position: bottom-left on desktop (so it doesn't overlap mobile tab bar)
 *  - 44px touch target
 *  - Accessible: aria-label, keyboard focusable
 */
export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler(); // Check initial position
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = useCallback(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className="fixed bottom-4 left-4 z-40 lg:bottom-6 lg:left-6 inline-flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-[var(--shadow-lg)]"
      style={{
        width: 44,
        height: 44,
        borderRadius: 999,
        backgroundColor: "var(--color-surface)",
        color: "var(--color-accent)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-md)",
        animation: "fadeInUp 0.2s ease-out",
      }}
    >
      <ArrowUp size={18} strokeWidth={2.5} />
    </button>
  );
}

/**
 * ScrollProgressBar — thin accent bar at top showing scroll position.
 *
 * Premium differentiator: gives users a sense of how much content remains.
 * Hidden on mobile (too thin to be useful on small screens).
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className="hidden lg:block fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
      aria-hidden
    >
      <div
        className="h-full transition-[width] duration-75 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: "var(--color-accent)",
        }}
      />
    </div>
  );
}
