# VerifiedBusiness.in — AI Agent Docs

> **Read this first.** This folder is optimized for AI agents, not humans.
> Every file is < 300 lines, scannable, decision-focused, and code-linked.

## What is this project?

A premium, light-mode, national-scale local business directory for India.
Businesses pay monthly or yearly subscriptions to be "verified" and listed.
Admins manage approvals, subscriptions, and reviews via a dedicated panel.

## Tech Stack (locked)

| Layer | Tech | Why |
|-------|------|-----|
| Framework | Next.js 16 (App Router) | Required by sandbox |
| Language | TypeScript 5 (strict) | Non-negotiable |
| Styling | Tailwind CSS 4 + inline CSS vars | Design tokens are CSS custom properties |
| UI lib | shadcn/ui (New York) + custom | Don't reinvent primitives |
| Icons | Lucide | Single library, no mixing |
| Fonts | Plus Jakarta Sans + Inter | Two fonts only, no exceptions |
| DB | Prisma + SQLite (mock data now) | Schema ready for production |
| State | React Context + localStorage | Favorites, Compare, RecentlyViewed |

## File Map (read in this order)

1. [`01-architecture.md`](./01-architecture.md) — folder structure, data flow, view registry
2. [`02-design-system.md`](./02-design-system.md) — tokens, components, do/don't rules
3. [`03-data-model.md`](./03-data-model.md) — Business, Category, Subscription shapes
4. [`04-engineering-decisions.md`](./04-engineering-decisions.md) — config, logging, health, maintenance
5. [`05-admin-panel.md`](./05-admin-panel.md) — admin views, subscription model, role guard
6. [`06-testing-checklist.md`](./06-testing-checklist.md) — E2E flows to verify before shipping
7. [`07-conventions.md`](./07-conventions.md) — code style, naming, commit format

## Quick Rules (non-negotiable)

- **Light mode first.** Dark mode is Phase 2. Don't add dark-mode code.
- **Two fonts only.** Plus Jakarta Sans (display) + Inter (body). Never add a third.
- **4px spacing grid.** Every spacing value is a multiple of 4.
- **Warm shadows.** `rgba(26,25,23,X)` — never gray `rgba(0,0,0,X)`.
- **Border-primary cards.** 1px border default, shadow on hover only.
- **No entrance animations.** Ruins F-pattern scanning.
- **`prefers-reduced-motion` respected.** All animations disabled when requested.
- **No `any` types.** No `@ts-ignore`. No `ignoreBuildErrors`.
- **`useCallback` all context functions.** Prevents infinite re-render loops.
- **Token-efficient docs.** Tables > prose. Code links > code copies.

## How to Make Changes

1. Read the relevant doc file above.
2. Check `worklog.md` for what's been done.
3. Make the change.
4. Run `bun run lint` — must be clean.
5. Test with `agent-browser` (see `06-testing-checklist.md`).
6. Append to `worklog.md` with Task ID + summary.

## Current State (as of last update)

- 11 user-facing views + 5 admin views
- 24 mock businesses across 8 cities / 10 states
- Subscription model: free / monthly / yearly
- Health checks: 5 (all passing)
- Maintenance scheduler: 15-min interval
- Lint: clean. Build: passing. Runtime errors: 0.
