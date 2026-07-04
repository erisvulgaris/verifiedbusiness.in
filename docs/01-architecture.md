# 01 — Architecture

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (see 04-engineering-decisions.md)
│   │   ├── route.ts              # GET / — endpoint discovery
│   │   ├── health/route.ts       # GET /api/health[?deep=true]
│   │   └── maintenance/run/      # POST trigger, GET latest report
│   ├── globals.css               # Design tokens (CSS custom properties)
│   ├── layout.tsx                # Root layout — fonts, Toaster
│   └── page.tsx                  # Main SPA — view registry + ErrorBoundary
├── components/
│   ├── directory/                # Reusable UI primitives (10 files)
│   └── showcase/                 # View-level components + contexts
├── lib/                          # Business logic, no React
│   ├── directory-data.ts         # Mock data + types + search helper
│   ├── admin-data.ts             # Admin-specific data + stats helpers
│   ├── db.ts                     # Prisma client (env-aware)
│   ├── env.ts                    # Environment variable validation
│   ├── logger.ts                 # Structured logger
│   ├── health.ts                 # Health check system
│   ├── maintenance.ts            # Maintenance runner
│   └── utils.ts                  # cn() class merger
└── scripts/                      # Standalone Node scripts
    ├── maintenance-cron.mjs      # One-shot cron
    └── maintenance-scheduler.mjs # Long-running scheduler
```

## View Registry (single-page app)

`src/app/page.tsx` holds a `view` state that switches between views.
No Next.js routing — everything is client-side state.

```typescript
type ViewKey =
  | "home" | "category" | "detail" | "style-guide"
  | "search" | "all-categories" | "locations"
  | "compare" | "favorites" | "list-business" | "write-review"
  | "admin-dashboard" | "admin-businesses" | "admin-reviews"
  | "admin-subscriptions" | "admin-settings";
```

**Why single-page?** The sandbox only exposes `/`. Real routing would require
multiple Next.js routes, which the sandbox doesn't serve. The view registry
pattern gives us 16+ "pages" from one route.

**When to switch to real routing:** When deploying to a real domain with
server-side rendering needs (SEO per page, distinct URLs for sharing).
The component contracts won't change — just wrap each view in its own
`page.tsx` under `app/<slug>/`.

## Context Providers (3 layers)

```
<FavoritesProvider>      ← localStorage, count badge in nav
  <CompareProvider>      ← localStorage, max 3 items
    <RecentlyViewedProvider>  ← localStorage, max 6 items
      <Page />
    </RecentlyViewedProvider>
  </CompareProvider>
</FavoritesProvider>
```

**All context functions are `useCallback`-memoized.** This is critical —
without it, `addRecentlyViewed` gets recreated every render, causing the
`BusinessDetailView` effect to fire infinitely ("Maximum update depth exceeded").

## Data Flow

```
User action (click)
  → Component handler
    → Context toggle (setState)
      → localStorage persist (useEffect)
      → Toast notification (useDirectoryToast)
      → Re-render with new badge count
```

No server calls. All state is client-side. The mock data in
`src/lib/directory-data.ts` is imported directly by views.

**When to add server calls:** Replace mock data imports with `fetch()` calls
to API routes that query Prisma. Component contracts (`Business`, `Category`)
stay identical — only the data source changes.

## Error Boundary

`<ErrorBoundary>` wraps `<main>` in `page.tsx`. Catches render errors,
shows graceful fallback with retry button. `useGlobalErrorHandler` hook
attaches `window.onerror` + `unhandledrejection` listeners for telemetry.

## SEO

- `useDocumentTitle(title)` hook in every view — sets/restores `document.title`
- `useBusinessJsonLd(business)` hook — injects schema.org `LocalBusiness` +
  `BreadcrumbList` JSON-LD on detail pages, cleans up on unmount
- See `src/components/showcase/SeoStructuredData.ts`

## Key Files to Read First

| File | What it tells you |
|------|-------------------|
| `src/app/page.tsx` | View registry, provider nesting, error boundary |
| `src/lib/directory-data.ts` | All TypeScript types + mock data + search helper |
| `src/components/showcase/TopNav.tsx` | Nav structure, ViewKey type, badges |
| `src/app/globals.css` | Every design token (colors, type, spacing, shadows) |
