# Developer Guide — Data Center Capacity & Power Modeling Tool

> Comprehensive reference for developers working on the codebase.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Development Workflow](#development-workflow)
- [Server Actions & Error Handling](#server-actions--error-handling)
- [Validation with Zod](#validation-with-zod)
- [Calculation Engine](#calculation-engine)
- [Testing](#testing)
- [Component Patterns](#component-patterns)
- [Database & Migrations](#database--migrations)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

**Stack:** Next.js 16.1.1 (canary), React 19, TypeScript 5, Prisma 6, SQLite, Tailwind CSS v4, shadcn/ui, Vitest, Recharts

**What it does:** Plans and models power consumption, hardware capacity, and costs across multiple data center sites over quarterly time horizons.

**Key entities:**
- **CatalogItem** — Hardware definitions (GPU/CPU/Storage) with power, cost, capacity, cooling requirements
- **LineItem** — Hardware deployments with quantity, timeline, and project tag
- **Site** — Data center with IT/electrical/cooling/rack capacity baselines
- **Scenario** — Collection of sites, assumptions, and deployments with a shared timeline
- **Assumption** — Global parameters (cooling overhead, inflation rate)

---

## Architecture

### Data Flow

```
User Action → Server Action (lib/actions.ts) → Prisma write → revalidatePath()
                                                              ↓
Page Re-render → Server fetches data → Engine computes → Client displays
```

### Server/Client Boundary

- **Pages** (`app/**/page.tsx`) — Server Components by default
- **Components** (`components/`) — Client Components with `"use client"`
- **Server Actions** (`lib/actions.ts`) — `"use server"` at file level
- **NEVER** import a server component into a client component

### Directory Structure

```
app/                    # Next.js App Router
  layout.tsx            # Root layout, sidebar, theme
  page.tsx              # Dashboard
  scenarios/page.tsx    # Scenario list
  scenarios/[id]/page.tsx  # Scenario detail
  scenarios/compare/    # Multi-scenario comparison
  catalog/page.tsx      # Hardware catalog

components/
  ui/                   # 22 shadcn/ui primitives
  layout/AppSidebar.tsx # Sidebar navigation
  dashboard/            # DashboardView, ScenarioAggregateChart
  scenario/             # ScenarioView, PowerChart, CapacityGauge, dialogs
  catalog/              # CatalogList, CatalogDialog

lib/
  actions.ts            # Server actions (mutations)
  db.ts                 # Prisma client singleton
  schemas.ts            # Zod validation schemas
  useServerAction.ts    # ActionResult type + hook
  services/data.ts      # Query helpers

lib/engine/             # Pure calculation engine (no I/O)
  projector.ts          # Quarterly power/capex projection per line item
  aggregator.ts         # Site-level aggregation with cooling, utility costs
  capacity.ts           # Capacity analysis, constraint detection
  whatif.ts             # What-if scenario simulation
  time.ts               # Quarter parsing, range generation

prisma/
  schema.prisma         # Database schema
  seed.ts               # Development seed data
  migrations/           # Migration history
```

---

## Development Workflow

### Local Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev      # http://localhost:3000
```

### Common Commands

```bash
npm run dev           # Start development server
npm run build         # Production build
npm start             # Start production server
npm run lint          # ESLint
npm run test          # Run all tests (Vitest)
npm run test:watch    # Watch mode
npx prisma studio     # Database GUI
npx tsc --noEmit      # TypeScript type check
```

### Pre-Commit Hook

The project uses Husky with a pre-commit hook that runs:
1. `npm run lint` — ESLint
2. `npx tsc --noEmit` — TypeScript check
3. `npm run test` — Vitest

To skip the hook (not recommended): `git commit --no-verify`

---

## Server Actions & Error Handling

### ActionResult Pattern

All server actions in `lib/actions.ts` return `ActionResult<T>`:

```typescript
export type ActionResult<T = void> = {
    success: boolean;
    error?: string;
    data?: T;
};
```

**Example server action:**

```typescript
export async function addLineItem(siteId: string, data: {...}): Promise<ActionResult> {
    try {
        const item = await prisma.lineItem.create({ data: { siteId, ...data } });
        revalidatePath(`/scenarios/${scenarioId}`);
        return { success: true, data: item };
    } catch (e) {
        console.error('[addLineItem] Error:', e);
        const msg = e instanceof Error ? e.message : 'Failed to add line item';
        return { success: false, error: msg };
    }
}
```

**Example client usage:**

```tsx
async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
        const result = await addLineItem(siteId, {...});
        if (result.success) {
            setOpen(false);
        } else {
            setError(result.error || 'An unexpected error occurred');
        }
    } catch (e) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred');
    } finally {
        setLoading(false);
    }
}
```

### Current Server Actions

| Action | Description |
|--------|-------------|
| `createScenario(formData)` | Create new scenario |
| `updateScenario(id, data)` | Update scenario metadata |
| `deleteScenario(id)` | Delete scenario with cascade |
| `createSite(scenarioId, data)` | Add site to scenario |
| `updateSite(id, data)` | Update site settings |
| `deleteSite(id)` | Remove site from scenario |
| `addLineItem(siteId, data)` | Add deployment line item |
| `updateLineItem(id, data)` | Update deployment |
| `deleteLineItem(id)` | Remove deployment |
| `updateActuals(id, data)` | Update actual spend tracking |
| `createCatalogItem(data)` | Add hardware to catalog |
| `updateCatalogItem(id, data)` | Update catalog entry |
| `deleteCatalogItem(id)` | Remove catalog entry |
| `updateScenarioAssumptions(scenarioId, data)` | Update global assumptions |

---

## Validation with Zod

Server-side validation schemas live in `lib/schemas.ts`. Each entity has:
- A **Zod schema** for data validation
- A **FormData parser** for form submissions

```typescript
import { lineItemSchema } from '@/lib/schemas';

// Validate before database write
const parsed = lineItemSchema.safeParse(formData);
if (!parsed.success) {
    return { success: false, error: 'Invalid input' };
}
```

---

## Calculation Engine

The engine (`lib/engine/`) contains **pure functions** with no I/O. All inputs are Prisma model types; outputs are projection data.

### Pipeline

```
Projector.projectLineItem()  → ProjectedPoint[] (quarterly power, capex, capacity per item)
     ↓
Aggregator.aggregateSite()   → SiteProjection[] (baseline + cooling + utility costs per quarter)
     ↓
CapacityAnalyzer.analyzeSiteCapacity() → SiteCapacityStatus (constraints, warnings, critical alerts)
```

### Key Formulas

```typescript
// Per item per quarter
powerMw = (activeUnits * powerKw) / 1000
capex = isDeploymentQuarter ? (quantity * cost) : 0

// Per site per quarter
adjustedPowerMw = totalItPowerMw * (1 + coolingOverhead)
mechanicalLoadMw = adjustedPowerMw * (coolingOverhead / (1 + coolingOverhead))
utilityCost = adjustedPowerMw * 1000 * 2160 * electricityRatePerKwh * (1 + inflation)^(quarterOffset/4)
remainingPowerMw = totalItCapacityMw - totalItPowerMw
```

### Quarter Format

Quarters use `YYYYQN` format (e.g., `2024Q1`). **No hyphens.** The parser rejects `2024-Q1`.

### Engine Modules

- **projector.ts** — `Projector.projectLineItem(item, settings)` → `ProjectedPoint[]`
- **aggregator.ts** — `Aggregator.aggregateSite(site, assumptions, settings)` → `SiteProjection[]`
- **capacity.ts** — `CapacityAnalyzer.analyzeSiteCapacity(site, projections, threshold)` → `SiteCapacityStatus`
- **whatif.ts** — `WhatIfEngine.applyChanges(site, assumptions, scenario, settings)` → `WhatIfResult`
- **time.ts** — `TimeUtils.parse()`, `TimeUtils.toIndex()`, `TimeUtils.generateRange()`

---

## Testing

### Running Tests

```bash
npm run test          # All tests
npm run test:watch    # Watch mode
```

### Test Structure

Tests use Vitest and mock Prisma:

```typescript
vi.mock('@/lib/db', () => ({
    prisma: { /* mock Prisma client */ },
}));
```

**Test files:**
- `lib/engine/engine.test.ts` — Core engine tests (projector, aggregator, capacity, whatif)
- `lib/engine/features.test.ts` — Feature-specific tests
- `lib/actions.catalog.test.ts` — Catalog CRUD actions
- `lib/actions.export.test.ts` — Export functionality

### Writing Engine Tests

Engine tests should be pure — no I/O, no mocks needed:

```typescript
import { Projector } from './projector';
import { Aggregator } from './aggregator';
import { CapacityAnalyzer } from './capacity';

const cat = createMockCatalogItem({ powerKw: 12.5, cost: 250000 });
const item = createMockLineItem(cat, { quantity: 10 });
const result = Projector.projectLineItem(item, { horizonStart: '2024Q1', horizonEnd: '2028Q4' });
```

---

## Component Patterns

### Forms

- React Hook Form + Zod validation in dialog components
- Submit handlers: `async onSubmit(formData: FormData)`
- Always include loading states: `disabled={loading}`
- Always include error handling: `setError()` + conditional `<Alert>` display

### CapacityGauge

Circular gauge component with trend indicators:

```tsx
<CapacityGauge value={0.75} label="Power Utilization" size="lg" trend="up" />
```

- `trend` prop: `"up" | "down" | "stable"` — shows ▲▼● indicator
- Color coding: green (<60%), amber (60-75%), orange (75-90%), red (≥90%)
- Accessible: `role="img"`, `aria-label`, `aria-describedby`

### Responsive Design

- `hidden md:block` for hiding elements on mobile
- `md:w-64 lg:w-72` for sidebar width
- Tailwind v4: configuration via `@theme` in `app/globals.css` (no `tailwind.config.ts`)

---

## Database & Migrations

### Schema

```prisma
CatalogItem   // Hardware definitions
LineItem      // Deployments
Site          // Data center sites
Scenario      // Scenarios
Assumption    // Global parameters
```

### Migration Commands

```bash
npx prisma generate         # Generate Prisma client
npx prisma migrate dev      # Create and apply migration (dev)
npx prisma migrate deploy   # Apply pending migrations (prod)
npx prisma migrate reset    # Reset database (dev)
npx prisma db seed          # Seed development data
npx prisma studio           # Database GUI
```

### Seed Script

`prisma/seed.ts` creates:
- 8 catalog items (GPUs, CPUs, storage)
- 1 scenario ("Caxa")
- 3 sites (Virginia, Oregon, Nevada)
- 10 line items across all sites
- 2 assumptions (cooling overhead, inflation rate)

The seed script is **idempotent** — it clears existing data before seeding.

---

## Docker

```bash
npm run docker:up     # Start web + adminer
npm run docker:build  # Rebuild image
npm run docker:down   # Stop containers
```

### docker-compose.yml

- **web** — Next.js on port 3000 (node:22-alpine, standalone output)
- **adminer** — Database GUI on port 8080
- **Volumes** — `prisma:/app/prisma` for database persistence

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| Stale TypeScript errors | `rm -rf .next node_modules/.cache tsconfig.tsbuildinfo` |
| Prisma client out of sync | `npx prisma generate` after schema changes |
| Data not updating after mutation | Check `revalidatePath()` is called in the server action |
| SQLite database locked | Stop dev server, delete `prisma/dev.db`, run `npx prisma migrate dev` |
| Tailwind styles missing | Check `app/globals.css` for `@theme` variables |
| Server action throws | Check `lib/actions.ts` — all actions now return `ActionResult` |

### Gotchas

1. **Prisma singleton:** `lib/db.ts` uses `globalForPrisma.prisma` to prevent multiple instances in hot reload
2. **Quarter format:** `2024Q1` not `2024-Q1` — hyphens are rejected
3. **Server/client boundary:** Can't import server components into client components
4. **revalidatePath:** Must call after every mutation or data stays stale
5. **Tailwind v4:** No `tailwind.config.ts` — use `@theme` in CSS
6. **SQLite:** Database at `prisma/dev.db` — use migrations for schema changes
7. **Path aliases:** `@/components` → `components/`, `@/lib` → `lib/`

---

## Contributing

1. Create a feature branch from `master`
2. Make changes following existing patterns
3. Run `npx tsc --noEmit` and `npm run test` before committing
4. The pre-commit hook will also run lint, type check, and tests
5. Update relevant documentation in `docs/`
