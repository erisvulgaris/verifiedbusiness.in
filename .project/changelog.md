# Changelog

## 2026-07-19 — Autonomous Engineering Iteration

### Added
- `.project/` documentation directory (worklog, architecture, roadmap, requirements, technical_debt, backlog, decisions, changelog, testing, qa, risks)
- 10 CRUD API routes (businesses, reviews, leads, ads, tickets, notifications, subscriptions, invoices, search, upload)
- Prisma schema with 15 models (added AdCampaign, Lead, SupportTicket, Notification, Invoice, FeatureFlag)
- 7 subscription tiers with ad credits (Free ₹0 → Ultimate ₹4,99,999)
- Email service with 6 templates
- PWA manifest.json
- Dark mode CSS variables (15 overrides)
- Notification center with bell + dropdown
- Share button on business detail
- Working pagination on category listing
- Admin sidebar search
- Rate limiting on all API endpoints
- Audit logging system
- Analytics tracking (batched client-side)

### Changed
- Subscription plans: 3 tiers (free/monthly ₹999/yearly ₹9,999) → 7 tiers (free/starter ₹999/growth ₹4,999/premium ₹14,999/elite ₹29,999/enterprise ₹49,999/ultimate ₹4,99,999)
- All admin views updated to show 7-tier pricing
- PlanBadge updated to handle all plan types
- AdminLayout: added Users, Content, System, Support nav items (11 total)
- All admin views lazy-loaded with React.lazy + Suspense

### Fixed
- 6 placeholder `href="#"` links replaced with real paths
- Rate limiting missing on maintenance endpoint
- Invalid React pattern (setState in effect) in audit log seeding

### Security
- Rate limiting on all API endpoints (60/min health, 10/min maintenance, 100/min default)
- .env removed from git tracking
- db/custom.db removed from git tracking
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
