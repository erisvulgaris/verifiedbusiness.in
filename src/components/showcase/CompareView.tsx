"use client";

import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import { CategoryChip, OpenBadge, RatingBadge, VerifiedBadge } from "@/components/directory/Badges";
import { useCompare } from "./CompareContext";
import { BUSINESSES } from "@/lib/directory-data";
import {
  Check,
  X,
  Star,
  MapPin,
  Phone,
  Clock,
  CreditCard,
  Globe,
  Trash2,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useDocumentTitle } from "./SeoStructuredData";
import { EmptyStateIllustration } from "@/components/directory/EmptyStateIllustration";

export function CompareView({
  onOpenBusiness,
  onNavigateHome,
  onNavigateCategory,
}: {
  onOpenBusiness?: (id: string) => void;
  onNavigateHome?: () => void;
  onNavigateCategory?: () => void;
}) {
  const { compareList, removeFromCompare, clearCompare, maxItems } = useCompare();
  const businesses = BUSINESSES.filter((b) => compareList.includes(b.id));
  // Sort by compareList order so it's stable
  const sorted = compareList
    .map((id) => businesses.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  useDocumentTitle(
    sorted.length > 0
      ? `Compare ${sorted.length} businesses | VerifiedBusiness.in`
      : "Compare businesses side-by-side | VerifiedBusiness.in",
  );

  return (
    <div className="directory-container py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "India", onClick: onNavigateHome },
          { label: "Compare businesses" },
        ]}
      />

      <header className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1
            className="font-display font-bold"
            style={{
              fontSize: "clamp(var(--text-2xl), 5vw, var(--text-3xl))",
              lineHeight: "44px",
              letterSpacing: "-0.3px",
              color: "var(--color-text-primary)",
            }}
          >
            Compare businesses
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
            Side-by-side comparison of up to {maxItems} businesses — rating,
            hours, payment methods, and verified status. Pick the right one in
            seconds.
          </p>
        </div>
        {sorted.length > 0 && (
          <button
            type="button"
            onClick={clearCompare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-all duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
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
        /* ---------- EMPTY STATE ---------- */
        <div className="mt-12 border border-dashed border-[var(--color-border-strong)] rounded-[16px] bg-[var(--color-surface)] p-10 sm:p-16 text-center max-w-2xl mx-auto">
          <EmptyStateIllustration type="no-compare" size={140} className="mx-auto" />
          <h2
            className="mt-6 font-display font-bold"
            style={{
              fontSize: "var(--text-xl)",
              letterSpacing: "-0.2px",
              color: "var(--color-text-primary)",
            }}
          >
            Nothing to compare yet
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
            Browse businesses and click the compare icon to add up to {maxItems}{" "}
            here. We'll show you rating, hours, payment methods, and verified
            status side-by-side.
          </p>
          <button
            type="button"
            onClick={onNavigateCategory}
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] transition-all duration-150 hover:shadow-[var(--shadow-md)]"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-inverse)",
              fontFamily: "var(--font-jakarta), sans-serif",
              fontWeight: 600,
              fontSize: "var(--text-sm)",
            }}
          >
            Browse businesses
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        /* ---------- COMPARISON TABLE ---------- */
        <div className="mt-8 overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[640px] sm:min-w-0 px-4 sm:px-0">
            <div
              className="border border-[var(--color-border)] rounded-[16px] bg-[var(--color-surface)] overflow-hidden"
            >
              {/* Header row — business names + remove buttons */}
              <div
                className="grid border-b border-[var(--color-border)]"
                style={{
                  gridTemplateColumns: `180px repeat(${sorted.length}, minmax(180px, 1fr))`,
                }}
              >
                <div
                  className="p-4 sm:p-5"
                  style={{
                    backgroundColor: "var(--color-surface-2)",
                  }}
                >
                  <p
                    className="font-display font-semibold"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    Compare
                  </p>
                  <p
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    {sorted.length} of {maxItems}
                  </p>
                </div>
                {sorted.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 sm:p-5 border-l border-[var(--color-border)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenBusiness?.(b.id)}
                        className="text-left"
                      >
                        <h3
                          className="font-display font-semibold line-clamp-2"
                          style={{
                            fontSize: "var(--text-base)",
                            color: "var(--color-accent)",
                            letterSpacing: "-0.2px",
                            textDecoration: "none",
                          }}
                        >
                          {b.name}
                        </h3>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCompare(b.id)}
                        aria-label={`Remove ${b.name} from comparison`}
                        className="shrink-0 inline-flex items-center justify-center transition-colors hover:text-[var(--color-warning)]"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "var(--radius-sm)",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                    <div className="mt-2">
                      <CategoryChip label={b.category} variant="compact" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Rating row */}
              <CompareRow label="Rating" colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={14}
                        strokeWidth={2.2}
                        className="fill-[var(--color-warning)]"
                        style={{ color: "var(--color-warning)" }}
                      />
                      <RatingBadge rating={b.rating} reviewCount={b.reviewCount} />
                    </div>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Verification */}
              <CompareRow label="Verified" colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    {b.verified ? (
                      <VerifiedBadge />
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-md font-medium"
                        style={{
                          backgroundColor: "var(--color-warning-light)",
                          color: "var(--color-warning)",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "var(--text-xs)",
                        }}
                      >
                        Unverified
                      </span>
                    )}
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Open status */}
              <CompareRow label="Status" colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    <OpenBadge open={b.openNow} />
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Years active */}
              <CompareRow label="Years active" colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    <span
                      className="font-display font-semibold"
                      style={{
                        color: "var(--color-text-primary)",
                        fontSize: "var(--text-base)",
                      }}
                    >
                      {b.yearsActive}+ years
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Price range */}
              <CompareRow label="Price range" colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    <span
                      className="font-display font-semibold"
                      style={{
                        color: "var(--color-text-primary)",
                        fontSize: "var(--text-base)",
                      }}
                    >
                      {b.priceRange ?? "—"}
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Address */}
              <CompareRow label="Address" icon={MapPin} colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    <p
                      style={{
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-sm)",
                        lineHeight: "20px",
                      }}
                    >
                      {b.address}
                    </p>
                    <p
                      className="mt-1"
                      style={{
                        color: "var(--color-text-tertiary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {b.locality}, {b.city} — {b.pincode}
                    </p>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Hours */}
              <CompareRow label="Hours" icon={Clock} colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    <p
                      style={{
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {b.hours}
                    </p>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Payment methods */}
              <CompareRow label="Payment" icon={CreditCard} colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    <div className="flex flex-wrap gap-1">
                      {b.paymentMethods.map((p) => (
                        <span
                          key={p}
                          className="inline-flex px-2 py-[3px] rounded-md font-medium"
                          style={{
                            backgroundColor: "var(--color-surface-2)",
                            color: "var(--color-text-secondary)",
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "var(--text-xs)",
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Phone */}
              <CompareRow label="Phone" icon={Phone} colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    <a
                      href={`tel:${b.phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-[var(--color-accent)]"
                      style={{
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-sm)",
                        fontWeight: 500,
                      }}
                    >
                      {b.phone}
                    </a>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Website */}
              <CompareRow label="Website" icon={Globe} colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    {b.website ? (
                      <a
                        href={`https://${b.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-accent)]"
                        style={{
                          color: "var(--color-accent)",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "var(--text-sm)",
                          fontWeight: 500,
                        }}
                      >
                        Visit
                        <ArrowRight size={12} strokeWidth={2.5} />
                      </a>
                    ) : (
                      <span
                        style={{
                          color: "var(--color-text-tertiary)",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "var(--text-sm)",
                        }}
                      >
                        —
                      </span>
                    )}
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Highlights */}
              <CompareRow label="Highlights" colCount={sorted.length}>
                {sorted.map((b) => (
                  <CompareCell key={b.id}>
                    <ul className="space-y-1.5">
                      {b.highlights.slice(0, 4).map((h, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5"
                        >
                          <Check
                            size={12}
                            strokeWidth={3}
                            className="mt-1 shrink-0"
                            style={{ color: "var(--color-success)" }}
                          />
                          <span
                            style={{
                              color: "var(--color-text-primary)",
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "var(--text-xs)",
                              lineHeight: "16px",
                            }}
                          >
                            {h}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* CTA row */}
              <div
                className="grid border-t border-[var(--color-border)]"
                style={{
                  gridTemplateColumns: `180px repeat(${sorted.length}, minmax(180px, 1fr))`,
                }}
              >
                <div className="p-4 sm:p-5" style={{ backgroundColor: "var(--color-surface-2)" }} />
                {sorted.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 sm:p-5 border-l border-[var(--color-border)]"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenBusiness?.(b.id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 transition-all duration-150 hover:shadow-[var(--shadow-md)]"
                      style={{
                        backgroundColor: "var(--color-accent)",
                        color: "var(--color-text-inverse)",
                        fontFamily: "var(--font-jakarta), sans-serif",
                        fontWeight: 600,
                        fontSize: "var(--text-sm)",
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      View details
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint to add more */}
            {sorted.length < maxItems && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={onNavigateCategory}
                  className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--color-accent-hover)]"
                  style={{
                    color: "var(--color-accent)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  <Plus size={14} strokeWidth={2.5} />
                  Add more businesses to compare ({maxItems - sorted.length} slot{maxItems - sorted.length === 1 ? "" : "s"} left)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CompareRow({
  label,
  icon: Icon,
  children,
  colCount,
}: {
  label: string;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  children: React.ReactNode;
  colCount: number;
}) {
  return (
    <div
      className="grid border-b border-[var(--color-border)] last:border-b-0"
      style={{
        gridTemplateColumns: `180px repeat(${colCount}, minmax(180px, 1fr))`,
      }}
    >
      <div
        className="p-4 sm:p-5 flex items-start gap-2"
        style={{ backgroundColor: "var(--color-surface-2)" }}
      >
        {Icon && (
          <Icon
            size={14}
            strokeWidth={2}
            style={{ color: "var(--color-text-tertiary)", marginTop: 2 }}
          />
        )}
        <span
          className="font-medium"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-sm)",
          }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function CompareCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-5 border-l border-[var(--color-border)]">
      {children}
    </div>
  );
}
