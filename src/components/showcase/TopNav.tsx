"use client";

import { cn } from "@/lib/utils";
import { MapPin, ChevronDown, Plus } from "lucide-react";

export type ViewKey = "home" | "category" | "detail" | "style-guide";

interface NavItem {
  key: ViewKey;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home" },
  { key: "category", label: "Browse" },
  { key: "detail", label: "Business" },
  { key: "style-guide", label: "Style Guide" },
];

/**
 * TopNav — sticky directory platform navigation.
 * Uses the brand warm-white surface with a 1px bottom border.
 */
export function TopNav({
  activeView,
  onViewChange,
}: {
  activeView: ViewKey;
  onViewChange: (v: ViewKey) => void;
}) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--color-border)]"
      style={{
        backgroundColor: "rgba(250, 250, 248, 0.92)",
        backdropFilter: "saturate(180%) blur(12px)",
        WebkitBackdropFilter: "saturate(180%) blur(12px)",
      }}
    >
      <div className="directory-container !py-0">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button
            type="button"
            onClick={() => onViewChange("home")}
            className="flex items-center gap-2 shrink-0"
          >
            <span
              className="inline-flex items-center justify-center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: "var(--color-accent)",
              }}
              aria-hidden
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span
              className="font-display font-bold hidden sm:block"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--color-text-primary)",
                letterSpacing: "-0.2px",
              }}
            >
              Bharat Directory
            </span>
          </button>

          {/* Center nav (desktop) */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Sections"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onViewChange(item.key)}
                  className={cn(
                    "px-3.5 py-2 rounded-[8px] transition-all duration-150",
                    isActive ? "bg-[var(--color-accent-light)]" : "hover:bg-[var(--color-surface-2)]",
                  )}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? "var(--color-accent)"
                      : "var(--color-text-secondary)",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right side: city selector + list business */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-all duration-150 hover:border-[var(--color-accent)]"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              <MapPin size={14} strokeWidth={2} style={{ color: "var(--color-accent)" }} />
              Bengaluru
              <ChevronDown size={12} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => onViewChange("home")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] transition-all duration-150 hover:shadow-[var(--shadow-md)]"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-text-inverse)",
                fontFamily: "var(--font-jakarta), sans-serif",
                fontWeight: 600,
                fontSize: "var(--text-sm)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <Plus size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">List Business</span>
              <span className="sm:hidden">List</span>
            </button>
          </div>
        </div>

        {/* Mobile nav (below main bar) */}
        <nav
          className="md:hidden flex items-center gap-1 pb-2 -mx-1 overflow-x-auto"
          aria-label="Sections"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onViewChange(item.key)}
                className={cn(
                  "px-3 py-1.5 rounded-[8px] whitespace-nowrap transition-all duration-150",
                  isActive ? "bg-[var(--color-accent-light)]" : "hover:bg-[var(--color-surface-2)]",
                )}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

/**
 * Footer — minimal, premium.
 */
export function Footer() {
  return (
    <footer
      className="mt-16 sm:mt-24 border-t border-[var(--color-border)]"
      style={{ backgroundColor: "var(--color-surface-2)" }}
    >
      <div className="directory-container py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  backgroundColor: "var(--color-accent)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className="font-display font-bold"
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--color-text-primary)",
                }}
              >
                Bharat Directory
              </span>
            </div>
            <p
              className="mt-3 max-w-xs"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                lineHeight: "20px",
              }}
            >
              India's premium local business directory. Verified listings
              across 28 states, 780+ districts, and 19,000+ pincodes.
            </p>
          </div>

          <FooterColumn
            title="Browse"
            links={["Restaurants", "Doctors", "Home Services", "Schools", "Pharmacies"]}
          />
          <FooterColumn
            title="Cities"
            links={["Bengaluru", "Mumbai", "Delhi", "Pune", "Hyderabad"]}
          />
          <FooterColumn
            title="For business"
            links={["List your business", "Pricing", "Verify your listing", "Support", "API docs"]}
          />
        </div>

        <div
          className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <p
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            © 2026 Bharat Directory · Made in India · Light Mode v1.0
          </p>
          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Cookies", "Sitemap"].map((l) => (
              <a
                key={l}
                href="#"
                className="transition-colors hover:text-[var(--color-accent)]"
                style={{
                  color: "var(--color-text-tertiary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4
        className="font-display font-semibold mb-3"
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="transition-colors hover:text-[var(--color-accent)]"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
