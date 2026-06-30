"use client";

import { useState } from "react";
import { ListingCard, ListingCardEmpty } from "@/components/directory/ListingCard";
import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import { SearchBar } from "@/components/directory/SearchBar";
import {
  searchBusinesses,
  type Business,
} from "@/lib/directory-data";
import { Search, MapPin } from "lucide-react";
import { useDocumentTitle } from "./SeoStructuredData";

export function SearchResultsView({
  initialQuery = "",
  initialLocation = "",
  onOpenBusiness,
  onNavigateHome,
}: {
  initialQuery?: string;
  initialLocation?: string;
  onOpenBusiness?: (id: string) => void;
  onNavigateHome?: () => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const results: Business[] = searchBusinesses(query, location);

  useDocumentTitle(
    query || location
      ? `Search${query ? ` "${query}"` : ""}${location ? ` near ${location}` : ""} — ${results.length} results | VerifiedBusiness.in`
      : "Search businesses across India | VerifiedBusiness.in",
  );

  return (
    <div className="directory-container py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "India", onClick: onNavigateHome },
          { label: "Search results" },
        ]}
      />

      <header className="mt-4">
        <h1
          className="font-display font-bold"
          style={{
            fontSize: "clamp(var(--text-xl), 4vw, var(--text-2xl))",
            lineHeight: "36px",
            letterSpacing: "-0.3px",
            color: "var(--color-text-primary)",
          }}
        >
          Search results
        </h1>
        <p
          className="mt-2"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-base)",
            lineHeight: "24px",
          }}
        >
          <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>
            {results.length.toLocaleString("en-IN")}
          </span>{" "}
          businesses found
          {query && (
            <>
              {" "}
              for{" "}
              <span style={{ color: "var(--color-accent)", fontWeight: 500 }}>
                &ldquo;{query}&rdquo;
              </span>
            </>
          )}
          {location && (
            <>
              {" "}
              near{" "}
              <span style={{ color: "var(--color-accent)", fontWeight: 500 }}>
                {location}
              </span>
            </>
          )}
        </p>
      </header>

      <div className="mt-6">
        <SearchBarWithState
          initialQuery={query}
          initialLocation={location}
          onQueryChange={setQuery}
          onLocationChange={setLocation}
        />
      </div>

      {/* Suggestions when empty */}
      {results.length === 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          <SuggestionCard
            icon={Search}
            title="Try a category"
            body="e.g. Restaurants, Doctors, AC repair"
          />
          <SuggestionCard
            icon={MapPin}
            title="Add a location"
            body="City name, locality, or pincode"
          />
          <SuggestionCard
            icon={Search}
            title="Check spelling"
            body="Or try a broader keyword"
          />
        </div>
      )}

      {/* Results */}
      <div className="mt-8">
        {results.length === 0 ? (
          <ListingCardEmpty query={query} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {results.map((b) => (
              <ListingCard
                key={b.id}
                business={b}
                onOpen={() => onOpenBusiness?.(b.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Search bar with controlled state (for live filtering) */

function SearchBarWithState({
  initialQuery,
  initialLocation,
  onQueryChange,
  onLocationChange,
}: {
  initialQuery: string;
  initialLocation: string;
  onQueryChange: (q: string) => void;
  onLocationChange: (l: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-2"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1.5px solid var(--color-border-strong)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        padding: "6px 6px 6px 16px",
      }}
    >
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <Search
          size={18}
          strokeWidth={2}
          className="shrink-0"
          style={{ color: "var(--color-text-tertiary)" }}
        />
        <input
          type="text"
          defaultValue={initialQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="What are you looking for?"
          aria-label="Search query"
          className="w-full bg-transparent border-0 outline-none placeholder:text-[var(--color-text-tertiary)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-base)",
            lineHeight: "24px",
            paddingBlock: "12px",
          }}
        />
      </div>
      <div
        aria-hidden
        className="hidden sm:block"
        style={{
          width: 1,
          backgroundColor: "var(--color-border)",
          height: 24,
        }}
      />
      <div className="hidden sm:flex flex-1 items-center gap-2 min-w-0">
        <MapPin
          size={18}
          strokeWidth={2}
          className="shrink-0"
          style={{ color: "var(--color-text-tertiary)" }}
        />
        <input
          type="text"
          defaultValue={initialLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="City, locality, or pincode"
          aria-label="Location"
          className="w-full bg-transparent border-0 outline-none placeholder:text-[var(--color-text-tertiary)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-base)",
            lineHeight: "24px",
            paddingBlock: "12px",
          }}
        />
      </div>
    </div>
  );
}

function SuggestionCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-4">
      <div
        className="inline-flex items-center justify-center mb-3"
        style={{
          width: 32,
          height: 32,
          borderRadius: "var(--radius-sm)",
          backgroundColor: "var(--color-accent-light)",
        }}
      >
        <Icon size={16} strokeWidth={2} style={{ color: "var(--color-accent)" }} />
      </div>
      <p
        className="font-medium"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
        }}
      >
        {title}
      </p>
      <p
        className="mt-1"
        style={{
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          lineHeight: "20px",
        }}
      >
        {body}
      </p>
    </div>
  );
}
