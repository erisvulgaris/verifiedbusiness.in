"use client";

import { cn } from "@/lib/utils";
import { Home, Compass, LayoutGrid, MapPin, Heart } from "lucide-react";
import type { ViewKey } from "./TopNav";
import { useFavorites } from "./FavoritesContext";

/**
 * MobileTabBar — premium bottom navigation for mobile (like a native app).
 *
 * Spec alignment:
 *  - Light mode first — surface bg, top border, shadow 0 -4px 16px warm
 *  - 5 tabs: Home, Browse, Categories, Locations, Favorites
 *  - 44px touch targets (accessibility minimum)
 *  - Active tab: accent color + filled icon
 *  - Respects iOS safe-area-inset-bottom
 *  - Hidden on lg+ (desktop uses top nav)
 *
 * Premium differentiator: this feels like a real app, not a website.
 */
const TABS: { key: ViewKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "category", label: "Browse", icon: Compass },
  { key: "all-categories", label: "Categories", icon: LayoutGrid },
  { key: "locations", label: "Locations", icon: MapPin },
  { key: "favorites", label: "Saved", icon: Heart },
];

export function MobileTabBar({
  activeView,
  onViewChange,
}: {
  activeView: ViewKey | "business";
  onViewChange: (v: ViewKey) => void;
}) {
  const { favorites } = useFavorites();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
      aria-label="Mobile navigation"
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        boxShadow: "0 -4px 16px rgba(26, 25, 23, 0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <ul className="flex items-stretch justify-around px-2">
        {TABS.map((tab) => {
          const isActive =
            activeView === tab.key ||
            (tab.key === "category" && activeView === "business") ||
            (tab.key === "category" && activeView === "search") ||
            (tab.key === "category" && activeView === "compare");
          const Icon = tab.icon;
          const showBadge = tab.key === "favorites" && favorites.length > 0;

          return (
            <li key={tab.key} className="flex-1">
              <button
                type="button"
                onClick={() => onViewChange(tab.key)}
                aria-current={isActive ? "page" : undefined}
                className="w-full flex flex-col items-center gap-1 py-2 px-1 transition-colors duration-150"
                style={{
                  minHeight: 56,
                  color: isActive ? "var(--color-accent)" : "var(--color-text-secondary)",
                }}
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? "fill-[var(--color-accent-light)]" : "fill-none"}
                  />
                  {showBadge && (
                    <span
                      className="absolute -top-1 -right-2 inline-flex items-center justify-center font-display font-bold"
                      style={{
                        minWidth: 16,
                        height: 16,
                        padding: "0 4px",
                        borderRadius: 999,
                        backgroundColor: "var(--color-accent)",
                        color: "var(--color-text-inverse)",
                        fontSize: 10,
                      }}
                    >
                      {favorites.length}
                    </span>
                  )}
                </div>
                <span
                  className="font-medium leading-none"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 10,
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
