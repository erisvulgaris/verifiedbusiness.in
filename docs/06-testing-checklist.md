# 06 — Testing Checklist

> Run through this checklist before declaring a feature "done."
> Use `agent-browser` CLI for all browser tests.

## Environment Setup

```bash
# 1. Dev server running
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
# Expected: 200

# 2. Lint clean
bun run lint
# Expected: no output (clean)

# 3. Health check passing
curl -s http://localhost:3000/api/health | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])"
# Expected: pass

# 4. No runtime errors in dev log
tail -50 dev.log | grep -iE "error|warn" | grep -v "✓"
# Expected: no output
```

## Browser Test Boilerplate

```bash
agent-browser set viewport 1440 900   # desktop
agent-browser open http://localhost:3000
agent-browser wait 3000
agent-browser errors                   # must be empty
```

## User-Facing View Tests

### Home (`home`)
- [ ] Hero renders with H1 + search bar
- [ ] Popular city chips clickable → navigate to search
- [ ] Category grid (8 tiles) renders + clickable
- [ ] Recently viewed section appears ONLY after viewing a business
- [ ] Browse by location section renders (6 cities)
- [ ] Feature cards (4) render
- [ ] Featured listings (4) render with favorite/compare buttons
- [ ] FAQ accordion: first item open by default, others toggle
- [ ] CTA strip "List your business" → navigates to list-business
- [ ] Footer renders with working links

### Browse / Category Listing (`category`)
- [ ] Breadcrumbs render (India → State → City → Category)
- [ ] Filter sidebar: verification, rating, payment, price, tags
- [ ] Each filter updates result count + adds chip
- [ ] "Clear all" resets all filters
- [ ] Sort dropdown (4 options) reorders results
- [ ] List/Map toggle switches view
- [ ] Map view: pins clickable → open detail
- [ ] Pagination renders
- [ ] Listing card click → opens detail
- [ ] Favorite heart toggles + toast appears
- [ ] Compare button toggles + toast appears (max 3)

### Business Detail (`detail`)
- [ ] Breadcrumbs (5 levels) render
- [ ] H1 = business name, letter-spacing tightened
- [ ] Category chip + Verified badge + Open badge render
- [ ] Rating + review count + years active render
- [ ] "Last updated" + "Report an update" link render
- [ ] Call / Directions / Website buttons work
- [ ] Copy phone → "Copied!" toast (1.5s)
- [ ] About section renders description
- [ ] Highlights list renders (4 items)
- [ ] Photo gallery: main image + thumbnails + lightbox
- [ ] Lightbox: ESC closes, ←/→ navigates, click outside closes
- [ ] Contact & hours info block renders
- [ ] Weekly hours table highlights TODAY
- [ ] Reviews section: rating summary + distribution bars + review cards
- [ ] "Write a review" button → navigates to write-review
- [ ] Save / Compare buttons in sidebar
- [ ] At a glance fact card
- [ ] Location map placeholder
- [ ] Related businesses (3) render at bottom
- [ ] Mobile: sticky CTA bar (Call + Directions) at bottom

### Search Results (`search`)
- [ ] Empty state with illustration when no results
- [ ] Live filtering as you type
- [ ] Suggestion cards when empty
- [ ] Result count updates
- [ ] Breadcrumbs render

### All Categories (`all-categories`)
- [ ] Filter input narrows categories
- [ ] Category grid (12) renders
- [ ] Detailed list with descriptions renders
- [ ] Click category → navigates to browse

### Locations (`locations`)
- [ ] State grid (12) renders
- [ ] Click state → drills down to cities
- [ ] State fact card renders (capital, cities, listings, code)
- [ ] "Back to all states" works
- [ ] India hierarchy explainer renders (6 levels)

### Compare (`compare`)
- [ ] Empty state with illustration when no items
- [ ] Side-by-side table renders (11 rows)
- [ ] Remove button per column
- [ ] "Clear all" works
- [ ] "Add more" link → navigates to browse
- [ ] Max 3 items enforced

### Favorites (`favorites`)
- [ ] Empty state with illustration when no favorites
- [ ] Saved businesses render as cards
- [ ] "Clear all" works
- [ ] Count in H1 matches

### List Business Wizard (`list-business`)
- [ ] 4-step wizard renders
- [ ] Step 1: name + category + description (validation)
- [ ] Step 2: phone + email + website + address + city + pincode (6 digits)
- [ ] Step 3: GST number (15 chars) + upload
- [ ] Step 4: review all fields + terms checkbox
- [ ] Continue button disabled until required fields filled
- [ ] Back button works (or Cancel on step 1)
- [ ] Submit → success screen with next-steps

### Write Review (`write-review`)
- [ ] Star rating (5 stars, hover preview)
- [ ] Review title (optional)
- [ ] Review body (min 20 chars, max 1000)
- [ ] Reviewer name (min 2 chars)
- [ ] Guidelines box renders
- [ ] Submit → success screen
- [ ] Back to business button works

### Style Guide (`style-guide`)
- [ ] Design philosophy (3 words)
- [ ] Color tokens (all 16 swatches)
- [ ] Typography (8 sizes)
- [ ] Spacing grid (10 tokens)
- [ ] Border radius (4 tokens)
- [ ] Component examples (badges, search, tiles, cards, FAQ, ratings)
- [ ] Do / Don't columns
- [ ] Motion principles
- [ ] New components section (illustrations, palette, toasts, etc.)

## Admin Panel Tests

### Admin Dashboard (`admin-dashboard`)
- [ ] 6 KPI cards render with correct values
- [ ] Revenue chart renders (6 bars)
- [ ] Subscription donut renders (3 segments)
- [ ] Top categories bars render
- [ ] Recent activity feed (5 items)
- [ ] Quick action buttons navigate

### Admin Businesses (`admin-businesses`)
- [ ] Table renders with all 24 businesses
- [ ] Search filters by name
- [ ] Category filter works
- [ ] Verification filter (All / Verified / Unverified)
- [ ] Subscription filter (All / Free / Monthly / Yearly)
- [ ] Approve button toggles verified status
- [ ] Edit modal opens, fields editable, save works
- [ ] Delete with confirmation
- [ ] Manage subscription modal: change plan, extend, cancel
- [ ] Bulk select + bulk actions

### Admin Reviews (`admin-reviews`)
- [ ] Queue renders flagged/pending reviews
- [ ] Filter by status
- [ ] Approve / Reject / Ignore buttons work
- [ ] Review text + business name + author render

### Admin Subscriptions (`admin-subscriptions`)
- [ ] Revenue summary (MRR, ARR, total, churn)
- [ ] Plan breakdown (free/monthly/yearly counts + revenue)
- [ ] Table: business, plan, status, amount, dates, auto-renew
- [ ] Extend / Cancel / Change plan actions
- [ ] Expiring soon filter (7/14/30 days)

### Admin Settings (`admin-settings`)
- [ ] Pricing section (edit plan amounts)
- [ ] Verification criteria toggles
- [ ] Feature flags
- [ ] Maintenance section: trigger cycle, view latest report

## Cross-Cutting Tests

### Command Palette (Cmd+K)
- [ ] Click trigger OR Cmd+K opens palette
- [ ] Search filters 50+ items live
- [ ] ↑/↓ navigates, Enter selects, ESC closes
- [ ] Selecting a business → opens detail
- [ ] Selecting a nav item → navigates

### Toast Notifications
- [ ] Favorite add → "Saved to favorites" toast
- [ ] Favorite remove → "Removed from favorites" toast
- [ ] Compare add → "Added to comparison" toast
- [ ] Compare full → "Comparison full" toast (destructive style)
- [ ] Copy phone → "Copied!" toast

### Mobile (390×844)
- [ ] Bottom tab bar renders (5 tabs)
- [ ] Tab navigation works
- [ ] Favorites badge on "Saved" tab
- [ ] No horizontal scroll on any view
- [ ] Touch targets ≥ 44px

### Accessibility
- [ ] Tab key → skip-to-content link appears first
- [ ] Enter activates focused listing card
- [ ] ESC closes palette/lightbox/mobile filter drawer
- [ ] FAQ accordion toggles via keyboard
- [ ] All icon buttons have aria-labels
- [ ] Focus ring visible (2px accent blue)

### SEO
- [ ] Document title updates per view
- [ ] JSON-LD injected on detail page (LocalBusiness + BreadcrumbList)
- [ ] JSON-LD cleaned up when leaving detail page

### Performance
- [ ] Homepage renders in < 500ms (after compile)
- [ ] No "Maximum update depth exceeded" errors
- [ ] No console errors on any view
- [ ] Dev log: 200 responses, no 500s

## API Tests

```bash
# Health (liveness)
curl -s http://localhost:3000/api/health | jq '.status'
# Expected: "pass"

# Health (readiness)
curl -s "http://localhost:3000/api/health?deep=true" | jq '.checks | length'
# Expected: 5

# Maintenance trigger
curl -s -X POST http://localhost:3000/api/maintenance/run | jq '.healthReport.status'
# Expected: "pass"

# API discovery
curl -s http://localhost:3000/api | jq '.name'
# Expected: "VerifiedBusiness.in API"
```

## Regression Checklist (after any change)

- [ ] `bun run lint` clean
- [ ] All 5 health checks pass
- [ ] Homepage renders at desktop + mobile
- [ ] No new console errors
- [ ] No new entries in `worklog.md` "Known Issues" section
