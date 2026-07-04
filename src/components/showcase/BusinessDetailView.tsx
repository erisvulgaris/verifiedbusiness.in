"use client";

import { useEffect } from "react";
import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import {
  BusinessDetailHeader,
  ContactActions,
  InfoBlock,
  HighlightsList,
} from "@/components/directory/BusinessDetail";
import { ListingCard } from "@/components/directory/ListingCard";
import { FAQAccordion } from "@/components/directory/FAQAccordion";
import { PhotoGallery } from "@/components/directory/PhotoGallery";
import { BUSINESSES, FAQS } from "@/lib/directory-data";
import { useRecentlyViewed } from "./RecentlyViewedContext";
import { useFavorites } from "./FavoritesContext";
import { useCompare } from "./CompareContext";
import { useBusinessJsonLd, useDocumentTitle } from "./SeoStructuredData";
import { getOpenStatus } from "@/lib/business-hours";
import { Heart, GitCompare, Star, PencilLine } from "lucide-react";
import { useDirectoryToast } from "./useDirectoryToast";

export function BusinessDetailView({
  businessId,
  onNavigateHome,
  onNavigateCategory,
  onOpenBusiness,
  onNavigateWriteReview,
}: {
  businessId?: string;
  onNavigateHome?: () => void;
  onNavigateCategory?: () => void;
  onOpenBusiness?: (id: string) => void;
  onNavigateWriteReview?: () => void;
}) {
  const business =
    BUSINESSES.find((b) => b.id === businessId) ?? BUSINESSES[0];
  const { addRecentlyViewed } = useRecentlyViewed();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare, compareList, maxItems } = useCompare();
  const toast = useDirectoryToast();

  // SEO: inject JSON-LD structured data for this business
  useBusinessJsonLd(business);

  // SEO: update document title per business
  useDocumentTitle(
    `${business.name} — ${business.category} in ${business.locality}, ${business.city} | VerifiedBusiness.in`,
  );

  // Track in recently viewed whenever the business changes
  useEffect(() => {
    if (business?.id) addRecentlyViewed(business.id);
  }, [business?.id, addRecentlyViewed]);

  const isFav = isFavorite(business.id);
  const isCompared = isInCompare(business.id);
  const compareDisabled = !isCompared && compareList.length >= maxItems;

  const handleFavorite = () => {
    const willAdd = !isFav;
    toggleFavorite(business.id);
    if (willAdd) toast.favoriteAdded(business.name);
    else toast.favoriteRemoved(business.name);
  };

  const handleCompare = () => {
    if (compareDisabled) {
      toast.compareFull(maxItems);
      return;
    }
    const willAdd = !isCompared;
    toggleCompare(business.id);
    if (willAdd) toast.compareAdded(business.name, compareList.length + 1, maxItems);
    else toast.compareRemoved(business.name);
  };

  // Related = same category or same city, excluding self
  const related = BUSINESSES.filter(
    (b) => b.id !== business.id && (b.categorySlug === business.categorySlug || b.city === business.city),
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Breadcrumbs (sticky-ish, on light surface) */}
      <div
        className="border-b border-[var(--color-border)]"
        style={{ backgroundColor: "var(--color-base)" }}
      >
        <div className="directory-container">
          <Breadcrumbs
            items={[
              { label: "India", onClick: onNavigateHome },
              { label: business.state, onClick: onNavigateHome },
              { label: business.city, onClick: onNavigateHome },
              { label: business.category, onClick: onNavigateCategory },
              { label: business.name },
            ]}
          />
        </div>
      </div>

      {/* Header */}
      <BusinessDetailHeader business={business} />

      {/* Main content */}
      <main className="flex-1 directory-container py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
          {/* ---------- LEFT: description + highlights + info ---------- */}
          <div className="min-w-0 space-y-8">
            {/* Contact actions (above the fold on desktop) */}
            <ContactActions business={business} />

            {/* Description */}
            <section>
              <h2
                className="font-display font-bold mb-3"
                style={{
                  fontSize: "var(--text-xl)",
                  letterSpacing: "-0.2px",
                  color: "var(--color-text-primary)",
                }}
              >
                About {business.name}
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-base)",
                  lineHeight: "28px",
                }}
              >
                {business.description}
              </p>
            </section>

            {/* Highlights */}
            <section>
              <h2
                className="font-display font-bold mb-3"
                style={{
                  fontSize: "var(--text-xl)",
                  letterSpacing: "-0.2px",
                  color: "var(--color-text-primary)",
                }}
              >
                What customers love
              </h2>
              <HighlightsList highlights={business.highlights} />
            </section>

            {/* Photo gallery */}
            <PhotoGallery
              businessId={business.id}
              businessName={business.name}
              photoCount={business.photos ?? 6}
            />

            {/* Info block */}
            <section>
              <h2
                className="font-display font-bold mb-3"
                style={{
                  fontSize: "var(--text-xl)",
                  letterSpacing: "-0.2px",
                  color: "var(--color-text-primary)",
                }}
              >
                Contact & hours
              </h2>
              <InfoBlock business={business} />
            </section>

            {/* Weekly hours table */}
            <section>
              <h2
                className="font-display font-bold mb-3"
                style={{
                  fontSize: "var(--text-xl)",
                  letterSpacing: "-0.2px",
                  color: "var(--color-text-primary)",
                }}
              >
                Weekly hours
              </h2>
              <WeeklyHoursTable hours={business.weeklyHours} />
            </section>

            {/* Reviews */}
            {business.reviews && business.reviews.length > 0 && (
              <section>
                <div className="flex items-end justify-between gap-4 mb-4">
                  <h2
                    className="font-display font-bold"
                    style={{
                      fontSize: "var(--text-xl)",
                      letterSpacing: "-0.2px",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    Customer reviews
                  </h2>
                  <button
                    type="button"
                    onClick={onNavigateWriteReview}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-all duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                      fontWeight: 500,
                    }}
                  >
                    <PencilLine size={14} strokeWidth={2} />
                    Write a review
                  </button>
                </div>
                {/* Rating summary */}
                <div
                  className="border border-[var(--color-border)] rounded-[10px] p-4 mb-4 flex items-center gap-6"
                  style={{ backgroundColor: "var(--color-surface-2)" }}
                >
                  <div className="text-center">
                    <p
                      className="font-display font-bold"
                      style={{
                        fontSize: "var(--text-4xl)",
                        lineHeight: "44px",
                        color: "var(--color-text-primary)",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {business.rating.toFixed(1)}
                    </p>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={12}
                          strokeWidth={2}
                          className={n <= Math.round(business.rating) ? "fill-[var(--color-warning)]" : "fill-none"}
                          style={{
                            color: n <= Math.round(business.rating) ? "var(--color-warning)" : "var(--color-border-strong)",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="mt-1"
                      style={{
                        color: "var(--color-text-tertiary)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {business.reviewCount.toLocaleString("en-IN")} reviews
                    </p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span
                            className="w-3"
                            style={{
                              color: "var(--color-text-tertiary)",
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "var(--text-xs)",
                            }}
                          >
                            {star}
                          </span>
                          <Star
                            size={10}
                            strokeWidth={2}
                            className="fill-[var(--color-warning)]"
                            style={{ color: "var(--color-warning)" }}
                          />
                          <div
                            className="flex-1 h-1.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: "var(--color-border)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: "var(--color-warning)",
                              }}
                            />
                          </div>
                          <span
                            className="w-8 text-right"
                            style={{
                              color: "var(--color-text-tertiary)",
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "var(--text-xs)",
                            }}
                          >
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Review list */}
                <div className="space-y-4">
                  {business.reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ---------- RIGHT: similar businesses + quick facts ---------- */}
          <aside className="space-y-6">
            {/* Favorite + Compare action card */}
            <div
              className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-4 flex gap-2"
            >
              <button
                type="button"
                onClick={handleFavorite}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-[8px] border transition-all duration-150"
                style={{
                  backgroundColor: isFav ? "var(--color-accent-light)" : "transparent",
                  borderColor: isFav ? "var(--color-accent-border)" : "var(--color-border-strong)",
                  color: isFav ? "var(--color-accent)" : "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                }}
              >
                <Heart
                  size={14}
                  strokeWidth={2}
                  className={isFav ? "fill-[var(--color-accent)]" : "fill-none"}
                />
                {isFav ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCompare}
                disabled={compareDisabled}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-[8px] border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isCompared ? "var(--color-accent-light)" : "transparent",
                  borderColor: isCompared ? "var(--color-accent-border)" : "var(--color-border-strong)",
                  color: isCompared ? "var(--color-accent)" : "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                }}
              >
                <GitCompare
                  size={14}
                  strokeWidth={2}
                  className={isCompared ? "fill-[var(--color-accent)]" : "fill-none"}
                />
                {isCompared ? "Added" : "Compare"}
              </button>
            </div>

            {/* Quick facts card */}
            <div
              className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface-2)] p-5"
            >
              <h3
                className="font-display font-semibold mb-3"
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--color-text-primary)",
                }}
              >
                At a glance
              </h3>
              <dl className="space-y-3">
                <FactRow label="Category" value={business.category} />
                <FactRow label="City" value={business.city} />
                <FactRow label="Locality" value={business.locality} />
                <FactRow label="Pincode" value={business.pincode} />
                <FactRow label="Years active" value={`${business.yearsActive}+ years`} />
                <FactRow label="Status" value={getOpenStatus(business.weeklyHours).label} />
              </dl>
            </div>

            {/* Map placeholder card (premium differentiator: zero orphan sections) */}
            <div
              className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-5"
            >
              <h3
                className="font-display font-semibold mb-3"
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--color-text-primary)",
                }}
              >
                Location
              </h3>
              <div
                className="aspect-[16/10] rounded-[8px] flex items-center justify-center"
                style={{
                  backgroundColor: "var(--color-surface-2)",
                  backgroundImage:
                    "linear-gradient(0deg, var(--color-surface-2) 0%, var(--color-accent-light) 100%)",
                }}
              >
                <div className="text-center">
                  <div
                    className="inline-flex items-center justify-center mx-auto mb-2"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      backgroundColor: "var(--color-accent)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </div>
                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {business.locality}, {business.city}
                  </p>
                </div>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${business.name}, ${business.address}, ${business.pincode}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--color-accent-hover)]"
                style={{
                  color: "var(--color-accent)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                }}
              >
                Open in Google Maps →
              </a>
            </div>

            {/* FAQ (compact, scoped to this business) */}
            <div>
              <h3
                className="font-display font-semibold mb-3"
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--color-text-primary)",
                }}
              >
                Common questions
              </h3>
              <FAQAccordion items={FAQS.slice(0, 3)} />
            </div>
          </aside>
        </div>

        {/* ---------- RELATED LISTINGS ---------- */}
        {related.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <h2
              className="font-display font-bold mb-6"
              style={{
                fontSize: "var(--text-2xl)",
                letterSpacing: "-0.3px",
                color: "var(--color-text-primary)",
              }}
            >
              Similar businesses nearby
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {related.map((b) => (
                <ListingCard
                  key={b.id}
                  business={b}
                  onOpen={() => onOpenBusiness?.(b.id)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ---------- MOBILE STICKY CTA BAR ---------- */}
      <div className="lg:hidden sticky bottom-0 z-40 mt-auto">
        <ContactActions business={business} variant="sticky" />
      </div>
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

/* Weekly hours table — highlights current day */
function WeeklyHoursTable({ hours }: { hours: { day: string; open: string; close: string; closed?: boolean }[] }) {
  // Compute today's day name (Mon/Tue/...)
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] overflow-hidden">
      {hours.map((h, i) => {
        const isToday = h.day === today;
        return (
          <div
            key={h.day}
            className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[var(--color-border)] last:border-b-0"
            style={{
              backgroundColor: isToday ? "var(--color-accent-light)" : "transparent",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="font-medium"
                style={{
                  color: isToday ? "var(--color-accent)" : "var(--color-text-primary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: isToday ? 600 : 500,
                }}
              >
                {h.day}
              </span>
              {isToday && (
                <span
                  className="inline-flex px-2 py-[2px] rounded-full font-medium"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-text-inverse)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  TODAY
                </span>
              )}
            </div>
            <span
              style={{
                color: h.closed ? "var(--color-text-tertiary)" : "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: h.closed ? 400 : 500,
              }}
            >
              {h.closed ? "Closed" : `${h.open} – ${h.close}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* Review card — individual user review */
function ReviewCard({ review }: { review: { id: string; author: string; initials: string; rating: number; date: string; text: string; helpful: number } }) {
  return (
    <article className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-5">
      <div className="flex items-start gap-3">
        <div
          className="inline-flex items-center justify-center shrink-0 font-display font-semibold"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            backgroundColor: "var(--color-accent-light)",
            color: "var(--color-accent)",
            fontSize: "var(--text-sm)",
          }}
        >
          {review.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <p
              className="font-medium"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-base)",
                fontWeight: 500,
              }}
            >
              {review.author}
            </p>
            <span
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              {review.date}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={12}
                strokeWidth={2}
                className={n <= review.rating ? "fill-[var(--color-warning)]" : "fill-none"}
                style={{
                  color: n <= review.rating ? "var(--color-warning)" : "var(--color-border-strong)",
                }}
              />
            ))}
          </div>
          <p
            className="mt-3"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-base)",
              lineHeight: "24px",
            }}
          >
            {review.text}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--color-accent)]"
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              Helpful ({review.helpful})
            </button>
            <button
              type="button"
              className="font-medium transition-colors hover:text-[var(--color-accent)]"
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              Share
            </button>
            <button
              type="button"
              className="font-medium transition-colors hover:text-[var(--color-accent)]"
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
              }}
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
