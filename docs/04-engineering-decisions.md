# 04 — Engineering Decisions

## Config

### `next.config.ts`
- `reactStrictMode: true` — catches unsafe lifecycles, accidental side effects
- `ignoreBuildErrors: false` (removed) — type safety enforced at build time
- `poweredByHeader: false` — doesn't leak Next.js version
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `X-DNS-Prefetch-Control`
- `output: "standalone"` — production deployment

### `src/lib/env.ts`
Validates environment variables at startup. **Fail-fast** on missing required vars.

| Var | Required | Default | Notes |
|-----|----------|---------|-------|
| `DATABASE_URL` | ✅ | — | SQLite/PostgreSQL |
| `NODE_ENV` | — | `development` | `development`/`test`/`production` |
| `LOG_LEVEL` | — | `info` | `debug`/`info`/`warn`/`error` |
| `ENABLE_HEALTH_CHECKS` | — | `true` | Enable health endpoints |
| `NEXTAUTH_SECRET` | prod | — | Auto-generated in dev |
| `CRON_SECRET` | — | — | Protects `/api/maintenance/run` in prod |
| `BASE_URL` | — | `http://localhost:3000` | For cron scripts |

**Usage:** `import { env, isProduction, isDevelopment } from "@/lib/env"`

### `src/lib/db.ts`
Prisma client singleton with env-aware logging.

- Dev: `["query", "warn", "error"]` — full visibility
- Prod: `["warn", "error"]` — quiet, performant
- Cached on `globalThis` to prevent connection exhaustion during hot reload
- Graceful shutdown: `SIGINT` / `SIGTERM` / `beforeExit` → `$disconnect()`

## Logging

### `src/lib/logger.ts`

Structured logger with levels. **No `console.log` in app code — use `logger`.**

```typescript
import { logger, createLogger } from "@/lib/logger";

logger.info("Business viewed", { id: "b1", name: "Sankalp" });
logger.error("DB query failed", { error: err.message });

const log = createLogger({ module: "api/health" });
log.info("Health check passed");
```

- **Dev output:** `[2026-06-30T12:00:00.000Z] INFO  Business viewed {"id":"b1"}`
- **Prod output:** `{"ts":"...","level":"info","msg":"Business viewed","id":"b1"}`
- Filtered by `LOG_LEVEL` env var
- Never logs PII — caller's responsibility

## Health Checks

### `src/lib/health.ts`

5 registered checks:

| Check | What it tests | Warn | Fail |
|-------|---------------|------|------|
| `process` | Heap + RSS memory | heap >500MB | heap >1GB or RSS >2GB |
| `event-loop` | Lag on `setImmediate` | >50ms | >100ms |
| `disk` | Temp dir writability | — | can't write |
| `database` | Prisma `SELECT 1` (2s timeout) | — | timeout/error |
| `mock-data` | Import + structural validation + dup IDs | — | missing fields |

**Two probe types:**
- **Liveness** (`GET /api/health`): process + event-loop only (fast <50ms)
- **Readiness** (`GET /api/health?deep=true`): all 5 checks

**HTTP status:** 200 if pass/warn, 503 if fail.

**Register custom checks:** `registerHealthCheck(name, fn)`

## Maintenance System

### `src/lib/maintenance.ts`

Runs every 15 minutes via scheduler. **Never throws — all errors caught.**

Cycle:
1. Run all health checks
2. Clean temp files >1h old (`.tmp/`, `/tmp/bharat-directory/`)
3. Truncate `dev.log` if >5MB (keep last 1000 lines)
4. Scan `dev.log` for recurring errors (3+ occurrences, normalized hash)
5. Track memory growth between cycles (warn if >50MB)
6. Write `.health/latest.json` + timestamped archive (keep 24)
7. Generate `MaintenanceTask[]` for any fail/warn

### Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Liveness probe |
| `/api/health?deep=true` | GET | Readiness probe |
| `/api/maintenance/run` | POST | Trigger cycle (CRON_SECRET in prod) |
| `/api/maintenance/run` | GET | Read latest report |
| `/api` | GET | Endpoint discovery |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `scripts/maintenance-cron.mjs` | `bun run maintenance` | One-shot cycle |
| `scripts/maintenance-scheduler.mjs` | `bun run maintenance:scheduler` | Long-running 15-min interval |

**Scheduler details:** 60s initial delay (server warmup), skip-if-running guard,
clean SIGINT/SIGTERM shutdown. Logs to `.health/scheduler.log`.

## Error Handling

### `src/components/showcase/ErrorBoundary.tsx`

Class component wrapping `<main>`. Catches render errors, shows graceful
fallback with retry button + error details disclosure.

### `useGlobalErrorHandler()` hook

Attaches `window.onerror` + `unhandledrejection` listeners. Logs to
`logger.error`. Wired in `page.tsx`.

## Critical Bug Fix (Iteration 3)

**Symptom:** "Maximum update depth exceeded" console errors on detail page.

**Root cause:** Context functions (`addRecentlyViewed`, `toggleFavorite`, etc.)
were recreated every render. Used in `useEffect` deps → infinite loop.

**Fix:** All context functions are `useCallback`-memoized:

```typescript
const addRecentlyViewed = useCallback((id: string) => {
  setRecentlyViewed((prev) => [id, ...prev.filter(x => x !== id)].slice(0, MAX));
}, []);  // ← stable reference
```

**Rule:** Any function in a context value MUST be `useCallback`-wrapped.

## Build Health

- **Lint:** `bun run lint` — must be 0 errors, 0 warnings
- **No `any` types.** No `@ts-ignore`. No `@ts-nocheck`. No `eslint-disable`.
- **TypeScript strict mode** — enforced by tsconfig
- **All imports resolved** — no `module-not-found` in dev.log

## Observability Files

| Path | Content |
|------|---------|
| `.health/latest.json` | Most recent maintenance report |
| `.health/report-<ts>.json` | Archived reports (last 24) |
| `.health/cron.log` | Cron script execution log |
| `.health/scheduler.log` | Scheduler execution log |
| `dev.log` | Next.js dev server output |

## When Adding New Engineering Features

1. Add the module to `src/lib/`
2. Register any new health check in `src/lib/health.ts`
3. Add env vars to `src/lib/env.ts` schema
4. Update `README.md` + this doc
5. Add a maintenance task if relevant (e.g., cleanup, monitoring)
6. Run `bun run lint` + test with `agent-browser`
