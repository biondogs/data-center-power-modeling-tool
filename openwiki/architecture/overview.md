---
type: Documentation
title: Architecture Overview
description: Next.js 16 data center power modeling app architecture. Covers routing, engine modules, ScenarioView decomposition, and server-client data flow.
resource: /app/
tags: [architecture, routing, engine, components]
---

# Architecture Overview

## App Routing (Next.js App Router)

| Route | Server Page | Client Component | Purpose |
|---|---|---|---|
| `/` | `app/page.tsx` | `<DashboardView>` | Dashboard — scenario projections and catalog summary |
| `/catalog` | `app/catalog/page.tsx` | `<CatalogList>` | Hardware/equipment catalog browser |
| `/scenarios` | `app/scenarios/page.tsx` | `<ScenariosList>` | Scenario index |
| `/scenarios/[id]` | `app/scenarios/[id]/page.tsx` | `<ScenarioView>` | Single scenario detail (dynamic route) |
| `/scenarios/compare` | `app/scenarios/compare/page.tsx` | `<ScenarioComparisonClient>` | Side-by-side scenario comparison |

Shared layout (`app/layout.tsx`) provides an `<AppSidebar>` (responsive sidebar), Inter font, Tailwind CSS globals, and a max-7xl container.

## Engine Modules (`lib/engine/`)

The engine is a set of **pure, stateless utility classes** with no framework dependencies. All heavy computation happens server-side in the page components.

| Module | Responsibility |
|---|---|
| **Projector** (`projector.ts`) | Lowest-level calculation — one line item × one quarter. Determines if the item is active, computes `powerMw = qty × powerKw / 1000`, front-loads capex in the deployment quarter. |
| **Aggregator** (`aggregator.ts`) | Core calculation — iterates all quarters per site, sums line-item power, applies cooling overhead multiplier, computes mechanical load, utility cost (with inflation), and remaining capacity. Provides `calculateSummary()`. |
| **CapacityAnalyzer** (`capacity.ts`) | Constraint analysis — evaluates four constraint types (power, electrical, cooling, rack space) per quarter. Assigns `ok` / `warning` (>80%) / `critical` (≥100%). Pre-flight check for new deployments. |
| **TimelineEngine** (`timeline.ts`) | Gantt-chart data — groups line items by project tag into lanes, converts quarters to CSS percentage positioning. |
| **WhatIfEngine** (`whatif.ts`) | Ad-hoc simulation — applies mutations (add/modify/remove line items, change assumptions, modify sites) to cloned data, re-aggregates, computes delta impact vs. base. Suggests cheaper alternatives. |
| **ScenarioComparison** (`comparison.ts`) | Two-scenario delta — quarter-by-quarter comparison of adjusted power, peak power delta, total capex/utility deltas. |
| **time.ts** | Quarter arithmetic — parse/generate `YYYYQ#` formats, range generation, offset calculations. |
| **project.ts** | Higher-level project orchestration. |

**Execution order** in page components:

```
Projector.projectLineItem()  (per line item, per quarter)
    ↓
Aggregator.aggregateSite()  (per site, sums + cooling + costs)
    ↓
CapacityAnalyzer  (optional, per site constraint check)
```

## ScenarioView Decomposition

`<ScenarioView>` (`components/scenario/ScenarioView.tsx`) is the master client component shell for the scenario detail page:

| Concern | Sub-component | File |
|---|---|---|
| Header + What-If trigger | `<ScenarioHeader>` | `ScenarioHeader.tsx` |
| Tab navigation + site selector | `<ScenarioTabBar>` | `ScenarioTabBar.tsx` |
| Planning + analysis + reports tabs | `<PlanAnalysisReportsTabs>` | `PlanAnalysisReportsTabs.tsx` |
| Timeline + sites tabs | `<ProjectTimelineSitesTabs>` | `ProjectTimelineSitesTabs.tsx` |
| Capacity + history + settings tabs | `<CapacityHistorySettingsTabs>` | `CapacityHistorySettingsTabs.tsx` |
| What-If modal overlay | `<WhatIfWrapper>` | `WhatIfWrapper.tsx` |

**State management** (all local, `useState`): `activeSiteId`, `activeTab`, `whatIfOpen`. The server computes per-site `SiteProjection[]` arrays; ScenarioView selects the active projection and passes it to children.

**Other scenario sub-components**: `<CreateScenarioDialog>`, `<DeleteScenarioButton>`, `<ScenarioSettingsEditor>`, `<SiteSettingsEditor>`, `<CapacityGauge>`, `<CapacityAlertPanel>`, `<HistoricalTrackingPanel>`, `<MultiSiteSummary>`, `<TimelineView>`, `<ComparisonTable>`, `<ScenarioSelector>`, `<ProjectCard>`, `<ProjectPortfolioView>`, `<WhatIfDialog>`.

## Data Flow

```
Prisma (SQLite)
    ↑
Server Pages (fetch data)
    ├── Aggregator.aggregateSite()  ← core projection logic
    │     └── Projector.projectLineItem()  ← per-item quarterly math
    │
    ├── CapacityAnalyzer  ← constraint checking
    ├── WhatIfEngine  ← ad-hoc mutations + impact
    ├── TimelineEngine  ← Gantt data
    └── ScenarioComparison  ← two-way delta
    ↓
Client Components (UI + interaction)
    ├── DashboardView  ← home dashboard
    ├── ScenarioView  ← detail page shell (6 sub-components)
    ├── ScenarioComparisonClient  ← compare page
    ├── CatalogList  ← catalog
    └── ScenariosList  ← scenario index
```

Server pages handle all data fetching and aggregation. The client receives pre-computed projection arrays and manages only UI state (tabs, site selection, modal toggles). The engine modules **[depend on the data model](data-model.md)** — the Aggregator queries `Site`, `LineItem`, `CatalogItem`, and `Assumption` models to perform its calculations.

Detailed architecture notes are also available in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).