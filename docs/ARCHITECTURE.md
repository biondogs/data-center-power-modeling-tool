# Architecture

Data Center Capacity & Power Modeling Tool — System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Pages   │  │  Client  │  │  shadcn/ui       │  │
│  │  (Server)│→ │Components│  │  Primitives      │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└───────────┬───────────────┬──────────────┬──────────┘
            │               │              │
     ┌──────▼──────┐  ┌─────▼────────────┐ │
     │  Server     │  │  Calculation     │ │
     │  Actions    │  │  Engine (Pure)   │ │
     │  (actions.ts)│  │  (lib/engine/)  │ │
     └──────┬──────┘  └──────────────────┘ │
            │                              │
     ┌──────▼──────┐                       │
     │   Prisma    │                       │
     │   ORM       │                       │
     └──────┬──────┘                       │
            │                              │
     ┌──────▼──────┐                       │
     │   SQLite    │                       │
     │   (dev.db)  │                       │
     └─────────────┘                       │
```

**Design principles:**
- Server components fetch data; client components handle interactivity
- All mutations go through server actions (no API routes)
- Calculation engine is pure — no I/O, fully testable
- SQLite single-file database for simplicity and portability

---

## Component Architecture

### Server Components (Pages)

All files in `app/` are server components by default. They fetch data at render time and pass it down to client components as props.

| File | Purpose |
|------|---------|
| `app/page.tsx` | Dashboard — fetches all scenarios, renders `DashboardView` |
| `app/catalog/page.tsx` | Catalog — fetches catalog items, renders `CatalogList` |
| `app/scenarios/page.tsx` | Scenarios list — renders `ScenariosList` |
| `app/scenarios/[id]/page.tsx` | Scenario detail — fetches full scenario, renders `ScenarioView` |
| `app/scenarios/compare/page.tsx` | Comparison — renders `ScenarioComparisonClient` |
| `app/layout.tsx` | Root layout — `AppSidebar` + main content area |

### Client Components

All files in `components/` have `"use client"`. They handle user interaction, form submission, and state management.

**Dashboard:**
- `DashboardView` — Main dashboard with scenario selector and navigation
- `DashboardSummary` — Aggregate metric cards across all scenarios
- `ScenarioAggregateChart` — Multi-scenario power comparison (Recharts)

**Scenario:**
- `ScenarioView` — Main scenario page orchestrator
- `PowerChart` — Per-site power projection area chart (Recharts)
- `ReportTable` — Quarterly data table per site
- `ScenarioSummaryReport` — Cross-site aggregated report with metric cards
- `SitePlanEditor` — Per-site line item table with add/edit controls
- `AddLineItemDialog` / `EditLineItemDialog` — Line item forms
- `CreateScenarioDialog` — New scenario form
- `DeleteScenarioButton` — Confirmation + delete
- `ExportScenarioButton` — CSV / print / JSON export
- `CapacityGauge` — Circular SVG utilization gauge
- `CapacityAlertPanel` — Constraint analysis panel
- `ScenariosList` — Scenario list with create/delete

**Catalog:**
- `CatalogList` — Hardware table with bulk selection and delete
- `CatalogDialog` — Create/edit hardware form

**Layout:**
- `AppSidebar` — Fixed navigation sidebar with active state highlighting

**UI Primitives (`components/ui/`):**
22 shadcn/ui components: avatar, badge, button, card, checkbox, dialog, dropdown-menu, form, input, label, popover, progress, radio-group, scroll-area, select, separator, sheet, switch, table, tabs, textarea.

---

## Data Flow

### Read Path

```
User navigates to page
  → Server component (page.tsx) runs on server
  → Calls lib/services/data.ts or Prisma directly
  → Data returned from SQLite
  → Server component renders client component with data as props
  → Client component renders UI
```

### Write Path

```
User submits form (e.g., adds line item)
  → Client component calls server action from lib/actions.ts
  → Server action executes on server
  → Prisma writes to SQLite
  → revalidatePath() invalidates data cache
  → Next.js re-renders the page with fresh data
  → Client component receives updated props
```

### Calculation Path

```
Scenario data loaded (sites + line items + assumptions)
  → Aggregator.aggregateSite() called for each site
  → Projector.project() generates time series per line item
  → Results aggregated with baseline, cooling, utility costs
  → Projections passed to UI components for rendering
```

---

## Data Model

### Entity Relationships

```
Scenario (1) ────── (many) Site (1) ────── (many) LineItem (many) ────── (1) CatalogItem
   │
   └── (many) Assumption
```

### Models

**CatalogItem** — Hardware definition
| Field | Type | Description |
|-------|------|-------------|
| `name` | String (unique) | Display name |
| `category` | String | GPU, CPU, Storage, Network, Other |
| `vendor` | String? | Manufacturer |
| `model` | String? | Model identifier |
| `powerKw` | Float | Power draw per unit |
| `cost` | Float | Unit cost for capex |
| `capacityType` | String? | e.g., "GPU", "Cores", "TB" |
| `capacityVal` | Float? | Capacity per unit |
| `liquidCoolingCapacityKw` | Float? | Liquid cooling requirement |
| `airCoolingCapacityKw` | Float? | Air cooling requirement |
| `rackSpaceU` | Int? | Rack units required |
| `electricalCapacityKw` | Float? | Electrical draw |

**Scenario** — Planning container
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Scenario name |
| `description` | String? | Description |
| `isBase` | Boolean | Flag for baseline scenario |
| `horizonStart` | String? | Start quarter (e.g., "2024Q1") |
| `horizonEnd` | String? | End quarter (e.g., "2026Q4") |

**Site** — Data center location
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Site name |
| `totalItCapacityMw` | Float | IT power capacity |
| `electricalCapacityMw` | Float | Electrical infrastructure capacity |
| `liquidCoolingCapacityKw` | Float | Liquid cooling capacity |
| `airCoolingCapacityKw` | Float | Air cooling capacity |
| `totalRackSpaceU` | Int | Total rack space |
| `usedRackSpaceU` | Int | Currently used rack space |
| `electricityRatePerKwh` | Float | Utility rate |
| `electricityRatePerKwy` | Float? | Annual rate (alternative) |
| `inflationRate` | Float | Annual cost inflation |
| `baselineItPowerMw` | Float | Existing IT load |
| `baselineMechanicalMw` | Float | Existing mechanical load |
| `baselineLiquidCoolingKw` | Float | Baseline liquid cooling |
| `baselineAirCoolingKw` | Float | Baseline air cooling |
| `baselineElectricalKw` | Float | Baseline electrical |

**LineItem** — Hardware deployment
| Field | Type | Description |
|-------|------|-------------|
| `quantity` | Int | Number of units |
| `startQuarter` | String | Deployment start |
| `endQuarter` | String? | Deployment end |
| `projectTag` | String? | Project grouping label |
| `actualStartQuarter` | String? | Actual deployment start |
| `actualEndQuarter` | String? | Actual deployment end |
| `actualQuantity` | Int? | Actual units deployed |
| `varianceNotes` | String? | Variance explanation |

**Assumption** — Scenario-level setting
| Field | Type | Description |
|-------|------|-------------|
| `key` | String | e.g., "cooling_overhead", "inflation_rate" |
| `value` | Float | Numeric value |

---

## Calculation Engine

### Pipeline

```
LineItems + CatalogItems + Site + Assumptions
        │
        ▼
  Projector.project()
  (per line item → quarterly time series)
        │
        ▼
  Aggregator.aggregateSite()
  (sum line items + baseline + cooling + costs)
        │
        ▼
  SiteProjection[]
  (power, capacity, capex, utility per quarter)
```

### TimeUtils (`lib/engine/time.ts`)

Quarter string handling. All quarters use format `YYYYQN` (e.g., `2024Q1`).

- `parse("2024Q1")` → `{ year: 2024, q: 1 }`
- `format({ year, q })` → `"2024Q1"`
- `toIndex("2024Q1")` → Linear integer for arithmetic
- `fromIndex(n)` → `"YYYYQN"` string
- `diff(q1, q2)` → Quarter offset
- `add(q, n)` → Add quarters
- `generateRange(start, end)` → Array of all quarters in range

### Projector (`lib/engine/projector.ts`)

Converts a single line item into a quarterly time series.

- **Capex:** `quantity × cost` — recognized only in the deployment quarter (`startQuarter`)
- **Power:** `quantity × powerKw / 1000` (MW) — accumulates each quarter from `startQuarter` to `endQuarter`
- **Capacity:** `quantity × capacityVal` — tracked by `capacityType`

### Aggregator (`lib/engine/aggregator.ts`)

Combines all line items at a site and computes final metrics.

For each quarter in the horizon:

```
itPowerMw        = Σ(line item power)
totalItPowerMw   = itPowerMw + baselineItPowerMw
adjustedPowerMw  = totalItPowerMw × coolingOverhead
mechanicalLoadMw = (adjustedPowerMw - totalItPowerMw) + baselineMechanicalMw
totalFacilityPowerMw = adjustedPowerMw + mechanicalLoadMw
availablePowerMw = totalItCapacityMw - totalItPowerMw
remainingPowerMw = totalItCapacityMw - adjustedPowerMw
utilityCost      = adjustedPowerMw × 1000 × 2160 × rate × (1 + inflation)^(quarterOffset / 4)
capex            = Σ(deployment capex for this quarter)
```

Output: `SiteProjection[]` — one per quarter.

### CapacityAnalyzer (`lib/engine/capacity.ts`)

Checks four constraint types against site limits:

| Constraint | Limit | Usage |
|-----------|-------|-------|
| Power | `totalItCapacityMw` | `totalItPowerMw` |
| Electrical | `electricalCapacityMw` | `totalFacilityPowerMw` |
| Cooling | `liquidCoolingCapacityKw + airCoolingCapacityKw` | `mechanicalLoadMw × 1000` |
| Rack | `totalRackSpaceU` | `usedRackSpaceU` |

Status thresholds: OK (<80%), Warning (80–100%), Critical (≥100%).

### ProjectAggregator (`lib/engine/project.ts`)

Groups line items by `projectTag` and calculates per-project summaries: total capex, peak power, quarter range, site list.

### TimelineEngine (`lib/engine/timeline.ts`)

Generates Gantt-style timeline data from line items. Assigns colors by category, groups by project lane.

### WhatIfEngine (`lib/engine/whatif.ts`)

Applies hypothetical changes (add/remove/modify line items, assumptions, sites) without writing to the database. Calculates impact deltas (power, capex, utility) and capacity violations. Suggests cheaper hardware alternatives.

---

## Key Design Decisions

### SQLite Over PostgreSQL

- Single-file database — trivial backup, no server to manage
- Sufficient for the expected scale (planning tool, not transactional)
- Works seamlessly with Docker volumes and dev containers

### Server Actions Over API Routes

- No need to define `/api/*` endpoints
- Type-safe calls from client components
- Built-in CSRF protection in Next.js

### Pure Engine Functions

- All calculations in `lib/engine/` have zero I/O
- Easy to unit test with Vitest
- Can be reused in scripts, cron jobs, or future APIs

### Quarter-Based Granularity

- Planning happens at quarterly resolution, not daily
- Matches typical data center deployment cadence
- Simplifies calculations and UI

### Cooling as Multiplier (Not PUE)

- `cooling_overhead` multiplier (e.g., 1.35) is simpler than PUE
- Applied as: `adjustedPower = totalITPower × coolingOverhead`
- Configurable per scenario via assumptions

---

## Deployment

### Next.js Standalone Output

`next.config.ts` is configured with `output: "standalone"`. The production build outputs a minimal self-contained directory in `.next/standalone/` that includes only the files needed to run the app.

### Docker

`docker-compose.yml` defines three services:
- **web** — Next.js app (build from Dockerfile)
- **db** — SQLite volume mount
- **adminer** — Database administration GUI

The Dockerfile uses multi-stage builds with `node:22-alpine`.

### Production Checklist

- [ ] Set `DATABASE_URL` to production path
- [ ] Run `npx prisma migrate deploy` (not `migrate dev`)
- [ ] Build with `npm run build`
- [ ] Serve with `npm start` or Docker
