# Risks

## Critical
- **No authentication:** Anyone can access admin panel and modify data. Must fix before deployment.
- **No payment verification:** Subscription activation is manual. Could be abused.
- **Mock data:** All business data is hardcoded. If someone creates a real business via API, it won't appear in the UI (which reads from mock data).

## High
- **In-memory rate limiting:** Won't protect against distributed attacks. Single-instance only.
- **No CSRF protection:** POST endpoints could be vulnerable to cross-site request forgery.
- **No input sanitization:** API endpoints don't sanitize HTML in review text, lead messages, etc. XSS risk.
- **SQLite for production:** Won't handle concurrent writes. Must migrate to PostgreSQL.

## Medium
- **No backup automation:** Admin UI has backup button but it doesn't actually back up the database.
- **No monitoring:** No Sentry for error tracking. Runtime errors in production would be invisible.
- **Bundle size:** Framer Motion + shadcn/ui + all admin views = large bundle. Lazy loading helps but homepage is still heavy.

## Low
- **No legal pages:** Privacy Policy, Terms of Service, Refund Policy don't exist. Legal risk.
- **No DPDP Act compliance:** India's data protection law (2023) requires consent for data collection.
- **GitHub token in remote URL:** Token is in git config. Should use SSH or credential helper instead.
