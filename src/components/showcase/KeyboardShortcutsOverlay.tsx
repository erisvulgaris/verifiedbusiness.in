"use client";

import { useState, useEffect } from "react";
import { X, Search, Star, Heart, GitCompare, Command, ArrowUp, ArrowDown, CornerDownLeft, XCircle } from "lucide-react";

/**
 * KeyboardShortcutsOverlay — shows all keyboard shortcuts when user presses `?`.
 *
 * Discoverability: a small "?" hint appears in the bottom-right corner on first visit,
 * fades after 10 seconds. Press `?` anytime to open this overlay.
 */

const SHORTCUTS = [
  {
    group: "Navigation",
    items: [
      { keys: ["⌘", "K"], label: "Open command palette", icon: Search },
      { keys: ["?"], label: "Show this shortcuts overlay", icon: Command },
      { keys: ["g", "h"], label: "Go to Home", icon: null },
      { keys: ["g", "b"], label: "Go to Browse", icon: null },
      { keys: ["g", "a"], label: "Go to Admin dashboard", icon: null },
      { keys: ["g", "f"], label: "Go to Favorites", icon: Heart },
      { keys: ["g", "c"], label: "Go to Compare", icon: GitCompare },
    ],
  },
  {
    group: "Command palette",
    items: [
      { keys: ["↑"], label: "Move selection up", icon: ArrowUp },
      { keys: ["↓"], label: "Move selection down", icon: ArrowDown },
      { keys: ["↵"], label: "Select item", icon: CornerDownLeft },
      { keys: ["Esc"], label: "Close palette / overlay", icon: XCircle },
    ],
  },
  {
    group: "Business detail",
    items: [
      { keys: ["f"], label: "Toggle favorite", icon: Star },
      { keys: ["c"], label: "Add to comparison", icon: GitCompare },
    ],
  },
];

export function KeyboardShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Open on `?` (Shift + /)
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        // Don't trigger if typing in an input
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        setOpen((o) => !o);
      }
      // Close on Escape
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={() => setOpen(false)}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(26, 25, 23, 0.5)", backdropFilter: "blur(4px)" }}
      />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto border rounded-[16px]"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div>
            <h2
              className="font-display font-bold"
              style={{
                fontSize: "var(--text-lg)",
                letterSpacing: "-0.2px",
                color: "var(--color-text-primary)",
              }}
            >
              Keyboard shortcuts
            </h2>
            <p
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
                marginTop: 2,
              }}
            >
              Press <kbd style={kbdStyle}>?</kbd> anytime to open this overlay
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close shortcuts overlay"
            className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {SHORTCUTS.map((group) => (
            <div key={group.group}>
              <h3
                className="font-display font-semibold mb-3"
                style={{
                  color: "var(--color-text-tertiary)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {group.group}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-4 py-1.5"
                    >
                      <span
                        className="flex items-center gap-2"
                        style={{
                          color: "var(--color-text-primary)",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "var(--text-sm)",
                        }}
                      >
                        {Icon && (
                          <Icon size={14} strokeWidth={2} style={{ color: "var(--color-text-tertiary)" }} />
                        )}
                        {item.label}
                      </span>
                      <span className="flex items-center gap-1">
                        {item.keys.map((key, j) => (
                          <kbd key={j} style={kbdStyle}>{key}</kbd>
                        ))}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t border-[var(--color-border)] flex items-center justify-between"
          style={{ backgroundColor: "var(--color-surface-2)" }}
        >
          <p
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            Shortcuts work everywhere except when typing in input fields
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-medium transition-colors hover:text-[var(--color-accent)]"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 22,
  height: 22,
  padding: "0 6px",
  borderRadius: "var(--radius-sm)",
  backgroundColor: "var(--color-surface-2)",
  color: "var(--color-text-primary)",
  fontFamily: "ui-monospace, monospace",
  fontSize: 11,
  fontWeight: 600,
  border: "1px solid var(--color-border)",
  boxShadow: "var(--shadow-xs)",
};

/**
 * Floating hint button — shows "?" in bottom-right.
 * Appears on first visit, fades after 10s. Click to open overlay.
 */
export function KeyboardHintButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 2 seconds
    const showTimer = setTimeout(() => setVisible(true), 2000);
    // Hide after 12 seconds
    const hideTimer = setTimeout(() => setVisible(false), 12000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        // Dispatch the `?` keydown so the overlay opens
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }));
        setVisible(false);
      }}
      aria-label="Show keyboard shortcuts (press ?)"
      className="fixed bottom-4 right-4 z-40 lg:bottom-6 lg:right-6 inline-flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: "var(--color-text-primary)",
        color: "var(--color-text-inverse)",
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "var(--text-xs)",
        fontWeight: 500,
        boxShadow: "var(--shadow-lg)",
        animation: "fadeInUp 0.3s ease-out",
      }}
    >
      <kbd
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.2)",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        ?
      </kbd>
      Shortcuts
    </button>
  );
}
