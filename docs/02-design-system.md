# 02 — Design System

## Three Words

Every screen must be: **CLEAN · CONFIDENT · LOCAL**

- CLEAN → nothing on screen that doesn't earn its place
- CONFIDENT → typography and spacing so assured it needs no decoration
- LOCAL → built for India, not reskinned from a Western template

## Color Tokens (exact — no substitutions)

| Token | Value | Use |
|-------|-------|-----|
| `--color-base` | `#FAFAF8` | Page background (warm white, NOT pure #FFFFFF) |
| `--color-surface` | `#FFFFFF` | Cards |
| `--color-surface-2` | `#F4F3F0` | Section backgrounds, subtle warm gray |
| `--color-border` | `#E8E6E1` | Soft dividers |
| `--color-border-strong` | `#D0CEC9` | Input borders, stronger dividers |
| `--color-text-primary` | `#1A1917` | Headings, body (near-black, warm) |
| `--color-text-secondary` | `#5C5955` | Muted body, metadata |
| `--color-text-tertiary` | `#9C9894` | Timestamps, fine print |
| `--color-accent` | `#1B4FD8` | Deep India blue — trust, authority |
| `--color-accent-hover` | `#1640B0` | Darker on hover |
| `--color-accent-light` | `#EEF2FF` | Badge backgrounds, tints |
| `--color-accent-border` | `#C7D4F8` | Hover border on cards |
| `--color-success` | `#16A34A` | Verified, open |
| `--color-success-light` | `#DCFCE7` | Success badge bg |
| `--color-warning` | `#D97706` | Unverified, warning |
| `--color-warning-light` | `#FEF3C7` | Warning badge bg |

## Shadows (warm, NOT gray)

| Token | Value |
|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(26, 25, 23, 0.06)` |
| `--shadow-sm` | `0 2px 6px rgba(26, 25, 23, 0.08)` |
| `--shadow-md` | `0 4px 16px rgba(26, 25, 23, 0.10)` |
| `--shadow-lg` | `0 8px 32px rgba(26, 25, 23, 0.12)` |

**Never use `rgba(0, 0, 0, X)` — looks cheap.**

## Typography

Two fonts only. Loaded via `next/font` in `src/app/layout.tsx`.

| Font | Weights | Use |
|------|---------|-----|
| Plus Jakarta Sans | 600, 700 | Display, headings, CTA labels |
| Inter | 400, 500 | Body, UI, metadata |

### Type Scale (use exactly these — no arbitrary sizes)

| Token | Size / Line-height | Use |
|-------|--------------------|-----|
| `--text-xs` | 12px / 16px | Timestamps, fine print |
| `--text-sm` | 14px / 20px | Metadata, chips |
| `--text-base` | 16px / 24px | Body, addresses |
| `--text-lg` | 18px / 28px | Card titles, subheadings |
| `--text-xl` | 22px / 30px | Listing H1 (mobile) |
| `--text-2xl` | 28px / 36px | Listing H1 (desktop) |
| `--text-3xl` | 36px / 44px | Section headings |
| `--text-4xl` | 48px / 56px | Homepage hero only |

**Letter-spacing:** tighten by `-0.3px` on headings ≥22px, `-0.5px` on H1.

## Spacing (4px base)

`--space-1` (4) · `--space-2` (8) · `--space-3` (12) · `--space-4` (16) ·
`--space-5` (20) · `--space-6` (24) · `--space-8` (32) · `--space-10` (40) ·
`--space-12` (48) · `--space-16` (64)

**Every spacing is a multiple of 4. No exceptions.**

## Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 6px | Chips, small buttons |
| `--radius-md` | 10px | Cards, inputs |
| `--radius-lg` | 16px | Modals, feature cards |
| `--radius-full` | 999px | Pills, toggles |

## 8 Premium Differentiators

1. **Warm whites** — `#FAFAF8` base, not `#FFFFFF`
2. **Type tightening** — `-0.3px` to `-0.5px` on large headings
3. **Warm shadows** — `rgba(26,25,23,X)`, never gray
4. **Border-primary cards** — 1px border default, shadow on hover only
5. **Single icon library** — Lucide everywhere, no mixing
6. **Micro-interactions** — copy→"Copied!" 1.5s, FAQ 250ms height, icon scale 1.08
7. **Zero orphan sections** — every null state has intentional copy + illustration
8. **Data density that breathes** — 20px card padding, 24px gaps, 32px sections

## Anti-Patterns (FORBIDDEN)

- ❌ Rainbow category colors — use one accent + tints
- ❌ Card borders AND drop shadows simultaneously
- ❌ All-caps body text
- ❌ More than 2 font families
- ❌ Gradient hero backgrounds
- ❌ Stock photos of Indian streets / namaste hands
- ❌ Blinking "VERIFIED" badges
- ❌ Centering body text (left-align everything except hero tagline)
- ❌ "Not available" / dashes for empty fields
- ❌ Blue underlined links in body — use subtle color only
- ❌ Full-width orange/red banners (legacy JustDial aesthetic)

## Motion Rules

| Allowed | Forbidden |
|---------|-----------|
| Card hover: border+shadow, 200ms | Entrance animations on cards |
| Button hover: bg shift, 150ms | Scroll-triggered animations |
| FAQ: height expand, 250ms ease-out | Parallax |
| Icon hover: scale(1.08), 200ms | Auto-playing carousels |
| Page transition: fade, 150ms | Spinning loaders (use skeletons) |
| Skeleton shimmer: 1.5s infinite | Any animation > 400ms |

**`prefers-reduced-motion: reduce` disables ALL animations. Non-negotiable.**

## Component Inventory

| Component | File | States |
|-----------|------|--------|
| ListingCard | `directory/ListingCard.tsx` | default, skeleton, empty |
| CategoryChip | `directory/Badges.tsx` | pill, compact |
| VerifiedBadge | `directory/Badges.tsx` | — |
| OpenBadge | `directory/Badges.tsx` | open, closed (pulsing dot) |
| SearchBar | `directory/SearchBar.tsx` | default, focused |
| CategoryTile | `directory/CategoryTile.tsx` | default, skeleton |
| FAQAccordion | `directory/FAQAccordion.tsx` | open, closed |
| FeatureCard | `directory/FeatureCard.tsx` | — |
| Breadcrumbs | `directory/Breadcrumbs.tsx` | — |
| BusinessDetailHeader | `directory/BusinessDetail.tsx` | — |
| ContactActions | `directory/BusinessDetail.tsx` | inline, sticky |
| PhotoGallery | `directory/PhotoGallery.tsx` | main, thumbnails, lightbox |
| EmptyStateIllustration | `directory/EmptyStateIllustration.tsx` | 10 variants |
| ErrorBoundary | `showcase/ErrorBoundary.tsx` | error, retry |
| CommandPalette | `showcase/CommandPalette.tsx` | open, closed |

## Where to Look

- **Tokens:** `src/app/globals.css` (lines 1-120)
- **Component specs:** `src/components/directory/*.tsx` (JSDoc at top of each file)
- **Live examples:** `/style-guide` view in the app
