"use client";

import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import { CategoryTile } from "@/components/directory/CategoryTile";
import { CATEGORIES } from "@/lib/directory-data";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDocumentTitle } from "./SeoStructuredData";

export function AllCategoriesView({
  onNavigateCategory,
  onNavigateHome,
}: {
  onNavigateCategory?: () => void;
  onNavigateHome?: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  useDocumentTitle("All Categories — Browse 12+ Business Types | Bharat Directory");

  return (
    <div className="directory-container py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "India", onClick: onNavigateHome },
          { label: "All categories" },
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
          Browse all categories
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
          From restaurants and hospitals to lawyers and salons — every category
          on Bharat Directory, with verified listings across all 28 states.
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
            placeholder="Filter categories..."
            aria-label="Filter categories"
            className="w-full bg-transparent border-0 outline-none placeholder:text-[var(--color-text-tertiary)] py-3"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-base)",
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total categories", value: `${CATEGORIES.length}+` },
          { label: "Total listings", value: "1.2 Cr+" },
          { label: "States covered", value: "28 + 8 UTs" },
          { label: "Pincodes mapped", value: "19,000+" },
        ].map((s) => (
          <div
            key={s.label}
            className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-4"
          >
            <p
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
                marginBottom: 4,
              }}
            >
              {s.label}
            </p>
            <p
              className="font-display font-bold"
              style={{
                color: "var(--color-text-primary)",
                fontSize: "var(--text-xl)",
                letterSpacing: "-0.2px",
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Categories grid with descriptions */}
      <section className="mt-12">
        <h2
          className="font-display font-bold mb-6"
          style={{
            fontSize: "var(--text-2xl)",
            letterSpacing: "-0.3px",
            color: "var(--color-text-primary)",
          }}
        >
          {search ? `Matching "${search}"` : "All categories"}
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
              No categories match
            </p>
            <p
              className="mt-2"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            >
              Try a different keyword — or browse the full list.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((cat) => (
              <CategoryTile
                key={cat.id}
                category={cat}
                onClick={() => onNavigateCategory?.()}
              />
            ))}
          </div>
        )}
      </section>

      {/* Detailed list with descriptions */}
      <section className="mt-16">
        <h2
          className="font-display font-bold mb-6"
          style={{
            fontSize: "var(--text-2xl)",
            letterSpacing: "-0.3px",
            color: "var(--color-text-primary)",
          }}
        >
          What you'll find in each category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onNavigateCategory?.()}
                className="group flex items-start gap-4 text-left border border-[var(--color-border)] rounded-[16px] bg-[var(--color-surface)] p-5 transition-all duration-200 hover:border-[var(--color-accent-border)] hover:shadow-[var(--shadow-sm)]"
              >
                <div
                  className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.08]"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "var(--color-accent-light)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <Icon
                    size={24}
                    strokeWidth={2}
                    style={{ color: "var(--color-accent)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className="font-display font-semibold"
                      style={{
                        fontSize: "var(--text-base)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {cat.name}
                    </h3>
                    <span
                      style={{
                        color: "var(--color-text-tertiary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {cat.listingCount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p
                    className="mt-1"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                      lineHeight: "20px",
                    }}
                  >
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
