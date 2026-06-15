# AGENTS.md

## Project Overview

**Data Center Capacity & Power Modeling Tool** — Plans and models power consumption, hardware capacity, and costs across multiple data center sites over quarterly time horizons.

**Stack:** Next.js 16.1.1 (canary), React 19, TypeScript 5, Prisma 6, SQLite, Tailwind CSS v4, shadcn/ui, Vitest, Recharts

---

## Development Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm start                # Start production server
npm run lint             # ESLint
npm run test             # Run all Vitest tests
npm run test:watch       # Vitest watch mode
npm run docker:up        # Start Docker stack (Next.js + SQLite + Adminer)
npm run docker:down      # Stop Docker stack
npm run docker:build     # Build Docker image

npx prisma generate      # Regenerate Prisma client
npx prisma migrate dev   # Create + apply migrations (dev)
npx prisma migrate deploy # Apply migrations (production)
npx prisma migrate reset # Reset dev database
npx prisma db seed       # Seed database with sample data
npx prisma studio        # Open database GUI
npx tsc --noEmit         # TypeScript type check
```

---

## Project Structure

```
app/                          # Next.js App Router
  layout.tsx                  # Root layout: AppSidebar + main content
  globals.css                 # Tailwind v4 @theme + CSS variables
  page.tsx                    # Dashboard
  catalog/page.tsx            # Hardware catalog
  scenarios/page.tsx          # Scenarios list
  scenarios/[id]/page.tsx     # Scenario detail
  scenarios/compare/page.tsx  # Multi-scenario comparison

components/
  ui/                         # 22 shadcn/ui primitives
  layout/AppSidebar.tsx       # Navigation sidebar
  dashboard/                  # DashboardView, DashboardSummary, ScenarioAggregateChart
  scenario/                   # ScenarioView, PowerChart, ReportTable, ScenarioSummaryReport,
                              # SitePlanEditor, AddLineItemDialog, EditLineItemDialog,
                              # ScenariosList, CreateScenarioDialog, DeleteScenarioButton,
                              # ExportScenarioButton, CapacityGauge, CapacityAlertPanel
  catalog/                    # CatalogList, CatalogDialog

lib/
  db.ts                       # Prisma client singleton (globalForPrisma pattern)
  utils.ts                    # cn() — clsx + twMerge
  actions.ts                  # Server actions (all mutations)
  services/data.ts            # Data fetching (getScenarios, getScenarioById, getCatalogItems)
  engine/                     # Pure calculation engine (no I/O)
    time.ts                   # TimeUtils: quarter parsing, indexing, ranges
    projector.ts              # Line item → quarterly time series
    aggregator.ts             # Site aggregation: power + costs + capacity
    capacity.ts               # Constraint analysis (power/electrical/cooling/rack)
    project.ts                # Project tag grouping + metrics
    timeline.ts               # Gantt-style timeline generation
    whatif.ts                 # What-if simulation + alternative suggestions

prisma/
  schema.prisma               # Database schema (5 models)
  seed.ts                     # Seed data (8 catalog items, 1 scenario, 3 sites)
  migrations/                 # Migration history

Tests (colocated):
  lib/engine/engine.test.ts   # TimeUtils, Projector, Aggregator
  lib/engine/features.test.ts # CapacityAnalyzer, ProjectAggregator, TimelineEngine, WhatIfEngine
  lib/actions.catalog.test.ts # Catalog CRUD
  lib/actions.export.test.ts  # Export (CSV/JSON)
  lib/actions.realtime.test.ts # Revalidation
  vitest.config.ts            # Config: node env, @ alias
```

---

## Data Model

```
CatalogItem ──────┐
                  ├── LineItem ─── Site ─── Scenario ─── Assumption
```

**CatalogItem:** Hardware definitions (GPU/CPU/Storage) with power, cost, capacity, cooling requirements, rack space
**Scenario:** Planning container with horizon dates and optional base flag
**Site:** Data center with IT/electrical/cooling/rack capacity and baseline loads
**LineItem:** Deployment of a catalog item at a site with quantity, timeline, project tag, and actuals tracking
**Assumption:** Key-value settings (cooling_overhead, inflation_rate)

Quarter format: `YYYYQN` (e.g., `2024Q1`) — **no hyphen**.

---

## Architecture Patterns

### Server Components → Client Components

- Pages (`app/**/page.tsx`) are server components — they fetch data and pass to client components
- All UI in `components/` has `"use client"` — handles interactivity, state, events
- **Never** import a server component into a client component

### Server Actions (All Mutations)

- Defined in `lib/actions.ts` with `"use server"` directive
- Write to database via Prisma, then call `revalidatePath()` for cache invalidation
- Called directly from client components (no API routes)
- Use `FormData` for form submissions

### Pure Calculation Engine

- `lib/engine/` contains pure functions — no I/O, no side effects
- Inputs: line items, catalog items, site data, assumptions
- Output: `SiteProjection[]` — quarterly power, capacity, cost data
- Fully testable with Vitest (no mocks needed)

### Data Flow

```
User action → Server component fetches data → Client component renders
Mutation:   Client form → Server action → Prisma write → revalidatePath() → Re-render
Calc:       Server fetches scenario → Aggregator computes → Client displays
```

---

## Calculation Engine

### Pipeline

```
LineItems + Site + Assumptions
  → Projector.project() — Per line item: quarterly power, capex, capacity
  → Aggregator.aggregateSite() — Sum + baseline + cooling + utility costs
  → SiteProjection[] per quarter
```

### Key Formulas

```
itPowerMw        = Σ(line item power)
totalItPowerMw   = itPowerMw + baselineItPowerMw
adjustedPowerMw  = totalItPowerMw × coolingOverhead
mechanicalLoadMw = (adjustedPowerMw - totalItPowerMw) + baselineMechanicalMw
utilityCost      = adjustedPowerMw × 1000 × 2160 × rate × (1 + inflation)^(quarterOffset/4)
capex            = quantity × cost (deployment quarter only)
remainingPowerMw = totalItCapacityMw - adjustedPowerMw
```

---

## UI Patterns

**shadcn/ui v4:** All UI primitives in `components/ui/` — button, dialog, table, card, form, select, input, etc.

**Tailwind v4:** No `tailwind.config.ts`. Configuration via `@theme` in `app/globals.css`. CSS variables for theming (--background, --foreground, --card, --primary, --muted, --destructive, etc.)

**Forms:** React Hook Form + Zod validation in dialog components.

**Responsive:** Sidebar is `hidden md:block` with `md:w-64 lg:w-72` width.

**Path aliases:** `@/components` → `components/`, `@/lib` → `lib/`, `@/hooks` → `hooks/`

---

## Server Actions Reference

| Action | Purpose |
|--------|---------|
| `createScenario(formData)` | Create or clone scenario |
| `updateScenario(id, data)` | Update scenario metadata |
| `deleteScenario(id)` | Delete scenario + cascade |
| `createSite(scenarioId, data)` | Add site |
| `updateSite(id, data)` | Update site |
| `deleteSite(id)` | Delete site + line items |
| `addLineItem(siteId, data)` | Add deployment |
| `updateLineItem(id, data)` | Modify deployment |
| `deleteLineItem(id)` | Remove deployment |
| `updateActuals(id, data)` | Update actual tracking |
| `createCatalogItem(data)` | Add hardware |
| `updateCatalogItem(id, data)` | Modify hardware |
| `deleteCatalogItems(ids[])` | Bulk delete hardware |
| `updateScenarioAssumptions(scenarioId, data)` | Update cooling/inflation |
| `exportScenario(scenarioId)` | Export single scenario (JSON) |
| `exportAllScenarios()` | Export all scenarios (JSON) |

---

## Testing

```bash
npm test           # Run all tests
npm test:watch     # Watch mode
```

Vitest runs in `node` environment (no DOM). Engine tests are pure unit tests. Action tests mock Prisma with `vi.mock('@/lib/db')` and Next.js cache with `vi.mock('next/cache')`.

Path alias `@` is resolved in `vitest.config.ts` matching `tsconfig.json`.

---

## Docker

`docker-compose.yml`: web (Next.js on :3000), db (SQLite volume), adminer (GUI on :8080).

`Dockerfile`: Multi-stage build, `node:22-alpine`, `next.config.ts` uses `output: "standalone"`.

`next.config.ts` includes `outputFileTracingIncludes` for Prisma client binaries.

---

## Type Safety

- Prisma generates types from `schema.prisma` — run `npx prisma generate` after schema changes
- All server actions have explicit parameter types
- React component props use inline interfaces
- TypeScript strict mode enabled in `tsconfig.json`

---

## Gotchas

1. **Prisma singleton:** `lib/db.ts` uses `globalForPrisma.prisma` to prevent multiple instances during hot reload
2. **Quarter format:** `2024Q1` not `2024-Q1` — `TimeUtils.parse()` rejects hyphens
3. **Server/client boundary:** Can't import server components into client components
4. **revalidatePath:** Must call after every mutation or data stays stale
5. **Tailwind v4:** No `tailwind.config.ts` — use `@theme` in CSS
6. **SQLite:** Single file database at `prisma/dev.db` — back up by copying

---

## Documentation

Full documentation in `docs/`:
- `INSTALL.md` — Installation and setup
- `USER_GUIDE.md` — End user manual
- `DEVELOPER_GUIDE.md` — Technical developer reference
- `ARCHITECTURE.md` — System architecture
- `UPGRADE.md` — Migration and update procedures
