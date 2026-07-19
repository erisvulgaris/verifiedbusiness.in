# Roadmap

## Current Milestone: Production Hardening
Target: Wire real backend to match frontend quality

## Upcoming Milestones

### M1: Authentication & Security (Week 1)
- Configure NextAuth.js (Google + credentials)
- Role-based access control (super_admin, admin, moderator, business_owner, viewer)
- Login/signup pages
- Route protection middleware
- Password reset flow

### M2: Database & Real Data (Week 2)
- Seed script with real categories, states, cities
- Replace all mock data imports with Prisma queries
- Business CRUD APIs fully wired
- Server-side search

### M3: Payment System (Week 3)
- Razorpay integration
- Checkout flow + payment verification
- Invoice generation (GST compliant)
- Auto-renewal + failure handling

### M4: Business Owner Portal (Week 4)
- Dashboard (analytics, leads, reviews, subscription)
- Listing editor
- Review response management
- Ad campaign builder
- Invoice download

### M5: Ad Management (Week 5-6)
- Meta Marketing API integration
- Campaign creation + approval workflow
- Ad performance dashboard
- Ad credit allocation by plan

## Completed Milestones
- ✅ M0: Design system + UI (22 views, premium animations, dark mode)
- ✅ M0.5: Admin panel (11 views with mock data)
- ✅ M0.7: API infrastructure (13 routes, rate limiting, health checks)
- ✅ M0.8: Database schema (15 models, subscription tiers)
