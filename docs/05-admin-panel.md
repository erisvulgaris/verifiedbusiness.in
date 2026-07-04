# 05 — Admin Panel

## Access

Admin views are prefixed `admin-*` in the `ViewKey` union. Accessed via:
- Top nav "Admin" tab (visible on desktop)
- Mobile tab bar "Admin" tab
- Command palette → "Admin dashboard"

**Role guard:** Currently no auth (demo mode). In production, wrap admin
views in `<AdminGuard>` that checks NextAuth session role === "admin".

## Admin Views (5)

### 1. `admin-dashboard` — `src/components/admin/AdminDashboardView.tsx`

KPI cards + charts. No mutations — read-only overview.

**KPIs:**
- Total businesses
- Verified count (+ % of total)
- Active subscriptions (monthly + yearly)
- Monthly recurring revenue (MRR)
- Pending approvals
- Flagged reviews

**Charts:**
- Revenue trend (last 6 months, bar chart)
- Subscription plan distribution (donut: free/monthly/yearly)
- Top categories by listing count (horizontal bars)
- Recent activity feed (last 5 actions)

### 2. `admin-businesses` — `src/components/admin/AdminBusinessesView.tsx`

Business management table.

**Columns:** Name, Category, City, Rating, Verified, Plan, Status, Actions

**Filters:** search, category, verification, subscription plan, status

**Actions per row:**
- View (opens detail page)
- Approve/Unverify (toggles `verified`)
- Edit (opens modal — name, phone, hours, etc.)
- Delete (with confirm)
- Manage subscription (opens subscription modal)

**Bulk actions:** Select multiple → Approve / Delete / Export CSV

### 3. `admin-reviews` — `src/components/admin/AdminReviewsView.tsx`

Review moderation queue.

**States:** flagged / pending / approved / rejected

**Per review:** business name, author, rating, text, helpful count,
flag reason (if flagged), actions (approve/reject/ignore)

### 4. `admin-subscriptions` — `src/components/admin/AdminSubscriptionsView.tsx`

Revenue + subscription management.

**Revenue summary:** MRR, ARR, total lifetime, churn rate, plan breakdown

**Table:** Business, Plan, Status, Amount, Start, End, Auto-renew, Actions

**Actions:** Extend, Cancel, Change plan, View invoice history

### 5. `admin-settings` — `src/components/admin/AdminSettingsView.tsx`

Platform configuration.

**Sections:**
- Pricing (edit plan amounts)
- Verification criteria (toggle requirements)
- Email templates (welcome, expiry reminder, etc.)
- Feature flags (enable/disable modules)
- Maintenance (trigger cycle, view latest report)

## Subscription Model

### Plans (in `src/lib/admin-data.ts`)

```typescript
const SUBSCRIPTION_PLANS = {
  free:    { price: 0,    durationDays: 0,   label: "Free" },
  monthly: { price: 999,  durationDays: 30,  label: "Monthly" },
  yearly:  { price: 9999, durationDays: 365, label: "Yearly" },
};
```

### Statuses

| Status | Meaning | UI color |
|--------|---------|----------|
| `active` | Paid, within validity | success (green) |
| `expired` | Past endDate, not renewed | warning (amber) |
| `pending` | Payment initiated, awaiting confirmation | warning |
| `cancelled` | User cancelled, no auto-renew | tertiary (gray) |

### Business Logic

- Free plan: no verification badge, basic placement
- Monthly/Yearly: verified badge, priority placement, analytics access
- Yearly: 2 months free vs monthly (₹9,999 vs ₹11,988)
- Auto-renew on by default for paid plans
- Expiry email sent 7 days before `endDate`

## Admin Data Helpers (`src/lib/admin-data.ts`)

```typescript
getAdminStats(): AdminStats
getPendingBusinesses(): Business[]
getRevenueMetrics(): RevenueMetrics
getFlaggedReviews(): Review[]
getExpiringSubscriptions(days: number): Business[]
```

All helpers operate on the mock `BUSINESSES` array. In production, replace
with Prisma queries.

## Component Patterns

### Admin table (reusable)

```tsx
<AdminTable
  columns={columns}
  rows={filteredBusinesses}
  filters={filterConfig}
  bulkActions={bulkActions}
  rowAction={(row) => <RowMenu business={row} />}
/>
```

### Admin modal (reusable)

```tsx
<AdminModal
  open={open}
  onClose={handleClose}
  title="Edit Business"
  size="md"
>
  <FormFields />
</AdminModal>
```

## Security Notes (production checklist)

- [ ] Wrap all admin views in `<AdminGuard>` checking session role
- [ ] All admin API routes require `role === "admin"` middleware
- [ ] Audit log for every admin action (approve, delete, refund)
- [ ] Rate limit admin API endpoints
- [ ] 2FA for admin accounts
- [ ] No client-side subscription status changes (server-authoritative)

## When Adding Admin Features

1. Add the view component in `src/components/admin/`
2. Add the `ViewKey` to the union in `TopNav.tsx`
3. Wire into `page.tsx` view registry
4. Add nav entry in `TopNav` (desktop) + `MobileTabBar` (mobile)
5. Add command palette entry in `CommandPalette.tsx`
6. Add data helper in `src/lib/admin-data.ts`
7. Test per `06-testing-checklist.md`
