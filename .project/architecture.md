# Architecture

## Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5 (strict)
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **UI:** shadcn/ui + custom components
- **Animation:** Framer Motion 12
- **Database:** Prisma + SQLite (dev), PostgreSQL (prod target)
- **Auth:** NextAuth.js v4 (installed, not configured)
- **State:** React Context + localStorage

## Structure
```
src/
├── app/              # App Router (page.tsx = single-page view registry)
│   ├── api/          # 13 API routes
│   ├── globals.css   # Design tokens + dark mode + print + premium effects
│   └── layout.tsx    # Fonts (Plus Jakarta Sans + Inter) + Toaster + manifest
├── components/
│   ├── admin/        # 12 admin view components
│   ├── directory/    # 12 reusable UI primitives
│   └── showcase/     # 25 view-level + context + utility components
├── lib/              # 14 modules (db, health, logger, rate-limit, etc.)
└── scripts/          # Maintenance cron scripts
```

## Data Flow
- User click → Component handler → Context toggle → localStorage persist + toast
- API: Request → Rate limit check → Validation → Prisma query → JSON response
- Views: page.tsx state registry (no Next.js routing — single `/` route)

## Database Models (15)
State, City, Locality, Category, Business, DayHours, Review, User, Account, Session, AdCampaign, Lead, SupportTicket, Notification, Invoice, FeatureFlag

## Subscription Tiers (7)
Free ₹0, Starter ₹999, Growth ₹4,999, Premium ₹14,999, Elite ₹29,999, Enterprise ₹49,999, Ultimate ₹4,99,999
