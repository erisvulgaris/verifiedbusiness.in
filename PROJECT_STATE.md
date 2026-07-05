# PROJECT_STATE.md — VerifiedBusiness.in

> **Persistent project context for AI agents.**
> Updated after every improvement run. Read this first.

## Project Identity

- **Name:** VerifiedBusiness.in
- **Type:** Premium local business directory for India (paid listing model)
- **Stack:** Next.js 16 (App Router), TypeScript 5, Tailwind CSS 4, Prisma, SQLite (mock data)
- **Brand:** VerifiedBusiness.in (renamed from Bharat Directory)
- **Version:** 1.0.0

## Current State (Last Updated: 2026-07-05)

### Views (18 total)

**User-facing (11):**
1. Home — hero, search, categories, recently viewed, browse by location, features, featured listings, FAQ, CTA
2. Browse (Category Listing) — filters, sort, list/map toggle, pagination, CSV export
3. Business Detail — header, contact actions, photo gallery, weekly hours, reviews, related, print
4. Search Results — live filtering, empty state
5. All Categories — filterable grid + detailed list
6. Locations — state grid → city drill-down + India hierarchy
7. Compare — side-by-side table (max 3)
8. Favorites — localStorage-backed
9. List Business — 4-step wizard with validation
10. Write Review — star rating + character count
11. Style Guide — full design system documentation

**Admin (7):**
1. Dashboard — 6 KPIs, revenue chart, plan distribution, top categories, activity feed
2. Businesses — table, filters, bulk actions, edit/subscription/delete modals, CSV export
3. Reviews — moderation queue with flag reasons
4. Subscriptions — MRR/ARR/churn, plan breakdown, revenue chart, expiry alerts
5. Analytics — event tracking, 7-day trend, top pages, top searches
6. Audit Log — compliance tracking, category filter, CSV export
7. Settings — pricing, feature flags, maintenance trigger

### Key Features

- ✅ Subscription model (Free ₹0 / Monthly ₹999 / Yearly ₹9,999)
- ✅ Dynamic open/closed status (computed from weekly hours)
- ✅ Plan badges ("★ Featured" for yearly, "Premium" for monthly)
- ✅ Command palette (Cmd+K) with 50+ items
- ✅ Keyboard shortcuts overlay (press `?`)
- ✅ Photo gallery with lightbox
- ✅ Map view on listing page
- ✅ Mobile bottom tab bar
- ✅ Error boundary + global error handler
- ✅ Print stylesheet for business detail
- ✅ CSV export (admin)
- ✅ Rate limiting on API endpoints (60/min health, 10/min maintenance)
- ✅ Audit logging system
- ✅ Analytics event tracking
- ✅ SEO: JSON-LD structured data, per-view titles
- ✅ Accessibility: focus rings, skip-to-content, keyboard nav, ARIA labels
- ✅ Health checks (5): process, event-loop, disk, database, mock-data
- ✅ Maintenance scheduler (15-min interval)

### Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # 4 API routes
│   ├── globals.css        # Design tokens + print styles
│   ├── layout.tsx         # Fonts, Toaster
│   └── page.tsx           # Single-page app with 18 views
├── components/
│   ├── admin/             # 8 admin view components
│   ├── directory/         # 10 reusable UI primitives
│   └── showcase/          # 20 view-level + context + utility components
├── lib/                   # 10 modules
│   ├── directory-data.ts  # 24 businesses, 12 categories, 12 states + types
│   ├── admin-data.ts      # Admin stats + revenue helpers
│   ├── business-hours.ts  # Open/closed computation
│   ├── csv-export.ts      # CSV utility
│   ├── rate-limit.ts      # API rate limiting
│   ├── audit-log.ts       # Audit event tracking
│   ├── analytics.ts       # Client-side event tracking
│   ├── health.ts          # 5 health checks
│   ├── maintenance.ts     # Maintenance runner
│   ├── logger.ts          # Structured logger
│   ├── env.ts             # Environment validation
│   └── db.ts              # Prisma client
└── scripts/               # 2 maintenance scripts
```

### Database (Prisma Schema)

10 models: State, City, Locality, Category, Business, DayHours, Review, User, Account, Session

Business includes: subscription fields (plan, status, start, end, amount, autoRenew), indexes on categorySlug/cityId/stateCode/pincode/verified/rating/subscriptionPlan/subscriptionStatus

### API Routes

| Endpoint | Method | Rate Limit | Purpose |
|----------|--------|-----------|---------|
| `/api` | GET | 100/min | Endpoint discovery |
| `/api/health` | GET | 60/min | Liveness probe |
| `/api/health?deep=true` | GET | 60/min | Readiness probe (all checks) |
| `/api/maintenance/run` | POST | 10/min | Trigger maintenance cycle |
| `/api/maintenance/run` | GET | 10/min | Read latest report |
| `/api/analytics` | POST | 100/min | Receive analytics events |
| `/api/analytics` | GET | 100/min | Analytics summary |

### Design System

- **Colors:** 16 tokens (warm whites, India blue accent, warm shadows)
- **Typography:** Plus Jakarta Sans (display) + Inter (body)
- **Spacing:** 4px base grid
- **Radii:** 4 tokens (6px, 10px, 16px, 999px)
- **Shadows:** 4 warm shadow tokens
- **Motion:** ≤400ms, prefers-reduced-motion respected

### Security

- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- ✅ Rate limiting on all API endpoints
- ✅ CRON_SECRET protection on maintenance endpoint (prod)
- ✅ No XSS vectors (no dangerouslySetInnerHTML in app code, no innerHTML)
- ✅ No hardcoded secrets
- ✅ No eval/new Function
- ⚠️ No authentication yet (admin panel has no RBAC — Phase 2)
- ⚠️ No CSRF protection (not needed for GET-only, but POST endpoints should have it)

### Known Issues + Pending Work

1. **No authentication** — admin panel is open in demo mode. Need NextAuth.js + RBAC.
2. **No real database** — using mock data. Prisma schema ready but not wired.
3. **No payment integration** — subscription model is display-only. Need Razorpay.
4. **No email/SMS** — no notification system beyond toasts.
5. **No search API** — search is client-side (won't scale to millions of businesses).
6. **No business claim flow** — users can't claim their listing.
7. **Analytics not aggregated** — events logged but not queried for dashboard.
8. **Audit log not persisted** — in-memory ring buffer only (last 200 events).

### Priorities (Next)

1. **High:** Add NextAuth.js authentication with admin role guard
2. **High:** Wire Prisma database (replace mock data)
3. **Medium:** Add Razorpay payment integration for subscriptions
4. **Medium:** Add email notifications (welcome, expiry, review)
5. **Medium:** Build business claim flow
6. **Low:** Add server-side search API with PostgreSQL full-text search
7. **Low:** Add analytics aggregation (daily/weekly/monthly rollups)
8. **Low:** Persist audit logs to database

### Build Health

- **Lint:** Clean (0 errors, 0 warnings)
- **TypeScript:** Strict mode, no `any` types
- **Health checks:** 5/5 passing
- **Runtime errors:** 0
- **Dependencies:** 66 production, 9 dev
- **Bundle size:** Not yet optimized (Phase 8 pending)

### Documentation

- `README.md` — Architecture, design system, health checks, env vars, scripts
- `docs/` — 7 AI-agent-optimized docs (architecture, design, data model, engineering, admin, testing, conventions)
- `worklog.md` — Every iteration logged with Task ID + summary
- `PROJECT_STATE.md` — This file (persistent project context)
