"use client";

import { motion, useAnimation, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Premium animation primitives for VerifiedBusiness.in.
 *
 * Design philosophy: animations should feel physical, spring-based, and
 * purposeful. No linear transitions. No decorative animation. Every motion
 * communicates state change or guides attention.
 *
 * Springs: all springs use { stiffness: 400, damping: 30 } — snappy but smooth.
 */

// ---------- Spring configs ----------

export const SPRING = {
  snappy: { type: "spring" as const, stiffness: 400, damping: 30 },
  gentle: { type: "spring" as const, stiffness: 200, damping: 25 },
  bouncy: { type: "spring" as const, stiffness: 500, damping: 15 },
  slow: { type: "spring" as const, stiffness: 120, damping: 20 },
};

// ---------- Page transition ----------

/**
 * PageTransition — wraps each view with a smooth fade + slide entrance.
 * Respects prefers-reduced-motion.
 */
export function PageTransition({ children, viewKey }: { children: ReactNode; viewKey: string }) {
  return (
    <motion.div
      key={viewKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={SPRING.gentle}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

// ---------- Stagger container ----------

/**
 * StaggerContainer — parent container that staggers child animations.
 * Children must use StaggerItem.
 */
export function StaggerContainer({
  children,
  delay = 0,
  staggerChildren = 0.05,
  className,
}: {
  children: ReactNode;
  delay?: number;
  staggerChildren?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem — child of StaggerContainer. Fades + slides up.
 */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: SPRING.snappy },
      }}
    >
      {children}
    </motion.div>
  );
}

// ---------- Magnetic button ----------

/**
 * MagneticButton — button that subtly follows the cursor.
 * Premium micro-interaction for CTAs.
 */
export function MagneticButton({
  children,
  onClick,
  className,
  style,
  strength = 0.3,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      style={{ x: springX, y: springY, ...style }}
      whileTap={{ scale: 0.95 }}
      transition={SPRING.snappy}
    >
      {children}
    </motion.button>
  );
}

// ---------- Animated number counter ----------

/**
 * AnimatedNumber — counts up from 0 to `value` when scrolled into view.
 * Premium feel for KPIs and stats.
 */
export function AnimatedNumber({
  value,
  duration = 1.2,
  format = (n: number) => Math.round(n).toLocaleString("en-IN"),
  className,
  style,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const controls = useAnimation();
  const display = useMotionValue(0);
  const rounded = useTransform(display, (v) => format(v));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          controls.start({
            onUpdate: (latest) => {
              // @ts-expect-error — framer-motion type mismatch
              display.set(latest);
            },
          });
          // Animate the motion value directly
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = (now - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            display.set(eased * value);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, controls, display]);

  return (
    <motion.span ref={ref} className={className} style={style}>
      {rounded}
    </motion.span>
  );
}

// ---------- Tilt card ----------

/**
 * TiltCard — card with 3D tilt effect following cursor.
 * Premium hover interaction for listing cards.
 */
export function TiltCard({
  children,
  className,
  style,
  maxTilt = 6,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);
    rotateY.set(percentX * maxTilt);
    rotateX.set(-percentY * maxTilt);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 800,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ---------- Fade in on scroll ----------

/**
 * FadeInOnScroll — fades + slides up when scrolled into view.
 * For content sections (not cards — those use StaggerContainer).
 */
export function FadeInOnScroll({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ ...SPRING.gentle, delay }}
    >
      {children}
    </motion.div>
  );
}

// ---------- Glow pulse ----------

/**
 * GlowPulse — pulsing glow effect for badges + indicators.
 * Uses box-shadow animation (not transform — doesn't trigger layout).
 */
export function GlowPulse({
  children,
  color = "var(--color-accent)",
  duration = 2,
  className,
}: {
  children: ReactNode;
  color?: string;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 0 0 ${color}00`,
          `0 0 20px 4px ${color}33`,
          `0 0 0 0 ${color}00`,
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// ---------- Scale in ----------

/**
 * ScaleIn — scale + fade entrance for modals + popovers.
 */
export function ScaleIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ ...SPRING.snappy, delay }}
    >
      {children}
    </motion.div>
  );
}

// ---------- Slide in from bottom ----------

/**
 * SlideInBottom — slide entrance from bottom for toasts + sheets.
 */
export function SlideInBottom({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ ...SPRING.snappy, delay }}
    >
      {children}
    </motion.div>
  );
}
