# 07 — Conventions

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase.tsx | `ListingCard.tsx` |
| Lib modules | kebab-case.ts | `directory-data.ts` |
| API routes | route.ts (in folder) | `app/api/health/route.ts` |
| Scripts | kebab-case.mjs | `maintenance-cron.mjs` |
| Docs | NN-name.md | `01-architecture.md` |

## Component Structure

```tsx
"use client";                    // ← only if needs browser APIs / hooks

import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Business } from "@/lib/directory-data";

/**
 * ComponentName — one-line description.
 *
 * Spec: (link to design system rule if applicable)
 * - rule 1
 * - rule 2
 */
export function ComponentName({ prop1, prop2 }: Props) {
  // 1. Hooks (useState, useEffect, useContext)
  // 2. Derived state (useMemo if expensive)
  // 3. Handlers (useCallback if passed to children)
  // 4. Render
  return <div>...</div>;
}
```

## TypeScript Rules

- **No `any`.** Use `unknown` + type guard if truly unknown.
- **No `@ts-ignore` / `@ts-nocheck`.** Fix the type, don't hide it.
- **Strict mode** — enabled in `tsconfig.json`.
- **Prefer `interface` over `type`** for object shapes (extensible).
- **Use `type` for unions** (`type ViewKey = "home" | "category" | ...`).
- **Export all types** that components might need.
- **`as const`** for literal arrays/objects that shouldn't widen.

## Import Order

```typescript
// 1. React / Next.js
import { useState, useEffect } from "react";
import { NextResponse } from "next/server";

// 2. Third-party
import { Heart, Star } from "lucide-react";
import { clsx, type ClassValue } from "clsx";

// 3. Lib (absolute paths)
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
import type { Business } from "@/lib/directory-data";

// 4. Components (absolute paths)
import { ListingCard } from "@/components/directory/ListingCard";
import { useFavorites } from "@/components/showcase/FavoritesContext";
```

## Styling Rules

- **Inline `style` for design-token values** (CSS custom properties):
  ```tsx
  <div style={{ backgroundColor: "var(--color-surface)" }}>
  ```
- **Tailwind classes for layout** (flex, grid, padding):
  ```tsx
  <div className="flex items-center gap-3 p-4">
  ```
- **`cn()` helper** for conditional classes:
  ```tsx
  <div className={cn("border rounded-[10px]", isActive && "border-[var(--color-accent)]")}>
  ```
- **Never hardcode hex colors.** Always use `var(--color-*)`.
- **Never use `!important`.** Fix specificity at the source.

## Context Rules

- **All functions in context value MUST be `useCallback`-wrapped.**
  ```typescript
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [id, ...prev]);
  }, []);
  ```
- **Lazy initial state** for localStorage (no setState-in-effect):
  ```typescript
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  });
  ```
- **Persist via `useEffect`** (not during render):
  ```typescript
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites));
  }, [favorites]);
  ```

## Effect Rules

- **No `setState` directly in effect body** (causes cascading renders).
  ESLint rule `react-hooks/set-state-in-effect` enforces this.
- **Derived state:** compute during render, not in effect.
- **External sync:** `useEffect` is for syncing with external systems
  (localStorage, DOM, subscriptions) — NOT for deriving state from props.

## Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ListingCard` |
| Functions | camelCase | `handleFavorite` |
| Variables | camelCase | `activeIndex` |
| Constants | UPPER_SNAKE | `MAX_ITEMS` |
| Types/Interfaces | PascalCase | `Business`, `AdminStats` |
| CSS vars | kebab-case | `--color-accent` |
| Files (components) | PascalCase | `ListingCard.tsx` |
| Files (lib) | kebab-case | `directory-data.ts` |

## Handler Naming

- `handle{Event}` — `handleFavorite`, `handleCompare`, `handleSearch`
- `on{Event}` props — `onOpen`, `onNavigate`, `onSearch`
- `toggle{Thing}` — `toggleFavorite`, `toggleCompare`
- `clear{Thing}` — `clearFavorites`, `clearAllFilters`

## Commit Message Format

```
<type>(<scope>): <subject>

<body — why, not what>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`
Scope: `admin`, `health`, `ui`, `data`, `config`, etc.

Examples:
```
feat(admin): add subscription management modal
fix(detail): resolve infinite loop from context function recreation
docs: add AI-agent docs folder
```

## Worklog Format

Append to `/home/z/my-project/worklog.md`:

```markdown
---
Task ID: <unique-id>
Agent: <agent-name>
Task: <one-line summary>

Work Log:
- <concrete step 1>
- <concrete step 2>

Stage Summary:
- <key results>
- <artifacts produced>
```

## When in Doubt

1. Read the relevant doc in `docs/`
2. Check `worklog.md` for precedent
3. Look at an existing component that does something similar
4. Run `bun run lint` early and often
5. Test with `agent-browser` before declaring done
