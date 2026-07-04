"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import { INDIA_STATES } from "@/lib/directory-data";
import { Search, MapPin, ChevronRight, Building2 } from "lucide-react";
import { useDocumentTitle } from "./SeoStructuredData";

export function LocationsView({
  onNavigateHome,
  onNavigateCategory,
}: {
  onNavigateHome?: () => void;
  onNavigateCategory?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const filtered = INDIA_STATES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = INDIA_STATES.find((s) => s.code === selectedState);

  useDocumentTitle(
    selected
      ? `${selected.name} — ${selected.cityCount} cities, ${selected.businessCount.toLocaleString("en-IN")} businesses | VerifiedBusiness.in`
      : "Browse by Location — 28 States, 4,000+ Cities | VerifiedBusiness.in",
  );

  return (
    <div className="directory-container py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "India", onClick: onNavigateHome },
          { label: selected ? selected.name : "All locations" },
        ]}
      />

      <header className="mt-4 max-w-3xl">
        <h1
          className="font-display font-bold"
          style={{
            fontSize: "clamp(var(--text-2xl), 5vw, var(--text-3xl))",
            lineHeight: "44px",
            letterSpacing: "-0.3px",
            color: "var(--color-text-primary)",
          }}
        >
          {selected ? `Browse in ${selected.name}` : "Browse by location"}
        </h1>
        <p
          className="mt-3"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-lg)",
            lineHeight: "28px",
          }}
        >
          India has 28 states, 8 union territories, 780+ districts, 4,000+
          cities, and 19,000+ pincodes. Every level is a first-class SEO asset.
          Pick where you want to search.
        </p>
      </header>

      {/* Search filter */}
      <div className="mt-6 max-w-md">
        <div
          className="flex items-center gap-2 px-4"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1.5px solid var(--color-border-strong)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <Search
            size={18}
            strokeWidth={2}
            style={{ color: "var(--color-text-tertiary)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter states..."
            aria-label="Filter states"
            className="w-full bg-transparent border-0 outline-none placeholder:text-[var(--color-text-tertiary)] py-3"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-base)",
            }}
          />
        </div>
      </div>

      {selected ? (
        /* ---------- DRILL-DOWN VIEW: cities in selected state ---------- */
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setSelectedState(null)}
            className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--color-accent)]"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
            }}
          >
            ← Back to all states
          </button>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            <div>
              <h2
                className="font-display font-bold mb-2"
                style={{
                  fontSize: "var(--text-2xl)",
                  letterSpacing: "-0.3px",
                  color: "var(--color-text-primary)",
                }}
              >
                Top cities in {selected.name}
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-base)",
                  lineHeight: "24px",
                  marginBottom: 24,
                }}
              >
                {selected.cityCount.toLocaleString("en-IN")} cities and towns —
                tap any city to browse verified listings there.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selected.featuredCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => onNavigateCategory?.()}
                    className="group flex items-center justify-between gap-3 border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-4 transition-all duration-200 hover:border-[var(--color-accent-border)] hover:shadow-[var(--shadow-sm)]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 36,
                          height: 36,
                          backgroundColor: "var(--color-accent-light)",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        <Building2
                          size={18}
                          strokeWidth={2}
                          style={{ color: "var(--color-accent)" }}
                        />
                      </div>
                      <div className="text-left">
                        <p
                          className="font-medium"
                          style={{
                            color: "var(--color-text-primary)",
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "var(--text-base)",
                          }}
                        >
                          {city}
                        </p>
                        <p
                          style={{
                            color: "var(--color-text-tertiary)",
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "var(--text-xs)",
                          }}
                        >
                          {Math.floor(selected.businessCount / selected.featuredCities.length).toLocaleString("en-IN")}+ listings
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      strokeWidth={2}
                      className="transition-transform group-hover:translate-x-0.5"
                      style={{ color: "var(--color-text-tertiary)" }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* State fact card */}
            <aside>
              <div
                className="border border-[var(--color-border)] rounded-[16px] p-5"
                style={{ backgroundColor: "var(--color-surface-2)" }}
              >
                <h3
                  className="font-display font-semibold mb-4"
                  style={{
                    fontSize: "var(--text-base)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {selected.name} at a glance
                </h3>
                <dl className="space-y-3">
                  <FactRow label="Capital" value={selected.capital} />
                  <FactRow label="Cities & towns" value={selected.cityCount.toLocaleString("en-IN")} />
                  <FactRow label="Total listings" value={`${(selected.businessCount / 1_000_000).toFixed(2)}M`} />
                  <FactRow label="State code" value={selected.code} />
                </dl>
                <button
                  type="button"
                  onClick={() => onNavigateCategory?.()}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 transition-all duration-150 hover:shadow-[var(--shadow-md)]"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-text-inverse)",
                    fontFamily: "var(--font-jakarta), sans-serif",
                    fontWeight: 600,
                    fontSize: "var(--text-sm)",
                    padding: "12px 20px",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  Browse all in {selected.name}
                  <ChevronRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </aside>
          </div>
        </div>
      ) : (
        /* ---------- GRID OF STATES ---------- */
        <div className="mt-8">
          <h2
            className="font-display font-bold mb-6"
            style={{
              fontSize: "var(--text-2xl)",
              letterSpacing: "-0.3px",
              color: "var(--color-text-primary)",
            }}
          >
            {search ? `States matching "${search}"` : "All states & UTs"}
          </h2>

          {filtered.length === 0 ? (
            <div className="border border-dashed border-[var(--color-border-strong)] rounded-[10px] bg-[var(--color-surface)] p-10 text-center">
              <p
                className="font-display font-semibold"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--color-text-primary)",
                }}
              >
                No states match
              </p>
              <p
                className="mt-2"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                }}
              >
                Try a different keyword — e.g. "Karnataka" or "Maharashtra".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((state) => (
                <button
                  key={state.code}
                  type="button"
                  onClick={() => setSelectedState(state.code)}
                  className="group text-left border border-[var(--color-border)] rounded-[16px] bg-[var(--color-surface)] p-5 transition-all duration-200 hover:border-[var(--color-accent-border)] hover:shadow-[var(--shadow-sm)]"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: "var(--color-accent-light)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <MapPin
                        size={20}
                        strokeWidth={2}
                        style={{ color: "var(--color-accent)" }}
                      />
                    </div>
                    <ChevronRight
                      size={16}
                      strokeWidth={2}
                      className="transition-transform group-hover:translate-x-0.5"
                      style={{ color: "var(--color-text-tertiary)" }}
                    />
                  </div>
                  <h3
                    className="font-display font-semibold"
                    style={{
                      fontSize: "var(--text-lg)",
                      color: "var(--color-text-primary)",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {state.name}
                  </h3>
                  <p
                    className="mt-1"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                      lineHeight: "20px",
                    }}
                  >
                    Capital: {state.capital}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                    <span
                      style={{
                        color: "var(--color-text-tertiary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {state.cityCount.toLocaleString("en-IN")} cities
                    </span>
                    <span
                      className="font-medium"
                      style={{
                        color: "var(--color-accent)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {(state.businessCount / 1_000_000).toFixed(2)}M listings
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hierarchy explainer */}
      <section className="mt-16">
        <h2
          className="font-display font-bold mb-4"
          style={{
            fontSize: "var(--text-2xl)",
            letterSpacing: "-0.3px",
            color: "var(--color-text-primary)",
          }}
        >
          India's geographic hierarchy — and why every level matters
        </h2>
        <p
          className="mb-6 max-w-2xl"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-base)",
            lineHeight: "24px",
          }}
        >
          Every level below is a first-class SEO asset. Every level gets its own
          page type. No level is skipped or collapsed into another.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { level: "1", name: "Country", value: "India", count: "1" },
            { level: "2", name: "State / UT", value: "36", count: "36" },
            { level: "3", name: "District", value: "780+", count: "780+" },
            { level: "4", name: "City / Town", value: "4,000+", count: "4,000+" },
            { level: "5", name: "Locality", value: "Variable", count: "—" },
            { level: "6", name: "Pincode", value: "19,000+", count: "19,000+" },
          ].map((h) => (
            <div
              key={h.level}
              className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-4"
            >
              <p
                className="font-mono"
                style={{
                  color: "var(--color-accent)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Level {h.level}
              </p>
              <p
                className="font-display font-semibold"
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {h.name}
              </p>
              <p
                className="mt-1"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-lg)",
                  fontWeight: 500,
                }}
              >
                {h.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt
        style={{
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
        }}
      >
        {label}
      </dt>
      <dd
        className="text-right"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
        }}
      >
        {value}
      </dd>
    </div>
  );
}
