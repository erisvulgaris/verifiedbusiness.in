# Bharat Directory

A premium, light-mode, national-scale local business directory for India. Built with Next.js 16, TypeScript, Tailwind CSS 4, and Prisma.

## Quick Start

```bash
# Install dependencies
bun install

# Start the dev server (port 3000)
bun run dev

# In a separate terminal, start the maintenance scheduler (runs every 15 min)
bun run maintenance:scheduler

# Run a one-off maintenance cycle
bun run maintenance
```

## Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── route.ts              # API root — endpoint discovery
│   │   ├── health/route.ts       # Liveness & readiness probes
│   │   └── maintenance/run/      # Maintenance cycle trigger
│   ├── globals.css               # Design tokens (colors, type, spacing)
│   ├── layout.tsx                # Root layout — fonts, Toaster
│   └── page.tsx                  # Main SPA — 11 views, ErrorBoundary
├── components/
│   ├── directory/                # Reusable UI primitives (10 files)
│   │   ├── Badges.tsx            # CategoryChip, VerifiedBadge, OpenBadge
│   │   ├── ListingCard.tsx       # Business listing card + skeleton + empty
│   │   ├── SearchBar.tsx         # Hero search with focus state
│   │   ├── CategoryTile.tsx      # Homepage category grid tile
│   │   ├── FAQAccordion.tsx      # Smooth-height accordion
│   │   ├── FeatureCard.tsx       # 2-col feature card
│   │   ├── Breadcrumbs.tsx       # "/" separator breadcrumbs
│   │   ├── BusinessDetail.tsx    # Header + ContactActions + InfoBlock
│   │   ├── PhotoGallery.tsx      # Gallery + lightbox
│   │   └── EmptyStateIllustration.tsx  # 10 inline SVG illustrations
│   └── showcase/                 # View-level components (16 files)
│       ├── TopNav.tsx            # Sticky top nav + favorites/compare badges
│       ├── MobileTabBar.tsx      # Bottom tab bar (mobile only)
│       ├── ErrorBoundary.tsx     # React error boundary + global handler
│       ├── CommandPalette.tsx    # Cmd+K palette
│       ├── HomepageView.tsx      # Home
│       ├── CategoryListingView.tsx  # Browse (list/map toggle, filters)
│       ├── BusinessDetailView.tsx   # Business detail
│       ├── SearchResultsView.tsx    # Search results
│       ├── AllCategoriesView.tsx    # All categories
│       ├── LocationsView.tsx        # Browse by state → city
│       ├── CompareView.tsx          # Side-by-side comparison
│       ├── FavoritesView.tsx        # Saved businesses
│       ├── ListBusinessView.tsx     # 4-step listing wizard
│       ├── WriteReviewView.tsx      # Review form
│       ├── StyleGuideView.tsx       # Design system docs
│       ├── FavoritesContext.tsx     # localStorage favorites
│       ├── CompareContext.tsx       # localStorage compare
│       ├── RecentlyViewedContext.tsx # localStorage recently viewed
│       ├── useDirectoryToast.tsx    # Toast helpers
│       └── SeoStructuredData.tsx    # JSON-LD + useDocumentTitle
├── lib/
│   ├── directory-data.ts         # Mock data: 24 businesses, 12 categories
│   ├── db.ts                      # Prisma client (env-aware logging)
│   ├── env.ts                     # Environment variable validation
│   ├── logger.ts                  # Structured logger (levels, JSON/pretty)
│   ├── health.ts                  # Health check system
│   ├── maintenance.ts             # Maintenance runner (cron-invoked)
│   └── utils.ts                   # cn() class merger
└── scripts/
    ├── maintenance-cron.mjs       # One-shot cron script
    └── maintenance-scheduler.mjs  # Long-running scheduler (15-min interval)
```

## Design System

The design system is defined in `src/app/globals.css` as CSS custom properties. Key principles:

- **Light mode first** — warm `#FAFAF8` base, not pure white
- **Two fonts** — Plus Jakarta Sans (display) + Inter (body)
- **4px spacing grid** — every spacing is a multiple of 4
- **Warm shadows** — `rgba(26,25,23,X)`, never gray
- **Border-primary cards** — 1px border as default, shadow on hover only
- **prefers-reduced-motion** — all animations disabled when requested

See the in-app Style Guide (`/style-guide` view) for the full token reference.

## Health Checks & Monitoring

### Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Liveness probe (fast — process + event loop) |
| `/api/health?deep=true` | GET | Readiness probe (all checks including DB) |
| `/api/maintenance/run` | POST | Trigger a maintenance cycle |
| `/api/maintenance/run` | GET | Read the latest maintenance report |
| `/api` | GET | API endpoint discovery |

### Health Checks

The system runs 5 health checks:

1. **process** — heap memory (warn >500MB, fail >1GB), RSS (fail >2GB)
2. **event-loop** — lag measurement (warn >50ms, fail >100ms)
3. **disk** — temp directory writability
4. **database** — Prisma `SELECT 1` with 2s timeout
5. **mock-data** — import + structural validation of directory data

### Maintenance Cron

The maintenance scheduler runs every 15 minutes and:

1. Runs all health checks
2. Cleans up temp files older than 1 hour
3. Truncates `dev.log` if it exceeds 5MB (keeps last 1000 lines)
4. Scans `dev.log` for recurring error patterns (3+ occurrences)
5. Checks memory growth trend between cycles
6. Writes a timestamped health report to `.health/`
7. Opens actionable maintenance tasks for any failing checks

**To start the scheduler:**
```bash
bun run maintenance:scheduler
```

**To run a one-off cycle:**
```bash
bun run maintenance
```

**Health report files:**
- `.health/latest.json` — most recent report
- `.health/report-<timestamp>.json` — archived reports (last 24 kept)
- `.health/cron.log` — cron execution log
- `.health/scheduler.log` — scheduler execution log

## Database

The app currently uses mock data (`src/lib/directory-data.ts`) for the design-system showcase. The Prisma schema (`prisma/schema.prisma`) defines the target database schema for production, including:

- Geographic hierarchy: State → City → Locality (with pincode)
- Category, Business, DayHours, Review
- User/Account/Session for NextAuth.js

To wire up the database:
1. Run `bun run db:push` to create tables
2. Replace mock data imports with Prisma queries
3. Component contracts (Business, Category, etc.) stay the same

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | SQLite/PostgreSQL connection string |
| `NODE_ENV` | No | `development` | `development` / `test` / `production` |
| `LOG_LEVEL` | No | `info` | `debug` / `info` / `warn` / `error` |
| `ENABLE_HEALTH_CHECKS` | No | `true` | Enable/disable health endpoints |
| `NEXTAUTH_SECRET` | Prod | — | NextAuth.js secret (auto-generated in dev) |
| `CRON_SECRET` | No | — | Protects `/api/maintenance/run` in prod |
| `BASE_URL` | No | `http://localhost:3000` | Base URL for cron scripts |

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run maintenance` | One-shot maintenance cycle |
| `bun run maintenance:scheduler` | Start 15-min recurring scheduler |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:generate` | Generate Prisma client |

## License

© 2026 Bharat Directory. Made in India.
