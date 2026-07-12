"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Info, X, TrendingUp } from "lucide-react";

/**
 * NotificationCenter — premium notification bell with dropdown.
 *
 * Shows a badge with unread count, and a spring-animated dropdown
 * with categorized notifications (info, success, warning).
 *
 * Notifications are in-memory for demo. In production, these would
 * come from a WebSocket or polling API.
 */

type NotificationType = "info" | "success" | "warning";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "success", title: "New subscription", description: "Sankalp Restaurant upgraded to Yearly plan (₹9,999)", timestamp: "2 min ago", read: false },
  { id: "n2", type: "warning", title: "Listing pending approval", description: "Carz Service Hub is awaiting verification", timestamp: "15 min ago", read: false },
  { id: "n3", type: "info", title: "New review flagged", description: "A review on Aster CMI Hospital was flagged as spam", timestamp: "1 hour ago", read: false },
  { id: "n4", type: "success", title: "Backup completed", description: "Automatic database backup completed (124 MB)", timestamp: "3 hours ago", read: true },
  { id: "n5", type: "info", title: "Weekly report ready", description: "Your weekly analytics summary is available", timestamp: "1 day ago", read: true },
];

const ICON_MAP: Record<NotificationType, typeof Bell> = {
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
};

const COLOR_MAP: Record<NotificationType, string> = {
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  info: "var(--color-accent)",
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications (${unreadCount} unread)`}
        className="relative inline-flex items-center justify-center transition-all duration-150 hover:bg-[var(--color-surface-2)]"
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius-md)",
          color: open ? "var(--color-accent)" : "var(--color-text-secondary)",
        }}
      >
        <Bell size={18} strokeWidth={2} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="absolute inline-flex items-center justify-center font-display font-bold"
            style={{
              top: 4,
              right: 4,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 999,
              backgroundColor: "var(--color-warning)",
              color: "#FFFFFF",
              fontSize: 10,
            }}
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 border rounded-[16px] overflow-hidden glass-strong"
            style={{
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]"
            >
              <div className="flex items-center gap-2">
                <h3
                  className="font-display font-bold"
                  style={{ color: "var(--color-text-primary)", fontSize: "var(--text-sm)" }}
                >
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span
                    className="inline-flex items-center justify-center font-display font-bold"
                    style={{
                      minWidth: 18,
                      height: 18,
                      padding: "0 5px",
                      borderRadius: 999,
                      backgroundColor: "var(--color-warning)",
                      color: "#FFFFFF",
                      fontSize: 10,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="font-medium transition-colors hover:text-[var(--color-accent)]"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckCircle2 size={32} strokeWidth={2} style={{ color: "var(--color-success)", margin: "0 auto 8px" }} />
                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    All caught up
                  </p>
                </div>
              ) : (
                notifications.map((n, i) => {
                  const Icon = ICON_MAP[n.type];
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="group relative px-4 py-3 border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
                      onClick={() => markRead(n.id)}
                      style={{
                        backgroundColor: n.read ? "transparent" : "var(--color-accent-light)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="shrink-0 inline-flex items-center justify-center mt-0.5"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: COLOR_MAP[n.type] + "20",
                          }}
                        >
                          <Icon size={14} strokeWidth={2.5} style={{ color: COLOR_MAP[n.type] }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className="font-medium"
                              style={{
                                color: "var(--color-text-primary)",
                                fontFamily: "var(--font-inter), sans-serif",
                                fontSize: "var(--text-sm)",
                              }}
                            >
                              {n.title}
                            </p>
                            {!n.read && (
                              <span
                                className="inline-block shrink-0"
                                style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "var(--color-accent)" }}
                              />
                            )}
                          </div>
                          <p
                            className="mt-0.5"
                            style={{
                              color: "var(--color-text-secondary)",
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "var(--text-xs)",
                              lineHeight: "16px",
                            }}
                          >
                            {n.description}
                          </p>
                          <p
                            className="mt-1"
                            style={{
                              color: "var(--color-text-tertiary)",
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: 11,
                            }}
                          >
                            {n.timestamp}
                          </p>
                        </div>
                        {/* Dismiss button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismiss(n.id);
                          }}
                          aria-label="Dismiss notification"
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center"
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "var(--radius-sm)",
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          <X size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div
              className="px-4 py-2.5 border-t border-[var(--color-border)] text-center"
              style={{ backgroundColor: "var(--color-surface-2)" }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-medium transition-colors hover:text-[var(--color-accent)]"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                }}
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
