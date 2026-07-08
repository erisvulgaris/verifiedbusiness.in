"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode, useState, useCallback, useRef } from "react";

/**
 * Ripple — material-style ripple effect on click.
 * Premium micro-interaction for buttons.
 */
export function Ripple({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const idRef = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = idRef.current++;
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  }, []);

  return (
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "currentColor",
              pointerEvents: "none",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * AnimatedCounter — smooth count-up using requestAnimationFrame.
 * Simpler than the Framer Motion version, works everywhere.
 */
export function SimpleAnimatedCounter({
  value,
  duration = 1000,
  className,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  // Use IntersectionObserver to trigger on scroll
  if (ref.current && !started.current) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(ref.current);
  }

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

/**
 * PulsingDot — animated status indicator.
 */
export function PulsingDot({ color = "var(--color-success)", size = 8 }: { color?: string; size?: number }) {
  return (
    <span
      className="inline-block relative"
      style={{ width: size, height: size }}
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="relative inline-block rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    </span>
  );
}

/**
 * ShimmerText — skeleton text placeholder with shimmer.
 */
export function ShimmerText({ width = "100%", height = 14, className }: { width?: string | number; height?: number; className?: string }) {
  return (
    <div
      className={`premium-skeleton rounded ${className ?? ""}`}
      style={{ width, height }}
    />
  );
}
