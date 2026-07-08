"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";

/**
 * SwipeableCard — adds swipe-to-action on listing cards (mobile).
 *
 * Swipe right → favorite (heart icon appears)
 * Swipe left → compare (compare icon appears)
 *
 * Premium mobile interaction — feels like native email apps.
 */
export function SwipeableCard({
  children,
  onSwipeRight,
  onSwipeLeft,
  rightIcon,
  leftIcon,
  rightColor = "var(--color-accent)",
  leftColor = "var(--color-success)",
}: {
  children: React.ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightColor?: string;
  leftColor?: string;
}) {
  const [dragX, setDragX] = useState(0);
  const [showAction, setShowAction] = useState<"right" | "left" | null>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80;
    if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
    } else if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
    }
    setDragX(0);
    setShowAction(null);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragX(info.offset.x);
    if (info.offset.x > 40) setShowAction("right");
    else if (info.offset.x < -40) setShowAction("left");
    else setShowAction(null);
  };

  return (
    <div className="relative overflow-hidden lg:overflow-visible">
      {/* Right action background (favorite) */}
      <AnimatePresence>
        {showAction === "right" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-y-0 left-0 flex items-center pl-6 z-0"
            style={{ backgroundColor: rightColor + "20" }}
          >
            <div
              className="inline-flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                backgroundColor: rightColor,
              }}
            >
              {rightIcon}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left action background (compare) */}
      <AnimatePresence>
        {showAction === "left" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-y-0 right-0 flex items-center justify-end pr-6 z-0"
            style={{ backgroundColor: leftColor + "20" }}
          >
            <div
              className="inline-flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                backgroundColor: leftColor,
              }}
            >
              {leftIcon}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draggable card */}
      <motion.div
        drag={onSwipeRight || onSwipeLeft ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: dragX }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative z-10 lg:!transform-none"
        style={{ cursor: "grab" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * PullToRefresh — pull-down-to-refresh gesture (mobile).
 *
 * Shows a spinning indicator when user pulls down past threshold.
 * Calls onRefresh when released past threshold.
 */
export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
}: {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  threshold?: number;
}) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY.current > 0) {
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0) {
        setPullDistance(Math.min(diff * 0.5, threshold * 1.5));
      }
    }
  }, [threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > threshold) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    setPullDistance(0);
    startY.current = 0;
  }, [pullDistance, threshold, onRefresh]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative lg:!static"
    >
      {/* Pull indicator */}
      {(pullDistance > 0 || refreshing) && (
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
          style={{ width: 40, height: 40 }}
          animate={{
            y: refreshing ? 20 : pullDistance - 20,
            rotate: refreshing ? 360 : pullDistance * 2,
          }}
          transition={{ rotate: { duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" } }}
        >
          <RefreshCw size={24} strokeWidth={2.5} style={{ color: "var(--color-accent)" }} />
        </motion.div>
      )}

      <motion.div
        animate={{ y: refreshing ? 40 : pullDistance }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

import { RefreshCw } from "lucide-react";
