"use client";

import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import { ListingCard, ListingCardEmpty } from "@/components/directory/ListingCard";
import { useFavorites } from "./FavoritesContext";
import { BUSINESSES } from "@/lib/directory-data";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import { useDocumentTitle } from "./SeoStructuredData";
import { EmptyStateIllustration } from "@/components/directory/EmptyStateIllustration";

export function FavoritesView({
  onOpenBusiness,
  onNavigateHome,
}: {
  onOpenBusiness?: (id: string) => void;
  onNavigateHome?: () => void;
}) {
  const { favorites, clearFavorites } = useFavorites();
  const businesses = BUSINESSES.filter((b) => favorites.includes(b.id));
  // Maintain favorites order (most-recent first)
  const sorted = favorites
    .map((id) => businesses.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  useDocumentTitle(
    sorted.length > 0
      ? `Your favorites (${sorted.length}) | VerifiedBusiness.in`
      : "Your favorites | VerifiedBusiness.in",
  );

  return (
    <div className="directory-container py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "India", onClick: onNavigateHome },
          { label: "Favorites" },
        ]}
      />

      <header className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1
            className="font-display font-bold flex items-center gap-3"
            style={{
              fontSize: "clamp(var(--text-2xl), 5vw, var(--text-3xl))",
              lineHeight: "44px",
              letterSpacing: "-0.3px",
              color: "var(--color-text-primary)",
            }}
          >
            Your favorites
            <span
              className="inline-flex items-center justify-center font-display"
              style={{
                minWidth: 32,
                height: 32,
                padding: "0 10px",
                borderRadius: 999,
                backgroundColor: "var(--color-accent-light)",
                color: "var(--color-accent)",
                fontSize: "var(--text-sm)",
                fontWeight: 700,
              }}
            >
              {sorted.length}
            </span>
          </h1>
          <p
            className="mt-2 max-w-2xl"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-base)",
              lineHeight: "24px",
            }}
          >
            Saved businesses, available on any device where you're signed in
            (local-only in this demo). Tap the heart icon on any listing to add
            it here.
          </p>
        </div>
        {sorted.length > 0 && (
          <button
            type="button"
            onClick={clearFavorites}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-all duration-150 hover:border-[var(--color-warning)] hover:text-[var(--color-warning)]"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
            }}
          >
            <Trash2 size={14} strokeWidth={2} />
            Clear all
          </button>
        )}
      </header>

      {sorted.length === 0 ? (
        <div className="mt-12 border border-dashed border-[var(--color-border-strong)] rounded-[16px] bg-[var(--color-surface)] p-10 sm:p-16 text-center max-w-2xl mx-auto">
          <EmptyStateIllustration type="no-favorites" size={140} className="mx-auto" />
          <h2
            className="mt-6 font-display font-bold"
            style={{
              fontSize: "var(--text-xl)",
              letterSpacing: "-0.2px",
              color: "var(--color-text-primary)",
            }}
          >
            No favorites yet
          </h2>
          <p
            className="mt-2 max-w-md mx-auto"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
              lineHeight: "20px",
            }}
          >
            Tap the heart icon on any listing card or business detail page to
            save it here for quick access.
          </p>
          <button
            type="button"
            onClick={onNavigateHome}
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] transition-all duration-150 hover:shadow-[var(--shadow-md)]"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-inverse)",
              fontFamily: "var(--font-jakarta), sans-serif",
              fontWeight: 600,
              fontSize: "var(--text-sm)",
            }}
          >
            Explore businesses
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {sorted.map((b) => (
            <ListingCard
              key={b.id}
              business={b}
              onOpen={() => onOpenBusiness?.(b.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
