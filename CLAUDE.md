# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Data Center Capacity & Power Modeling Tool** built with Next.js 16, React 19, TypeScript, and Prisma. It allows users to create scenarios for modeling power consumption, capacity, and costs across multiple data center sites over time.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Database operations
npx prisma migrate dev    # Create/run migrations
npx prisma db seed        # Run seed script
npx prisma studio         # Open database GUI

# Type checking
npx tsc --noEmit
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui
- **Database**: SQLite via Prisma ORM
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

### Directory Structure

```
app/                    # Next.js App Router
├── page.tsx           # Dashboard (scenarios list)
├── layout.tsx         # Root layout with sidebar
├── globals.css        # Tailwind v4 CSS variables
├── catalog/           # Hardware catalog page
└── scenarios/         # Scenario detail pages
    └── [id]/

components/
├── ui/                # shadcn/ui components (18+ components)
├── layout/            # AppSidebar navigation
├── catalog/           # Catalog dialog and table
└── scenario/          # Scenario view, dialogs, charts
    ├── AddLineItemDialog.tsx      # Create new deployment
    ├── EditLineItemDialog.tsx     # Edit existing deployment
    ├── DeleteScenarioButton.tsx   # Delete scenario action button
    ├── SitePlanEditor.tsx         # Deployment plan table
    ├── ScenarioView.tsx           # Main scenario tabs
    ├── PowerChart.tsx             # Power projections chart
    ├── ReportTable.tsx            # Summary report table
    └── ScenarioSummaryReport.tsx  # Executive summary

lib/
├── db.ts              # Prisma client singleton
├── utils.ts           # CN utility for Tailwind
├── actions.ts         # Server actions (mutations)
├── services/
│   └── data.ts        # Data fetching functions
└── engine/            # Calculation engine
    ├── time.ts        # Quarter/Time utilities
    ├── projector.ts   # Line item projection
    └── aggregator.ts  # Site-level aggregation

prisma/
├── schema.prisma      # Database schema
├── seed.ts            # Initial seed data
└── migrations/        # Prisma migrations
```

### Data Model (Entity Relationships)

```
CatalogItem          Scenario              Site               LineItem
  └─ used in ──────────► └─ has ──────────► └─ contains ──────► linked to CatalogItem
                         └─ has ──────────► Assumptions
```

- **CatalogItem**: Hardware definitions (GPU/CPU/Storage) with power, cost, capacity
- **Scenario**: Planning container with sites and assumptions
- **Site**: Data center location with power limits and baseline loads
- **LineItem**: Deployment record linking catalog items to sites with timelines
- **Assumption**: Key-value pairs (inflation_rate, cooling_overhead, electricity_rate_usd_kwh)

### Calculation Engine

The projection engine calculates power/costs quarterly:

1. **Projector**: Converts line items to time series
   - Uses `startQuarter/endQuarter` to determine active periods
   - Calculates capex only in deployment quarter
   - Returns power, capacity, capex per quarter

2. **Aggregator**: Combines site data
   - Sums all line items for each quarter
   - Adds baseline power from site
   - Applies cooling overhead multiplier
   - Calculates utility costs with inflation

3. **TimeUtils**: Quarter string utilities (`2024-Q1` format)

Key formulas:
- `adjustedPowerMw = (itPowerMw + baseline) * coolingOverhead`
- `utilityCost = (adjustedPowerMw * 1000) * hours_per_quarter * rate * inflation_factor`
- `capex = quantity * catalogItem.cost` (in first active quarter only)

### UI Patterns

- **shadcn/ui v4**: All components in `@/components/ui/`
- **Tailwind v4**: CSS variable-based theming in `globals.css`
- **Color scheme**: Neutral base with OKLCH color system
- **Navigation**: Fixed sidebar at `md:w-64 lg:w-72`
- **Forms**: React Hook Form + Zod (see `CatalogDialog.tsx`, `CreateScenarioDialog.tsx`)

### Server Actions Pattern

All mutations use Next.js Server Actions in `lib/actions.ts`:
- Form submissions use `FormData` (e.g., `createScenario`)
- Object passing for complex data (e.g., `addLineItem`, `updateLineItem`)
- `revalidatePath()` called after mutations
- `redirect()` used for navigation after create

**Line Item Actions:**
- `addLineItem(siteId, data)` - Create new deployment line item
- `updateLineItem(id, data)` - Edit existing line item (quantity, dates, equipment)
- `deleteLineItem(id)` - Remove line item from deployment plan

**Scenario Actions:**
- `createScenario(formData)` - Create new scenario (or clone existing)
- `deleteScenario(id)` - Delete scenario (base scenarios protected)
- `updateScenarioAssumptions(scenarioId, data)` - Update cooling/inflation assumptions

## Key Conventions

### Path Aliases
```
@/components   → components/
@/lib          → lib/
@/hooks        → hooks/
```

### Type Safety
- All server actions typed with explicit parameter types
- Prisma generated types used throughout (`CatalogItem`, `LineItem`, etc.)
- Props interfaces defined inline for React components

### Database Services
Data fetching functions in `lib/services/data.ts`:
- `getScenarios()` - List all scenarios (with sites, lineItems, assumptions, counts)
- `getScenarioById(id)` - Full scenario with sites/lineItems/catalog
- `getCatalogItems()` - All catalog items sorted by name

### Dashboard Components (`components/dashboard/`)
- `DashboardView.tsx` - Main dashboard with scenario selector, Analysis/Reports tabs
- `DashboardSummary.tsx` - Aggregate stats across all scenarios (peak power, total costs)
- `ScenarioAggregateChart.tsx` - Multi-scenario power comparison chart

**Dashboard Layout:**
- Aggregate summary cards (top) - totals across all scenarios
- Scenario Analysis card with dropdown selector
  - Analysis tab - PowerChart for selected scenario
  - Reports tab - ReportTable for selected scenario
- Multi-scenario comparison chart (bottom)
