"use client";

import { useState } from "react";
import { ListingCard, ListingCardSkeleton, ListingCardEmpty } from "@/components/directory/ListingCard";
import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import { SearchBar } from "@/components/directory/SearchBar";
import { BUSINESSES, FILTER_OPTIONS } from "@/lib/directory-data";
import { SlidersHorizontal, X, Check } from "lucide-react";

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
  const [sortBy, setSortBy] = useState("relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const togglePayment = (method: string) => {
    setSelectedPayments((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method],
    );
  };

  // Apply filters
  let filtered = BUSINESSES.filter((b) => {
    if (verification === "verified" && !b.verified) return false;
    if (minRating !== null && b.rating < minRating) return false;
    if (selectedPayments.length > 0) {
      const hasMethod = selectedPayments.some((m) => b.paymentMethods.includes(m));
      if (!hasMethod) return false;
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
    selectedPayments.length;

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
            sortBy={sortBy}
            setSortBy={setSortBy}
            activeFilterCount={activeFilterCount}
            onClear={() => {
              setVerification("all");
              setMinRating(null);
              setSelectedPayments([]);
            }}
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
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setVerification("all");
                    setMinRating(null);
                    setSelectedPayments([]);
                  }}
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

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <ListingCardEmpty />
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
              sortBy={sortBy}
              setSortBy={setSortBy}
              activeFilterCount={activeFilterCount}
              onClear={() => {
                setVerification("all");
                setMinRating(null);
                setSelectedPayments([]);
              }}
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
