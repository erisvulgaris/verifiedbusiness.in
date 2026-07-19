# Technical Debt

## Critical
- **Mock data everywhere:** All 24 businesses, categories, states, users, tickets are hardcoded TypeScript arrays. 0 Prisma queries in app code.
- **No authentication:** NextAuth.js installed but not configured. Admin panel is completely open.
- **No payment processing:** Subscription activation is manual (admin clicks button). No Razorpay integration.
- **No ad management:** Meta Marketing API not integrated. Ad campaigns are DB records with no actual ad creation.

## High
- **Client-side search only:** Filtering 24 businesses in the browser. Won't scale beyond ~1000.
- **In-memory rate limiting:** Won't work with multiple server instances.
- **In-memory audit log:** 200-event ring buffer, not persisted to database.
- **No test suite:** 0 test files exist.

## Medium
- **No Docker/CI:** No Dockerfile, no GitHub Actions.
- **No monitoring:** No Sentry, no Datadog.
- **Analytics not aggregated:** Events logged but not queried for dashboard.
- **No file upload backend:** Upload API is a stub (no S3/Cloudinary).

## Low
- **No PWA service worker:** Manifest exists but no offline support.
- **No multi-language:** English only (Phase 2 plan).
- **No legal pages:** Privacy, Terms, Refund pages don't exist.
