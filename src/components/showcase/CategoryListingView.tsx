"use client";

import { useState } from "react";
import { ListingCard, ListingCardSkeleton, ListingCardEmpty } from "@/components/directory/ListingCard";
import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import { SearchBar } from "@/components/directory/SearchBar";
import { BUSINESSES, FILTER_OPTIONS, type Business } from "@/lib/directory-data";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { useDocumentTitle } from "./SeoStructuredData";

export function CategoryListingView({
  onOpenBusiness,
  onNavigateHome,
}: {
  onOpenBusiness?: (id: string) => void;
  onNavigateHome?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState<"verified" | "all">("all");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  useDocumentTitle("Restaurants in Bengaluru — Verified Listings | Bharat Directory");

  const togglePayment = (method: string) => {
    setSelectedPayments((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method],
    );
  };

  const togglePrice = (price: string) => {
    setSelectedPrices((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price],
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // Collect all unique tags from businesses for the tag filter
  const allTags = Array.from(
    new Set(BUSINESSES.flatMap((b) => b.tags ?? [])),
  ).sort();

  // Apply filters
  let filtered = BUSINESSES.filter((b) => {
    if (verification === "verified" && !b.verified) return false;
    if (minRating !== null && b.rating < minRating) return false;
    if (selectedPayments.length > 0) {
      const hasMethod = selectedPayments.some((m) => b.paymentMethods.includes(m));
      if (!hasMethod) return false;
    }
    if (selectedPrices.length > 0) {
      if (!b.priceRange || !selectedPrices.includes(b.priceRange)) return false;
    }
    if (selectedTags.length > 0) {
      const hasTag = selectedTags.some((t) => b.tags?.includes(t));
      if (!hasTag) return false;
    }
    return true;
  });

  // Apply sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviewCount - a.reviewCount;
      case "newest":
        return a.yearsActive - b.yearsActive; // newer = fewer years
      default:
        return 0;
    }
  });

  const activeFilterCount =
    (verification === "verified" ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    selectedPayments.length +
    selectedPrices.length +
    selectedTags.length;

  const clearAllFilters = () => {
    setVerification("all");
    setMinRating(null);
    setSelectedPayments([]);
    setSelectedPrices([]);
    setSelectedTags([]);
  };

  return (
    <div className="directory-container py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "India", onClick: onNavigateHome },
          { label: "Karnataka", onClick: onNavigateHome },
          { label: "Bengaluru", onClick: onNavigateHome },
          { label: "Restaurants" },
        ]}
      />

      {/* Page header */}
      <header className="mt-4 sm:mt-6">
        <h1
          className="font-display font-bold"
          style={{
            fontSize: "clamp(var(--text-xl), 4vw, var(--text-2xl))",
            lineHeight: "36px",
            letterSpacing: "-0.3px",
            color: "var(--color-text-primary)",
          }}
        >
          Restaurants in Bengaluru
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
            {filtered.length.toLocaleString("en-IN")}
          </span>{" "}
          verified and unverified listings across 198 pincodes. Updated{" "}
          <span style={{ color: "var(--color-text-tertiary)" }}>14 days ago</span>.
        </p>
      </header>

      {/* Search bar (compact) */}
      <div className="mt-6">
        <SearchBar />
      </div>

      {/* Mobile filter toggle */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          Showing {filtered.length} of {BUSINESSES.length} businesses
        </p>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-3 py-2 border border-[var(--color-border-strong)] rounded-[10px] bg-[var(--color-surface)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
          }}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          Filters
          {activeFilterCount > 0 && (
            <span
              className="inline-flex items-center justify-center"
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                backgroundColor: "var(--color-accent)",
                color: "var(--color-text-inverse)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
        {/* ---------- FILTERS SIDEBAR ---------- */}
        <aside className="hidden lg:block">
          <FiltersPanel
            verification={verification}
            setVerification={setVerification}
            minRating={minRating}
            setMinRating={setMinRating}
            selectedPayments={selectedPayments}
            togglePayment={togglePayment}
            selectedPrices={selectedPrices}
            togglePrice={togglePrice}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            allTags={allTags}
            sortBy={sortBy}
            setSortBy={setSortBy}
            activeFilterCount={activeFilterCount}
            onClear={clearAllFilters}
          />
        </aside>

        {/* ---------- LISTING GRID ---------- */}
        <div>
          {/* Sort bar */}
          <div className="hidden lg:flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {verification === "verified" && (
                <FilterChip label="Verified only" onClear={() => setVerification("all")} />
              )}
              {minRating !== null && (
                <FilterChip
                  label={`${minRating}+ rating`}
                  onClear={() => setMinRating(null)}
                />
              )}
              {selectedPayments.map((m) => (
                <FilterChip key={m} label={m} onClear={() => togglePayment(m)} />
              ))}
              {selectedPrices.map((p) => (
                <FilterChip key={`price-${p}`} label={`Price ${p}`} onClear={() => togglePrice(p)} />
              ))}
              {selectedTags.map((t) => (
                <FilterChip key={`tag-${t}`} label={t} onClear={() => toggleTag(t)} />
              ))}
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="font-medium transition-colors hover:text-[var(--color-accent)]"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* View toggle + sort */}
            <div className="flex items-center gap-3">
              {/* List / Map toggle */}
              <div
                className="inline-flex p-0.5 rounded-[8px]"
                style={{
                  backgroundColor: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                }}
                role="group"
                aria-label="View mode"
              >
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all duration-150"
                  style={{
                    backgroundColor: viewMode === "list" ? "var(--color-surface)" : "transparent",
                    color: viewMode === "list" ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                    fontWeight: viewMode === "list" ? 600 : 500,
                    boxShadow: viewMode === "list" ? "var(--shadow-xs)" : "none",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="3.5" cy="6" r="1.5" fill="currentColor" />
                    <circle cx="3.5" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="3.5" cy="18" r="1.5" fill="currentColor" />
                  </svg>
                  List
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  aria-pressed={viewMode === "map"}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all duration-150"
                  style={{
                    backgroundColor: viewMode === "map" ? "var(--color-surface)" : "transparent",
                    color: viewMode === "map" ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                    fontWeight: viewMode === "map" ? 600 : 500,
                    boxShadow: viewMode === "map" ? "var(--shadow-xs)" : "none",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <line x1="9" y1="4" x2="9" y2="18" stroke="currentColor" strokeWidth="2" />
                    <line x1="15" y1="6" x2="15" y2="20" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Map
                </button>
              </div>

              <label className="inline-flex items-center gap-2">
                <span
                  style={{
                    color: "var(--color-text-tertiary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  Sort by
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-[var(--color-border-strong)] rounded-[8px] px-3 py-1.5 bg-[var(--color-surface)]"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                  fontWeight: 500,
                }}
              >
                {FILTER_OPTIONS.sortBy.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            </div>
          </div>

          {/* Grid or Map view */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <ListingCardEmpty />
          ) : viewMode === "map" ? (
            <MapView businesses={filtered} onOpenBusiness={onOpenBusiness} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filtered.map((b) => (
                <ListingCard
                  key={b.id}
                  business={b}
                  onOpen={() => onOpenBusiness?.(b.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <nav
            className="mt-8 flex items-center justify-center gap-1"
            aria-label="Pagination"
          >
            {["‹", "1", "2", "3", "…", "12", "›"].map((p, i) => (
              <button
                key={i}
                type="button"
                className="inline-flex items-center justify-center transition-all duration-150"
                style={{
                  minWidth: 36,
                  height: 36,
                  padding: "0 8px",
                  borderRadius: "var(--radius-sm)",
                  border: p === "1" ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                  backgroundColor: p === "1" ? "var(--color-accent-light)" : "var(--color-surface)",
                  color: p === "1" ? "var(--color-accent)" : "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: p === "1" ? 600 : 500,
                }}
              >
                {p}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ---------- MOBILE FILTERS DRAWER (simple) ---------- */}
      {mobileFiltersOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div
            className="relative ml-auto w-full max-w-sm h-full overflow-y-auto"
            style={{
              backgroundColor: "var(--color-surface)",
              padding: 16,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="font-display font-bold"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--color-text-primary)",
                }}
              >
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="inline-flex items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-sm)",
                  color: "var(--color-text-secondary)",
                }}
                aria-label="Close filters"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
            <FiltersPanel
              verification={verification}
              setVerification={setVerification}
              minRating={minRating}
              setMinRating={setMinRating}
              selectedPayments={selectedPayments}
              togglePayment={togglePayment}
              selectedPrices={selectedPrices}
              togglePrice={togglePrice}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              allTags={allTags}
              sortBy={sortBy}
              setSortBy={setSortBy}
              activeFilterCount={activeFilterCount}
              onClear={clearAllFilters}
            />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-text-inverse)",
                fontFamily: "var(--font-jakarta), sans-serif",
                fontWeight: 600,
                fontSize: "var(--text-base)",
                padding: "14px 24px",
                borderRadius: "var(--radius-md)",
              }}
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Filters panel ---------- */
function FiltersPanel({
  verification,
  setVerification,
  minRating,
  setMinRating,
  selectedPayments,
  togglePayment,
  selectedPrices,
  togglePrice,
  selectedTags,
  toggleTag,
  allTags,
  sortBy,
  setSortBy,
  activeFilterCount,
  onClear,
}: {
  verification: "verified" | "all";
  setVerification: (v: "verified" | "all") => void;
  minRating: number | null;
  setMinRating: (n: number | null) => void;
  selectedPayments: string[];
  togglePayment: (m: string) => void;
  selectedPrices: string[];
  togglePrice: (p: string) => void;
  selectedTags: string[];
  toggleTag: (t: string) => void;
  allTags: string[];
  sortBy: string;
  setSortBy: (s: string) => void;
  activeFilterCount: number;
  onClear: () => void;
}) {
  return (
    <div
      className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-5 lg:sticky lg:top-24"
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="font-display font-semibold"
          style={{
            fontSize: "var(--text-base)",
            color: "var(--color-text-primary)",
          }}
        >
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="font-medium transition-colors hover:text-[var(--color-accent)]"
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Sort (mobile-only inside drawer; on desktop it's in the sort bar) */}
      <div className="lg:hidden mb-5">
        <FilterLabel>Sort by</FilterLabel>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-[var(--color-border-strong)] rounded-[8px] px-3 py-2 bg-[var(--color-surface)]"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          {FILTER_OPTIONS.sortBy.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Verification */}
      <div className="mb-5">
        <FilterLabel>Verification</FilterLabel>
        <div className="space-y-2">
          {FILTER_OPTIONS.verification.map((v) => {
            const isActive =
              (v === "Verified only" && verification === "verified") ||
              (v === "Include unverified" && verification === "all");
            return (
              <label
                key={v}
                className="flex items-center gap-2.5 cursor-pointer"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-primary)",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setVerification(v === "Verified only" ? "verified" : "all")
                  }
                  className="inline-flex items-center justify-center shrink-0"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: isActive
                      ? "1.5px solid var(--color-accent)"
                      : "1.5px solid var(--color-border-strong)",
                    backgroundColor: isActive
                      ? "var(--color-accent)"
                      : "transparent",
                  }}
                  aria-checked={isActive}
                  role="checkbox"
                >
                  {isActive && (
                    <Check size={12} strokeWidth={3} color="#FFFFFF" />
                  )}
                </button>
                {v}
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-5">
        <FilterLabel>Minimum rating</FilterLabel>
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.ratings.map((r) => {
            const value = parseFloat(r);
            const isActive = minRating === value;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setMinRating(isActive ? null : value)}
                className="px-3 py-1.5 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: isActive
                    ? "var(--color-accent-light)"
                    : "var(--color-surface-2)",
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                  border: isActive
                    ? "1px solid var(--color-accent-border)"
                    : "1px solid var(--color-border)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment methods */}
      <div>
        <FilterLabel>Payment methods</FilterLabel>
        <div className="space-y-2">
          {FILTER_OPTIONS.paymentMethods.map((m) => {
            const isActive = selectedPayments.includes(m);
            return (
              <label
                key={m}
                className="flex items-center gap-2.5 cursor-pointer"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-primary)",
                }}
              >
                <button
                  type="button"
                  onClick={() => togglePayment(m)}
                  className="inline-flex items-center justify-center shrink-0"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: isActive
                      ? "1.5px solid var(--color-accent)"
                      : "1.5px solid var(--color-border-strong)",
                    backgroundColor: isActive
                      ? "var(--color-accent)"
                      : "transparent",
                  }}
                  aria-checked={isActive}
                  role="checkbox"
                >
                  {isActive && (
                    <Check size={12} strokeWidth={3} color="#FFFFFF" />
                  )}
                </button>
                {m}
              </label>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <FilterLabel>Price range</FilterLabel>
        <div className="flex flex-wrap gap-2">
          {["$", "$$", "$$$", "$$$$"].map((p) => {
            const isActive = selectedPrices.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePrice(p)}
                className="px-3 py-1.5 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: isActive
                    ? "var(--color-accent-light)"
                    : "var(--color-surface-2)",
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                  border: isActive
                    ? "1px solid var(--color-accent-border)"
                    : "1px solid var(--color-border)",
                  fontFamily: "var(--font-jakarta), sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div>
        <FilterLabel>Tags</FilterLabel>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {allTags.slice(0, 12).map((t) => {
            const isActive = selectedTags.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className="px-2.5 py-1 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: isActive
                    ? "var(--color-accent-light)"
                    : "var(--color-surface-2)",
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                  border: isActive
                    ? "1px solid var(--color-accent-border)"
                    : "1px solid var(--color-border)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-2.5 font-medium"
      style={{
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "var(--text-sm)",
        fontWeight: 500,
      }}
    >
      {children}
    </p>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: "var(--color-accent-light)",
        color: "var(--color-accent)",
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "var(--text-xs)",
        fontWeight: 500,
      }}
    >
      {label}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Remove ${label} filter`}
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </span>
  );
}

/* ---------- Map view (toggle from list) ---------- */
function MapView({
  businesses,
  onOpenBusiness,
}: {
  businesses: Business[];
  onOpenBusiness?: (id: string) => void;
}) {
  // Deterministic pseudo-positions for each business based on its id
  const positions = businesses.map((b, i) => {
    let hash = 0;
    for (let j = 0; j < b.id.length; j++) {
      hash = (hash * 31 + b.id.charCodeAt(j)) & 0xffff;
    }
    const x = 10 + (hash % 80) + (i % 3) * 5;
    const y = 15 + ((hash >> 4) % 70) + (i % 2) * 5;
    return { business: b, x, y };
  });

  return (
    <div
      className="relative border border-[var(--color-border)] rounded-[16px] overflow-hidden"
      style={{
        height: 600,
        backgroundColor: "var(--color-surface-2)",
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(27, 79, 216, 0.03) 25%, rgba(27, 79, 216, 0.03) 26%, transparent 27%, transparent 74%, rgba(27, 79, 216, 0.03) 75%, rgba(27, 79, 216, 0.03) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(27, 79, 216, 0.03) 25%, rgba(27, 79, 216, 0.03) 26%, transparent 27%, transparent 74%, rgba(27, 79, 216, 0.03) 75%, rgba(27, 79, 216, 0.03) 76%, transparent 77%, transparent)
        `,
        backgroundSize: "60px 60px",
      }}
    >
      {/* Map "roads" — decorative SVG lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0,30 Q40,35 100,28" stroke="var(--color-border-strong)" strokeWidth="0.4" fill="none" />
        <path d="M0,60 Q50,55 100,65" stroke="var(--color-border-strong)" strokeWidth="0.4" fill="none" />
        <path d="M20,0 Q25,50 30,100" stroke="var(--color-border-strong)" strokeWidth="0.4" fill="none" />
        <path d="M70,0 Q65,50 75,100" stroke="var(--color-border-strong)" strokeWidth="0.4" fill="none" />
        <path d="M0,45 L100,50" stroke="var(--color-border)" strokeWidth="0.2" fill="none" />
        <path d="M50,0 L48,100" stroke="var(--color-border)" strokeWidth="0.2" fill="none" />
      </svg>

      {/* Pins */}
      {positions.map(({ business, x, y }) => (
        <button
          key={business.id}
          type="button"
          onClick={() => onOpenBusiness?.(business.id)}
          className="group absolute -translate-x-1/2 -translate-y-full transition-transform duration-200 hover:scale-110"
          style={{
            left: `${x}%`,
            top: `${y}%`,
          }}
          aria-label={`${business.name} — ${business.rating} stars, ${business.locality}`}
        >
          {/* Pin shape */}
          <div className="relative">
            <div
              className="flex flex-col items-center"
            >
              {/* Rating bubble */}
              <div
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full mb-1 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                  opacity: 0.95,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--color-warning)" aria-hidden>
                  <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2-6.3-4.6L5.7 21 8 14.4 2 9.4h7.6z" />
                </svg>
                <span
                  className="font-display font-bold"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-jakarta), sans-serif",
                    fontSize: 11,
                  }}
                >
                  {business.rating.toFixed(1)}
                </span>
              </div>
              {/* Pin pointer */}
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "8px solid var(--color-accent)",
                }}
              />
            </div>
          </div>
        </button>
      ))}

      {/* Map controls (decorative) */}
      <div
        className="absolute top-4 right-4 flex flex-col border border-[var(--color-border)] rounded-[8px] overflow-hidden"
        style={{ backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
      >
        <button
          type="button"
          aria-label="Zoom in"
          className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
          style={{ width: 36, height: 36, color: "var(--color-text-secondary)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />
        <button
          type="button"
          aria-label="Zoom out"
          className="inline-flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
          style={{ width: 36, height: 36, color: "var(--color-text-secondary)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Map info card (bottom-left) */}
      <div
        className="absolute bottom-4 left-4 border border-[var(--color-border)] rounded-[8px] p-3 max-w-xs"
        style={{ backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
      >
        <p
          className="font-display font-semibold"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-jakarta), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          {businesses.length} businesses on map
        </p>
        <p
          className="mt-1"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          Click any pin to view details. Pin position is approximate based on pincode.
        </p>
      </div>
    </div>
  );
}
