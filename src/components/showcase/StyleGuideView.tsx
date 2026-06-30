"use client";

import { CategoryChip, OpenBadge, UnverifiedBadge, VerifiedBadge, RatingBadge } from "@/components/directory/Badges";
import { ListingCard, ListingCardSkeleton, ListingCardEmpty } from "@/components/directory/ListingCard";
import { CategoryTile, CategoryTileSkeleton } from "@/components/directory/CategoryTile";
import { FeatureCard } from "@/components/directory/FeatureCard";
import { FAQAccordion } from "@/components/directory/FAQAccordion";
import { SearchBar } from "@/components/directory/SearchBar";
import { CATEGORIES, FAQS, FEATURES, DO_EXAMPLES, DONT_EXAMPLES, BUSINESSES } from "@/lib/directory-data";
import { Check, X, Star } from "lucide-react";

export function StyleGuideView() {
  return (
    <div className="directory-container py-8 sm:py-12">
      {/* ---------- HEADER ---------- */}
      <header className="mb-12">
        <span
          className="inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: "var(--color-accent-light)",
            color: "var(--color-accent)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          Design system
        </span>
        <h1
          className="mt-4 font-display font-bold"
          style={{
            fontSize: "clamp(var(--text-3xl), 5vw, var(--text-4xl))",
            lineHeight: "56px",
            letterSpacing: "-0.5px",
            color: "var(--color-text-primary)",
          }}
        >
          Bharat Directory — Light Mode v1.0
        </h1>
        <p
          className="mt-3 max-w-2xl"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-lg)",
            lineHeight: "28px",
          }}
        >
          Premium, trustworthy, distinctly Indian. Three words drive every
          screen: clean, confident, local. Below is the full token system,
          component library, and do/don't guidance.
        </p>
      </header>

      {/* ---------- DESIGN PHILOSOPHY ---------- */}
      <Section title="Design philosophy" id="philosophy">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { word: "CLEAN", body: "Nothing on screen that doesn't earn its place. Empty space is a feature, not waste." },
            { word: "CONFIDENT", body: "Typography and spacing so assured it needs no decoration. Borders do the heavy lifting." },
            { word: "LOCAL", body: "Built for India, not reskinned from a Western template. Warm whites, India blue, pincodes everywhere." },
          ].map((p) => (
            <div
              key={p.word}
              className="border border-[var(--color-border)] rounded-[16px] bg-[var(--color-surface)] p-5"
            >
              <p
                className="font-display font-bold"
                style={{
                  fontSize: "var(--text-xl)",
                  color: "var(--color-accent)",
                  letterSpacing: "0.5px",
                }}
              >
                {p.word}
              </p>
              <p
                className="mt-2"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "var(--text-sm)",
                  lineHeight: "20px",
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- COLOR TOKENS ---------- */}
      <Section title="Color tokens" id="colors">
        <p className="mb-6 max-w-2xl text-secondary">
          Warm whites, not cold. India blue accent for trust and authority.
          Warm shadows (rgba 26,25,23), never gray. Every value below is a CSS
          custom property available site-wide.
        </p>

        <Subsection title="Surface colors">
          <ColorSwatch name="--color-base" value="#FAFAF8" hint="Warm white — page background" />
          <ColorSwatch name="--color-surface" value="#FFFFFF" hint="Pure white — cards" />
          <ColorSwatch name="--color-surface-2" value="#F4F3F0" hint="Subtle warm gray — section bg" />
          <ColorSwatch name="--color-border" value="#E8E6E1" hint="Warm soft dividers" />
          <ColorSwatch name="--color-border-strong" value="#D0CEC9" hint="Input borders, stronger dividers" />
        </Subsection>

        <Subsection title="Text colors">
          <ColorSwatch name="--color-text-primary" value="#1A1917" hint="Near-black, warm undertone" text />
          <ColorSwatch name="--color-text-secondary" value="#5C5955" hint="Muted body text" text />
          <ColorSwatch name="--color-text-tertiary" value="#9C9894" hint="Timestamps, fine print" text />
          <ColorSwatch name="--color-text-inverse" value="#FFFFFF" hint="Text on dark backgrounds" />
        </Subsection>

        <Subsection title="Brand & accent">
          <ColorSwatch name="--color-accent" value="#1B4FD8" hint="Deep India blue — trust" />
          <ColorSwatch name="--color-accent-hover" value="#1640B0" hint="Darker on hover" />
          <ColorSwatch name="--color-accent-light" value="#EEF2FF" hint="Accent tint for badges" />
          <ColorSwatch name="--color-accent-border" value="#C7D4F8" hint="Hover border for cards" />
        </Subsection>

        <Subsection title="Status">
          <ColorSwatch name="--color-success" value="#16A34A" hint="Open, verified" />
          <ColorSwatch name="--color-success-light" value="#DCFCE7" hint="Success badge bg" />
          <ColorSwatch name="--color-warning" value="#D97706" hint="Unverified, warning" />
          <ColorSwatch name="--color-warning-light" value="#FEF3C7" hint="Warning badge bg" />
        </Subsection>

        <Subsection title="Shadows (warm, not gray)">
          <ShadowSwatch name="--shadow-xs" value="0 1px 2px rgba(26, 25, 23, 0.06)" />
          <ShadowSwatch name="--shadow-sm" value="0 2px 6px rgba(26, 25, 23, 0.08)" />
          <ShadowSwatch name="--shadow-md" value="0 4px 16px rgba(26, 25, 23, 0.10)" />
          <ShadowSwatch name="--shadow-lg" value="0 8px 32px rgba(26, 25, 23, 0.12)" />
        </Subsection>
      </Section>

      {/* ---------- TYPOGRAPHY ---------- */}
      <Section title="Typography" id="typography">
        <p className="mb-6 max-w-2xl text-secondary">
          Two fonts only. Plus Jakarta Sans (600/700) for display & headings.
          Inter (400/500) for body & UI. Letter-spacing tightened by 0.3–0.5px
          on headings ≥22px.
        </p>

        <div className="border border-[var(--color-border)] rounded-[16px] bg-[var(--color-surface)] p-6 sm:p-8 space-y-6">
          <TypeRow label="Display 4xl" font="Plus Jakarta Sans 700" size="48px / 56px">
            Find the right local business
          </TypeRow>
          <TypeRow label="Display 3xl" font="Plus Jakarta Sans 700" size="36px / 44px">
            Browse by category
          </TypeRow>
          <TypeRow label="Heading 2xl" font="Plus Jakarta Sans 700" size="28px / 36px">
            Restaurants in Bengaluru
          </TypeRow>
          <TypeRow label="Heading xl" font="Plus Jakarta Sans 700" size="22px / 30px">
            Frequently asked questions
          </TypeRow>
          <TypeRow label="Card title lg" font="Plus Jakarta Sans 600" size="18px / 28px">
            Sankalp South Indian Restaurant
          </TypeRow>
          <TypeRow label="Body base" font="Inter 400" size="16px / 24px">
            Verified listings across all 28 states and 780+ districts.
          </TypeRow>
          <TypeRow label="Meta sm" font="Inter 400" size="14px / 20px">
            Whitefield, Bengaluru — 560048
          </TypeRow>
          <TypeRow label="Fine print xs" font="Inter 400" size="12px / 16px">
            Last updated 14 days ago
          </TypeRow>
        </div>
      </Section>

      {/* ---------- SPACING ---------- */}
      <Section title="Spacing & layout" id="spacing">
        <p className="mb-6 max-w-2xl text-secondary">
          Base unit 4px. Every spacing value is a multiple of 4. Content
          max-width 1200px, 24px horizontal padding on mobile (16px below sm).
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: "--space-1", value: 4 },
            { name: "--space-2", value: 8 },
            { name: "--space-3", value: 12 },
            { name: "--space-4", value: 16 },
            { name: "--space-5", value: 20 },
            { name: "--space-6", value: 24 },
            { name: "--space-8", value: 32 },
            { name: "--space-10", value: 40 },
            { name: "--space-12", value: 48 },
            { name: "--space-16", value: 64 },
          ].map((s) => (
            <div
              key={s.name}
              className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-3"
            >
              <div
                className="rounded-[4px]"
                style={{
                  width: s.value,
                  height: s.value,
                  backgroundColor: "var(--color-accent)",
                }}
              />
              <p
                className="mt-2 font-mono"
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "var(--text-xs)",
                }}
              >
                {s.name}
              </p>
              <p
                style={{
                  color: "var(--color-text-tertiary)",
                  fontSize: "var(--text-xs)",
                }}
              >
                {s.value}px
              </p>
            </div>
          ))}
        </div>

        <Subsection title="Border radius">
          <div className="flex flex-wrap gap-4">
            {[
              { name: "radius-sm", value: "6px" },
              { name: "radius-md", value: "10px" },
              { name: "radius-lg", value: "16px" },
              { name: "radius-full", value: "999px" },
            ].map((r) => (
              <div
                key={r.name}
                className="border border-[var(--color-border)] p-3"
                style={{ borderRadius: r.value, backgroundColor: "var(--color-surface)" }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "var(--color-accent-light)",
                    border: "1.5px solid var(--color-accent-border)",
                    borderRadius: r.value,
                  }}
                />
                <p
                  className="mt-2 font-mono"
                  style={{
                    color: "var(--color-text-primary)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {r.name}
                </p>
                <p
                  style={{
                    color: "var(--color-text-tertiary)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {r.value}
                </p>
              </div>
            ))}
          </div>
        </Subsection>
      </Section>

      {/* ---------- COMPONENTS ---------- */}
      <Section title="Components" id="components">
        <p className="mb-6 max-w-2xl text-secondary">
          Every component uses 1px border as primary boundary. Shadow is reserved
          for hover and elevated states. Skeletons shimmer 1.5s infinite. Empty
          states have intentional copy — never "Not available".
        </p>

        {/* Badges */}
        <Subsection title="Badges & status chips">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryChip label="Restaurants" />
            <CategoryChip label="Doctors" variant="compact" />
            <OpenBadge open={true} />
            <OpenBadge open={false} />
            <VerifiedBadge />
            <UnverifiedBadge />
            <RatingBadge rating={4.6} reviewCount={2841} />
          </div>
        </Subsection>

        {/* Search bar */}
        <Subsection title="Search bar (hero)">
          <SearchBar />
        </Subsection>

        {/* Category tile */}
        <Subsection title="Category tiles">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            <CategoryTile category={CATEGORIES[0]} />
            <CategoryTile category={CATEGORIES[1]} />
            <CategoryTileSkeleton />
            <CategoryTileSkeleton />
          </div>
        </Subsection>

        {/* Listing card */}
        <Subsection title="Listing card (with skeleton + empty states)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <ListingCard business={useBusiness(0)} />
            <ListingCard business={useBusiness(5)} />
            <ListingCardSkeleton />
            <ListingCardEmpty query="pizza" />
          </div>
        </Subsection>

        {/* Feature card */}
        <Subsection title="Feature card (2-col grid)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {FEATURES.slice(0, 2).map((f) => (
              <FeatureCard
                key={f.id}
                icon={f.icon}
                title={f.title}
                description={f.description}
              />
            ))}
          </div>
        </Subsection>

        {/* FAQ accordion */}
        <Subsection title="FAQ accordion">
          <FAQAccordion items={FAQS.slice(0, 3)} />
        </Subsection>

        {/* Stars / ratings */}
        <Subsection title="Rating display">
          <div className="flex items-center gap-4">
            {[
              { r: 4.7, c: 6450 },
              { r: 4.4, c: 1820 },
              { r: 3.9, c: 320 },
            ].map((x) => (
              <span key={x.r} className="inline-flex items-center gap-1">
                <Star size={16} strokeWidth={2.2} className="fill-[var(--color-warning)]" style={{ color: "var(--color-warning)" }} />
                <RatingBadge rating={x.r} reviewCount={x.c} />
              </span>
            ))}
          </div>
        </Subsection>
      </Section>

      {/* ---------- DO / DON'T ---------- */}
      <Section title="Do & don't" id="do-dont">
        <p className="mb-6 max-w-2xl text-secondary">
          The 8 premium differentiators — and the patterns that make directories
          look cheap. These rules are non-negotiable for any new screen.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* DO */}
          <div
            className="border rounded-[16px] p-5 sm:p-6"
            style={{
              backgroundColor: "var(--color-success-light)",
              borderColor: "var(--color-success)",
              borderLeftWidth: 4,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  backgroundColor: "var(--color-success)",
                }}
              >
                <Check size={14} strokeWidth={3} color="#FFFFFF" />
              </span>
              <h3
                className="font-display font-bold"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--color-text-primary)",
                }}
              >
                Do
              </h3>
            </div>
            <ul className="space-y-3">
              {DO_EXAMPLES.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    strokeWidth={2.5}
                    className="mt-0.5 shrink-0"
                    style={{ color: "var(--color-success)" }}
                  />
                  <span
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                      lineHeight: "20px",
                    }}
                  >
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* DON'T */}
          <div
            className="border rounded-[16px] p-5 sm:p-6"
            style={{
              backgroundColor: "var(--color-warning-light)",
              borderColor: "var(--color-warning)",
              borderLeftWidth: 4,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  backgroundColor: "var(--color-warning)",
                }}
              >
                <X size={14} strokeWidth={3} color="#FFFFFF" />
              </span>
              <h3
                className="font-display font-bold"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--color-text-primary)",
                }}
              >
                Don't
              </h3>
            </div>
            <ul className="space-y-3">
              {DONT_EXAMPLES.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <X
                    size={16}
                    strokeWidth={2.5}
                    className="mt-0.5 shrink-0"
                    style={{ color: "var(--color-warning)" }}
                  />
                  <span
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "var(--text-sm)",
                      lineHeight: "20px",
                    }}
                  >
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------- MOTION ---------- */}
      <Section title="Motion principles" id="motion">
        <p className="mb-6 max-w-2xl text-secondary">
          Less is more. Animation serves function, not decoration. Every animation
          must respect <code className="font-mono text-[var(--color-accent)]">prefers-reduced-motion: reduce</code> — non-negotiable.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MotionCard
            title="Allowed"
            color="success"
            items={[
              "Card hover: border + shadow, 200ms ease",
              "Button hover: background color shift, 150ms ease",
              "FAQ accordion: height expand, 250ms ease-out",
              "Icon hover: scale(1.08), 200ms ease",
              "Skeleton shimmer: 1.5s infinite",
            ]}
          />
          <MotionCard
            title="Forbidden"
            color="warning"
            items={[
              "Entrance animations on listing cards",
              "Scroll-triggered content animations",
              "Parallax effects",
              "Auto-playing carousels",
              "Spinning loaders (use skeletons)",
              "Any animation longer than 400ms",
            ]}
          />
        </div>
      </Section>
    </div>
  );
}

/* ---------- helpers ---------- */
function useBusiness(idx: number) {
  return BUSINESSES[idx];
}

/* ---------- style guide sub-components ---------- */
function Section({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-16 sm:mt-20 scroll-mt-24">
      <h2
        className="font-display font-bold mb-2"
        style={{
          fontSize: "var(--text-3xl)",
          lineHeight: "44px",
          letterSpacing: "-0.3px",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <h3
        className="mb-4 font-display font-semibold"
        style={{
          fontSize: "var(--text-lg)",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function ColorSwatch({
  name,
  value,
  hint,
  text = false,
}: {
  name: string;
  value: string;
  hint: string;
  text?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-3">
      <div
        className="shrink-0"
        style={{
          width: 56,
          height: 56,
          backgroundColor: value,
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          color: text ? value : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {text && (
          <span
            style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: value,
              mixBlendMode: "normal",
              filter: "invert(1)",
            }}
          >
            Aa
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p
          className="font-mono truncate"
          style={{
            color: "var(--color-text-primary)",
            fontSize: "var(--text-xs)",
          }}
        >
          {name}
        </p>
        <p
          className="font-mono"
          style={{
            color: "var(--color-text-tertiary)",
            fontSize: "var(--text-xs)",
          }}
        >
          {value}
        </p>
        <p
          className="mt-1 truncate"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "var(--text-xs)",
          }}
        >
          {hint}
        </p>
      </div>
    </div>
  );
}

function ShadowSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="border border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface)] p-3">
      <div
        className="mx-auto"
        style={{
          width: 80,
          height: 40,
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          boxShadow: value,
        }}
      />
      <p
        className="mt-3 font-mono"
        style={{
          color: "var(--color-text-primary)",
          fontSize: "var(--text-xs)",
        }}
      >
        {name}
      </p>
      <p
        className="font-mono break-all"
        style={{
          color: "var(--color-text-tertiary)",
          fontSize: "var(--text-xs)",
          lineHeight: "16px",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function TypeRow({
  label,
  font,
  size,
  children,
}: {
  label: string;
  font: string;
  size: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-b border-[var(--color-border)] last:border-b-0 pb-4 last:pb-0">
      <div className="sm:w-56 shrink-0">
        <p
          className="font-mono"
          style={{
            color: "var(--color-text-primary)",
            fontSize: "var(--text-xs)",
          }}
        >
          {label}
        </p>
        <p
          className="font-mono"
          style={{
            color: "var(--color-text-tertiary)",
            fontSize: "var(--text-xs)",
          }}
        >
          {font} · {size}
        </p>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function MotionCard({
  title,
  color,
  items,
}: {
  title: string;
  color: "success" | "warning";
  items: string[];
}) {
  const c = color === "success" ? "var(--color-success)" : "var(--color-warning)";
  const bg = color === "success" ? "var(--color-success-light)" : "var(--color-warning-light)";
  return (
    <div
      className="border rounded-[16px] p-5"
      style={{
        backgroundColor: bg,
        borderColor: c,
        borderLeftWidth: 4,
      }}
    >
      <h3
        className="font-display font-bold mb-3"
        style={{
          fontSize: "var(--text-lg)",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li
            key={i}
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "var(--text-sm)",
              lineHeight: "20px",
            }}
          >
            · {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Tiny inline icon used by some swatches
// (kept file free of unused imports)
