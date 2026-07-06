"use client";

import { SearchBar } from "@/components/directory/SearchBar";
import { CategoryTile } from "@/components/directory/CategoryTile";
import { FeatureCard } from "@/components/directory/FeatureCard";
import { FAQAccordion } from "@/components/directory/FAQAccordion";
import { ListingCard } from "@/components/directory/ListingCard";
import { Breadcrumbs } from "@/components/directory/Breadcrumbs";
import {
  CATEGORIES,
  FAQS,
  FEATURES,
  HERO_STATS,
  BUSINESSES,
} from "@/lib/directory-data";
import { Sparkles, ArrowRight, TrendingUp, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { SPRING, AnimatedNumber, StaggerContainer, StaggerItem, FadeInOnScroll } from "./animations";
import { useRecentlyViewed } from "./RecentlyViewedContext";
import { useDocumentTitle } from "./SeoStructuredData";

export function HomepageView({
  onNavigate,
  onOpenBusiness,
  onSearch,
  onViewAllCategories,
  onViewLocations,
  onSelectCategory,
}: {
  onNavigate?: (view: "category" | "detail") => void;
  onOpenBusiness?: (id: string) => void;
  onSearch?: (q: { query: string; location: string }) => void;
  onViewAllCategories?: () => void;
  onViewLocations?: () => void;
  onSelectCategory?: (slug: string) => void;
}) {
  const { recentlyViewed } = useRecentlyViewed();
  useDocumentTitle("VerifiedBusiness.in — Premium Local Business Directory for India");
  const recentlyViewedBusinesses = recentlyViewed
    .map((id) => BUSINESSES.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .slice(0, 3);

  return (
    <div className="directory-container py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "India", onClick: () => onNavigate?.("category") },
          { label: "Home" },
        ]}
      />

      {/* ---------- HERO ---------- */}
      <section className="mt-6 sm:mt-8 aurora-bg relative">
        <div className="max-w-3xl relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING.snappy, delay: 0.05 }}
            className="inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: "var(--color-accent-light)",
              color: "var(--color-accent)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
              border: "1px solid var(--color-accent-border)",
            }}
          >
            <Sparkles size={12} strokeWidth={2.5} />
            India's premium business directory
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING.gentle, delay: 0.1 }}
            className="mt-4 font-display font-bold leading-[1.05]"
            style={{
              fontSize: "clamp(var(--text-3xl), 6vw, var(--text-4xl))",
              letterSpacing: "-0.5px",
              color: "var(--color-text-primary)",
            }}
          >
            Find the right local business,{" "}
            <span className="gradient-text">anywhere in India.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING.gentle, delay: 0.18 }}
            className="mt-4 max-w-2xl"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-lg)",
              lineHeight: "28px",
            }}
          >
            Verified listings across all 28 states, 780+ districts, and 19,000+
            pincodes. Clean, confident, and built for India — not reskinned from
            a Western template.
          </motion.p>
        </div>

        {/* Search bar */}
        <div className="mt-6 sm:mt-8">
          <SearchBar onSearch={onSearch ?? (() => onNavigate?.("category"))} />
        </div>

        {/* Quick location shortcut */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            Popular:
          </span>
          {["Bengaluru", "Mumbai", "Delhi", "Pune", "Hyderabad", "Chennai"].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onSearch?.({ query: "", location: city })}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <MapPin size={10} strokeWidth={2.5} />
              {city}
            </button>
          ))}
        </div>

        {/* Hero stats */}
        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {HERO_STATS.map((stat, i) => {
            // Parse numeric value for animation (e.g., "1.2 Cr+" → 1.2, "4,000+" → 4000)
            const numericMatch = stat.value.match(/[\d.]+/);
            const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
            const suffix = stat.value.replace(/[\d.]+/, "");
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING.gentle, delay: 0.3 + i * 0.08 }}
                className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-4 shadow-lift"
              >
                <dt
                  style={{
                    color: "var(--color-text-tertiary)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "var(--text-xs)",
                    lineHeight: "16px",
                    marginBottom: 6,
                  }}
                >
                  {stat.label}
                </dt>
                <dd
                  className="font-display font-bold"
                  style={{
                    color: "var(--color-text-primary)",
                    fontSize: "var(--text-2xl)",
                    lineHeight: "32px",
                    letterSpacing: "-0.3px",
                  }}
                >
                  <AnimatedNumber value={numericValue} format={(n) => {
                    const formatted = numericValue < 10 ? n.toFixed(1) : Math.round(n).toLocaleString("en-IN");
                    return formatted + suffix;
                  }} />
                </dd>
              </motion.div>
            );
          })}
        </dl>
      </section>

      {/* ---------- CATEGORIES ---------- */}
      <section className="mt-16 sm:mt-20">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2
              className="font-display font-bold"
              style={{
                fontSize: "var(--text-3xl)",
                lineHeight: "44px",
                letterSpacing: "-0.3px",
                color: "var(--color-text-primary)",
              }}
            >
              Browse by category
            </h2>
            <p
              className="mt-1"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-base)",
                lineHeight: "24px",
              }}
            >
              From your neighbourhood restaurant to a 24/7 hospital — start here.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onViewAllCategories?.()}
            className="hidden sm:inline-flex items-center gap-1 font-medium transition-colors hover:text-[var(--color-accent-hover)]"
            style={{
              color: "var(--color-accent)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
            }}
          >
            View all
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" staggerChildren={0.04}>
          {CATEGORIES.slice(0, 8).map((cat) => (
            <StaggerItem key={cat.id}>
              <CategoryTile
                category={cat}
                onClick={() => onSelectCategory?.(cat.slug) ?? onNavigate?.("category")}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ---------- RECENTLY VIEWED (only if present) ---------- */}
      {recentlyViewedBusinesses.length > 0 && (
        <section className="mt-16 sm:mt-20">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2
                className="font-display font-bold"
                style={{
                  fontSize: "var(--text-3xl)",
                  lineHeight: "44px",
                  letterSpacing: "-0.3px",
                  color: "var(--color-text-primary)",
                }}
              >
                Recently viewed
              </h2>
              <p
                className="mt-1"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-base)",
                  lineHeight: "24px",
                }}
              >
                Pick up where you left off.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {recentlyViewedBusinesses.map((b) => (
              <ListingCard
                key={b.id}
                business={b}
                onOpen={() => onOpenBusiness?.(b.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ---------- BROWSE BY LOCATION ---------- */}
      <section className="mt-16 sm:mt-20">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2
              className="font-display font-bold"
              style={{
                fontSize: "var(--text-3xl)",
                lineHeight: "44px",
                letterSpacing: "-0.3px",
                color: "var(--color-text-primary)",
              }}
            >
              Browse by location
            </h2>
            <p
              className="mt-1"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-base)",
                lineHeight: "24px",
              }}
            >
              28 states, 8 UTs, 780+ districts, 4,000+ cities, 19,000+ pincodes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onViewLocations?.()}
            className="hidden sm:inline-flex items-center gap-1 font-medium transition-colors hover:text-[var(--color-accent-hover)]"
            style={{
              color: "var(--color-accent)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
            }}
          >
            All states
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Bengaluru", state: "Karnataka" },
            { name: "Mumbai", state: "Maharashtra" },
            { name: "New Delhi", state: "Delhi" },
            { name: "Chennai", state: "Tamil Nadu" },
            { name: "Hyderabad", state: "Telangana" },
            { name: "Kolkata", state: "West Bengal" },
          ].map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => onSearch?.({ query: "", location: city.name })}
              className="group flex flex-col items-start gap-2 border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-4 transition-all duration-200 hover:border-[var(--color-accent-border)] hover:shadow-[var(--shadow-sm)]"
            >
              <div
                className="flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.08]"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--color-accent-light)",
                }}
              >
                <MapPin size={18} strokeWidth={2} style={{ color: "var(--color-accent)" }} />
              </div>
              <p
                className="font-medium"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                }}
              >
                {city.name}
              </p>
              <p
                style={{
                  color: "var(--color-text-tertiary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-xs)",
                }}
              >
                {city.state}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- WHY US (FEATURE CARDS) ---------- */}
      <section className="mt-16 sm:mt-20">
        <h2
          className="font-display font-bold"
          style={{
            fontSize: "var(--text-3xl)",
            lineHeight: "44px",
            letterSpacing: "-0.3px",
            color: "var(--color-text-primary)",
          }}
        >
          Built for trust at national scale
        </h2>
        <p
          className="mt-1 mb-6 max-w-2xl"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-base)",
            lineHeight: "24px",
          }}
        >
          Every decision — from the warm white background to the 90-day
          re-verification cycle — is engineered so you can act with confidence.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <FeatureCard
              key={f.id}
              icon={f.icon}
              title={f.title}
              description={f.description}
            />
          ))}
        </div>
      </section>

      {/* ---------- FEATURED LISTINGS ---------- */}
      <section className="mt-16 sm:mt-20">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2
              className="font-display font-bold"
              style={{
                fontSize: "var(--text-3xl)",
                lineHeight: "44px",
                letterSpacing: "-0.3px",
                color: "var(--color-text-primary)",
              }}
            >
              Featured this week
            </h2>
            <p
              className="mt-1"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-base)",
                lineHeight: "24px",
              }}
            >
              Hand-picked verified businesses users are searching for right now.
            </p>
          </div>
          <span
            className="hidden sm:inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: "var(--color-success-light)",
              color: "var(--color-success)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-xs)",
            }}
          >
            <TrendingUp size={12} strokeWidth={2.5} />
            Trending
          </span>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" staggerChildren={0.06}>
          {BUSINESSES.slice(0, 4).map((b) => (
            <StaggerItem key={b.id}>
              <ListingCard
                business={b}
                onOpen={() => onOpenBusiness?.(b.id)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mt-16 sm:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <h2
              className="font-display font-bold"
              style={{
                fontSize: "var(--text-3xl)",
                lineHeight: "44px",
                letterSpacing: "-0.3px",
                color: "var(--color-text-primary)",
              }}
            >
              Frequently asked
            </h2>
            <p
              className="mt-2"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-base)",
                lineHeight: "24px",
              }}
            >
              Everything you need to know about how listings, verification, and
              coverage work on VerifiedBusiness.in.
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--color-accent-hover)]"
              style={{
                color: "var(--color-accent)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-sm)",
              }}
            >
              Contact support
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
          <div className="lg:col-span-2">
            <FAQAccordion items={FAQS} />
          </div>
        </div>
      </section>

      {/* ---------- CTA STRIP ---------- */}
      <section className="mt-16 sm:mt-20">
        <FadeInOnScroll>
        <div
          className="border rounded-[16px] p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mesh-gradient glow-accent"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div>
            <h3
              className="font-display font-bold"
              style={{
                fontSize: "var(--text-2xl)",
                lineHeight: "36px",
                letterSpacing: "-0.3px",
                color: "var(--color-text-primary)",
              }}
            >
              List your business for free
            </h3>
            <p
              className="mt-2 max-w-xl"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "var(--text-base)",
                lineHeight: "24px",
              }}
            >
              Reach over 50 million monthly searchers. Submit your GST number and
              get verified within 3–5 business days.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 shrink-0 transition-all duration-150 hover:shadow-[var(--shadow-md)] glow-accent glow-accent-hover"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-inverse)",
              fontFamily: "var(--font-jakarta), sans-serif",
              fontWeight: 600,
              fontSize: "var(--text-base)",
              lineHeight: "20px",
              borderRadius: "var(--radius-md)",
              padding: "14px 24px",
            }}
          >
            Get started
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
        </FadeInOnScroll>
      </section>
    </div>
  );
}
