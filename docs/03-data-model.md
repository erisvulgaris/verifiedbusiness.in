# 03 — Data Model

## Core Types

All types live in `src/lib/directory-data.ts`. Import from there.

### Business

```typescript
interface Business {
  id: string;                    // "b1", "b2", ...
  name: string;
  category: string;              // "Restaurants"
  categorySlug: string;          // "restaurants"
  rating: number;                // 4.6
  reviewCount: number;           // 2841
  address: string;
  locality: string;              // "Whitefield"
  city: string;                  // "Bengaluru"
  state: string;                 // "Karnataka"
  pincode: string;               // "560048" (6 digits)
  phone: string;                 // "+91 80 4900 1234"
  website?: string;
  email?: string;
  hours: string;                 // "11:00 AM – 11:00 PM"
  weeklyHours: DayHours[];       // Mon-Sun
  openNow: boolean;
  verified: boolean;             // verified badge
  paymentMethods: string[];      // ["UPI", "Cards", "Cash"]
  description: string;
  highlights: string[];          // 3-4 selling points
  yearsActive: number;
  priceRange?: "$" | "$$" | "$$$" | "$$$$";
  photos?: number;
  reviews?: Review[];
  tags?: string[];

  // Subscription (paid listing model)
  subscription: Subscription;
}
```

### Subscription (paid model)

```typescript
type SubscriptionPlan = "free" | "monthly" | "yearly";
type SubscriptionStatus = "active" | "expired" | "pending" | "cancelled";

interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;             // ISO date
  endDate: string;               // ISO date (expiry)
  amount: number;                // in INR (₹)
  autoRenew: boolean;
}
```

**Pricing (in `src/lib/admin-data.ts`):**

| Plan | Price (INR) | Duration | Features |
|------|-------------|----------|----------|
| Free | ₹0 | — | Basic listing, no verification badge |
| Monthly | ₹999 | 30 days | Verified badge, priority placement, analytics |
| Yearly | ₹9,999 | 365 days | Everything in Monthly + 2 months free, premium support |

### DayHours

```typescript
interface DayHours {
  day: string;                   // "Mon", "Tue", ... "Sun"
  open: string;                  // "9:00 AM"
  close: string;                 // "9:00 PM"
  closed?: boolean;              // true for closed days
}
```

### Review

```typescript
interface Review {
  id: string;
  author: string;
  initials: string;              // "PM" for Priya Menon
  rating: number;                // 1-5
  date: string;                  // "2 weeks ago"
  text: string;
  helpful: number;               // upvote count
}
```

### Category

```typescript
interface Category {
  id: string;
  name: string;                  // "Restaurants"
  slug: string;                  // "restaurants"
  icon: LucideIcon;              // from lucide-react
  listingCount: number;          // 248190
  description: string;
}
```

### StateInfo

```typescript
interface StateInfo {
  code: string;                  // "KA"
  name: string;                  // "Karnataka"
  capital: string;
  cityCount: number;
  businessCount: number;
  featuredCities: string[];
}
```

## Geographic Hierarchy (per platform spec)

```
Level 1: Country        → India (1)
Level 2: State / UT     → 36 (28 states + 8 UTs)
Level 3: District       → 780+
Level 4: City / Town    → 4,000+
Level 5: Locality/Area  → variable
Level 6: Pincode        → 19,000+
```

**Every level is a first-class SEO asset.** Every level gets its own page type.
No level is skipped or collapsed.

## Mock Data Scale (current)

| Entity | Count | Source |
|--------|-------|--------|
| Businesses | 24 | `BUSINESSES` array in `directory-data.ts` |
| Categories | 12 | `CATEGORIES` array |
| States | 12 | `INDIA_STATES` array |
| FAQs | 6 | `FAQS` array |
| Features | 4 | `FEATURES` array |
| Reviews | ~40 | embedded in `business.reviews[]` |

## Search Helper

```typescript
function searchBusinesses(
  query: string,                 // matches name/category/description/locality/city/state/tags
  location: string,              // matches locality/city/state/pincode
  filters?: {
    verification?: "verified" | "all";
    minRating?: number | null;
    paymentMethods?: string[];
  }
): Business[]
```

## Prisma Schema (target production)

See `prisma/schema.prisma` for the full database schema. Key models:

- `State` → `City` → `Locality` (geographic hierarchy with indexes)
- `Category` (slug-indexed)
- `Business` (indexes on categorySlug, cityId, stateCode, pincode, verified, rating)
- `DayHours` (cascade delete with Business)
- `Review` (cascade delete with Business)
- `User` / `Account` / `Session` (NextAuth.js)

**To wire up DB:** Replace mock data imports with Prisma queries.
Component contracts (`Business`, `Category`) stay identical.

## Admin Data (`src/lib/admin-data.ts`)

Admin-specific helpers:

```typescript
function getAdminStats(): AdminStats;        // KPIs for dashboard
function getPendingBusinesses(): Business[]; // awaiting approval
function getRevenueMetrics(): RevenueMetrics; // MRR, ARR, plan breakdown
function getFlaggedReviews(): Review[];      // need moderation
```

## When Adding New Data

1. Add the type to `src/lib/directory-data.ts`
2. Add mock instances to the relevant array
3. If admin-visible, add a helper to `src/lib/admin-data.ts`
4. Update `checkMockDataIntegrity` in `src/lib/health.ts` if structure changes
5. Update this doc
