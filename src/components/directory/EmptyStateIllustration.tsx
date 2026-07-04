"use client";

import { cn } from "@/lib/utils";

/**
 * EmptyStateIllustration — premium inline SVG illustrations for empty states.
 *
 * Spec alignment (premium differentiator #7: zero orphan sections):
 *  Every null state gets thoughtful copy AND a distinctive illustration.
 *  No generic "no data" text. No broken-image icons.
 *
 * Each illustration uses the accent blue (#1B4FD8) and warm tones from the
 * design system. They are lightweight (no external requests), deterministic,
 * and respect prefers-reduced-motion (no animation).
 */

type IllustrationType =
  | "no-results"
  | "no-favorites"
  | "no-compare"
  | "no-recently-viewed"
  | "no-businesses"
  | "error"
  | "success"
  | "empty-cart"
  | "no-notifications"
  | "no-reviews";

export function EmptyStateIllustration({
  type,
  size = 120,
  className,
}: {
  type: IllustrationType;
  size?: number;
  className?: string;
}) {
  const illustrations: Record<IllustrationType, JSX.Element> = {
    "no-results": <NoResultsIllustration size={size} />,
    "no-favorites": <NoFavoritesIllustration size={size} />,
    "no-compare": <NoCompareIllustration size={size} />,
    "no-recently-viewed": <NoRecentlyViewedIllustration size={size} />,
    "no-businesses": <NoBusinessesIllustration size={size} />,
    error: <ErrorIllustration size={size} />,
    success: <SuccessIllustration size={size} />,
    "empty-cart": <EmptyCartIllustration size={size} />,
    "no-notifications": <NoNotificationsIllustration size={size} />,
    "no-reviews": <NoReviewsIllustration size={size} />,
  };

  return (
    <div
      className={cn("inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {illustrations[type]}
    </div>
  );
}

/* ---------------- Individual illustrations ---------------- */

function NoResultsIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Search circle */}
      <circle cx="48" cy="48" r="28" stroke="var(--color-accent)" strokeWidth="3" fill="var(--color-accent-light)" />
      {/* Magnifier handle */}
      <line x1="68" y1="68" x2="88" y2="88" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" />
      {/* Question mark inside */}
      <path
        d="M44 38 Q48 34 52 38 Q56 42 52 46 L48 50 L48 56"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="48" cy="62" r="2" fill="var(--color-accent)" />
      {/* Decorative dots */}
      <circle cx="20" cy="30" r="2" fill="var(--color-border-strong)" />
      <circle cx="100" cy="40" r="2.5" fill="var(--color-border-strong)" />
      <circle cx="24" cy="92" r="2" fill="var(--color-border-strong)" />
      <circle cx="96" cy="100" r="2" fill="var(--color-border-strong)" />
    </svg>
  );
}

function NoFavoritesIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Heart outline */}
      <path
        d="M60 100 C60 100, 20 75, 20 50 C20 35, 32 25, 45 25 C52 25, 58 30, 60 35 C62 30, 68 25, 75 25 C88 25, 100 35, 100 50 C100 75, 60 100, 60 100 Z"
        stroke="var(--color-accent)"
        strokeWidth="3"
        fill="var(--color-accent-light)"
        strokeLinejoin="round"
      />
      {/* Plus icon inside */}
      <line x1="60" y1="45" x2="60" y2="60" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      <line x1="52.5" y1="52.5" x2="67.5" y2="52.5" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      {/* Sparkles */}
      <circle cx="18" cy="22" r="2" fill="var(--color-warning)" />
      <circle cx="102" cy="30" r="2.5" fill="var(--color-warning)" />
      <circle cx="100" cy="92" r="2" fill="var(--color-warning)" />
    </svg>
  );
}

function NoCompareIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left card */}
      <rect x="18" y="28" width="32" height="48" rx="4" stroke="var(--color-accent)" strokeWidth="2.5" fill="var(--color-surface)" />
      <line x1="24" y1="40" x2="44" y2="40" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="48" x2="40" y2="48" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="56" x2="42" y2="56" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="64" x2="38" y2="64" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round" />
      {/* Right card */}
      <rect x="70" y="28" width="32" height="48" rx="4" stroke="var(--color-accent)" strokeWidth="2.5" fill="var(--color-surface)" />
      <line x1="76" y1="40" x2="96" y2="40" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <line x1="76" y1="48" x2="92" y2="48" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round" />
      <line x1="76" y1="56" x2="94" y2="56" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round" />
      <line x1="76" y1="64" x2="90" y2="64" stroke="var(--color-border-strong)" strokeWidth="2" strokeLinecap="round" />
      {/* VS in middle */}
      <circle cx="60" cy="52" r="14" fill="var(--color-accent)" />
      <text
        x="60"
        y="56"
        textAnchor="middle"
        fontFamily="var(--font-jakarta), sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="#FFFFFF"
      >
        VS
      </text>
      {/* Arrows */}
      <path d="M55 90 L50 95 L55 100" stroke="var(--color-accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M65 90 L70 95 L65 100" stroke="var(--color-accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NoRecentlyViewedIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clock circle */}
      <circle cx="60" cy="60" r="32" stroke="var(--color-accent)" strokeWidth="3" fill="var(--color-accent-light)" />
      {/* Clock hands */}
      <line x1="60" y1="60" x2="60" y2="42" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="60" x2="74" y2="60" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="60" r="2.5" fill="var(--color-accent)" />
      {/* Tick marks */}
      <line x1="60" y1="32" x2="60" y2="36" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="60" x2="84" y2="60" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="88" x2="60" y2="84" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="60" x2="36" y2="60" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      {/* Backwards arrow */}
      <path
        d="M22 30 A 40 40 0 0 0 14 50"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M18 28 L22 30 L24 34" stroke="var(--color-accent)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NoBusinessesIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Storefront */}
      <path d="M24 40 L30 24 L90 24 L96 40 L96 50 L24 50 Z" stroke="var(--color-accent)" strokeWidth="2.5" fill="var(--color-accent-light)" strokeLinejoin="round" />
      {/* Awning stripes */}
      <line x1="36" y1="40" x2="36" y2="50" stroke="var(--color-accent)" strokeWidth="1.5" />
      <line x1="48" y1="40" x2="48" y2="50" stroke="var(--color-accent)" strokeWidth="1.5" />
      <line x1="60" y1="40" x2="60" y2="50" stroke="var(--color-accent)" strokeWidth="1.5" />
      <line x1="72" y1="40" x2="72" y2="50" stroke="var(--color-accent)" strokeWidth="1.5" />
      <line x1="84" y1="40" x2="84" y2="50" stroke="var(--color-accent)" strokeWidth="1.5" />
      {/* Building body */}
      <rect x="30" y="50" width="60" height="44" stroke="var(--color-accent)" strokeWidth="2.5" fill="var(--color-surface)" />
      {/* Door */}
      <rect x="54" y="70" width="12" height="24" stroke="var(--color-accent)" strokeWidth="2" fill="var(--color-accent-light)" />
      {/* Windows */}
      <rect x="38" y="60" width="10" height="8" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
      <rect x="72" y="60" width="10" height="8" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
      {/* Closed sign */}
      <line x1="20" y1="20" x2="100" y2="100" stroke="var(--color-warning)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function ErrorIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Triangle */}
      <path
        d="M60 18 L102 92 L18 92 Z"
        stroke="var(--color-warning)"
        strokeWidth="3"
        fill="var(--color-warning-light)"
        strokeLinejoin="round"
      />
      {/* Exclamation */}
      <line x1="60" y1="44" x2="60" y2="68" stroke="var(--color-warning)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="80" r="3" fill="var(--color-warning)" />
    </svg>
  );
}

function SuccessIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle */}
      <circle cx="60" cy="60" r="36" stroke="var(--color-success)" strokeWidth="3" fill="var(--color-success-light)" />
      {/* Checkmark */}
      <path
        d="M44 60 L56 72 L78 48"
        stroke="var(--color-success)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Sparkles */}
      <circle cx="22" cy="30" r="2" fill="var(--color-success)" />
      <circle cx="98" cy="36" r="2.5" fill="var(--color-success)" />
      <circle cx="96" cy="92" r="2" fill="var(--color-success)" />
    </svg>
  );
}

function EmptyCartIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cart handle */}
      <path d="M24 30 L32 30 L42 78 L92 78" stroke="var(--color-accent)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Cart body */}
      <path d="M38 42 L100 42 L92 72 L48 72 Z" stroke="var(--color-accent)" strokeWidth="2.5" fill="var(--color-accent-light)" strokeLinejoin="round" />
      {/* Wheels */}
      <circle cx="52" cy="88" r="5" stroke="var(--color-accent)" strokeWidth="2.5" fill="var(--color-surface)" />
      <circle cx="84" cy="88" r="5" stroke="var(--color-accent)" strokeWidth="2.5" fill="var(--color-surface)" />
      <circle cx="52" cy="88" r="1.5" fill="var(--color-accent)" />
      <circle cx="84" cy="88" r="1.5" fill="var(--color-accent)" />
    </svg>
  );
}

function NoNotificationsIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bell */}
      <path
        d="M60 22 C44 22 36 34 36 50 L36 70 L28 82 L92 82 L84 70 L84 50 C84 34 76 22 60 22 Z"
        stroke="var(--color-accent)"
        strokeWidth="3"
        fill="var(--color-accent-light)"
        strokeLinejoin="round"
      />
      {/* Clapper */}
      <path d="M52 82 C52 88 56 92 60 92 C64 92 68 88 68 82" stroke="var(--color-accent)" strokeWidth="2.5" fill="none" />
      {/* Z's (sleeping) */}
      <text x="84" y="38" fontFamily="var(--font-jakarta), sans-serif" fontSize="14" fontWeight="700" fill="var(--color-text-tertiary)">z</text>
      <text x="92" y="28" fontFamily="var(--font-jakarta), sans-serif" fontSize="10" fontWeight="700" fill="var(--color-text-tertiary)">z</text>
    </svg>
  );
}

function NoReviewsIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Speech bubble */}
      <path
        d="M24 30 C24 24 28 20 34 20 L86 20 C92 20 96 24 96 30 L96 64 C96 70 92 74 86 74 L52 74 L38 88 L40 74 L34 74 C28 74 24 70 24 64 Z"
        stroke="var(--color-accent)"
        strokeWidth="3"
        fill="var(--color-accent-light)"
        strokeLinejoin="round"
      />
      {/* Stars (empty) */}
      {[36, 50, 64, 78].map((x) => (
        <path
          key={x}
          d={`${x} 38 L${x + 2.4} 43.4 L${x + 8.4} 43.4 L${x + 3.6} 47 L${x + 5.4} 53 L${x} 49 L${x - 5.4} 53 L${x - 3.6} 47 L${x - 8.4} 43.4 L${x - 2.4} 43.4 Z`}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          fill="none"
        />
      ))}
      {/* Pencil */}
      <line x1="84" y1="84" x2="100" y2="100" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M82 82 L86 86 L98 98 L102 102 L98 102 L82 86 Z" stroke="var(--color-accent)" strokeWidth="2" fill="var(--color-surface)" strokeLinejoin="round" />
    </svg>
  );
}
