# Decisions

## D1: Single-page app with view-state registry (not Next.js routing)
- **Context:** Sandbox only exposes `/` route. Multiple routes not served.
- **Decision:** Use client-side state to switch between 22 views.
- **Rationale:** Allows 22+ "pages" from one route. Component contracts won't change when migrating to real routing.
- **Consequences:** No per-page URL sharing. SEO per page not possible without migration.

## D2: CSS custom properties for design tokens (not Tailwind config)
- **Context:** Design system requires warm whites, India blue accent, warm shadows.
- **Decision:** Define all tokens as CSS variables in globals.css, use inline styles.
- **Rationale:** Enables runtime theme switching (dark mode) without recompilation.
- **Consequences:** Can't use Tailwind color utilities directly. Mixed approach (Tailwind for layout, CSS vars for colors).

## D3: 7 subscription tiers (not 3)
- **Context:** User wants ₹999 → ₹4,99,999 pricing range.
- **Decision:** 7 tiers: Free, Starter, Growth, Premium, Elite, Enterprise, Ultimate.
- **Rationale:** Covers small shops to national brands. Ad credit scales with tier.
- **Consequences:** More complex pricing UI. Need clear differentiation between tiers.

## D4: Lazy-load admin views
- **Context:** 11 admin views are heavy (charts, tables, modals).
- **Decision:** Use React.lazy + Suspense for all admin views.
- **Rationale:** Reduces initial bundle by ~30KB+. Homepage visitors don't download admin code.
- **Consequences:** Brief loading skeleton when first navigating to admin.

## D5: In-memory rate limiting (not Redis)
- **Context:** Single-instance dev environment.
- **Decision:** In-memory sliding window per IP.
- **Rationale:** Simple, no external dependency. Sufficient for dev.
- **Consequences:** Won't work with multiple instances. Must migrate to Redis for production.

## D6: Framer Motion for animations (not CSS-only)
- **Context:** Premium UI requires spring physics, stagger, magnetic buttons.
- **Decision:** Use Framer Motion 12 for all complex animations.
- **Rationale:** Spring physics, AnimatePresence, layout animations. Respects prefers-reduced-motion.
- **Consequences:** ~50KB added to bundle. Acceptable for premium feel.
