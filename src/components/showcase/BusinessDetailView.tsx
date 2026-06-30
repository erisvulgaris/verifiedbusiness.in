"use client";

import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import {
  BusinessDetailHeader,
  ContactActions,
  InfoBlock,
  HighlightsList,
} from "@/components/directory/BusinessDetail";
import { ListingCard } from "@/components/directory/ListingCard";
import { FAQAccordion } from "@/components/directory/FAQAccordion";
import { BUSINESSES, FAQS } from "@/lib/directory-data";

export function BusinessDetailView({
  businessId,
  onNavigateHome,
  onNavigateCategory,
  onOpenBusiness,
}: {
  businessId?: string;
  onNavigateHome?: () => void;
  onNavigateCategory?: () => void;
  onOpenBusiness?: (id: string) => void;
}) {
  const business =
    BUSINESSES.find((b) => b.id === businessId) ?? BUSINESSES[0];

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
          </div>

          {/* ---------- RIGHT: similar businesses + quick facts ---------- */}
          <aside className="space-y-6">
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
                <FactRow label="Status" value={business.openNow ? "Open now" : "Closed"} />
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
