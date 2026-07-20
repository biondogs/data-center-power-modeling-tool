---
type: Documentation
title: Data Model
description: Prisma schema for the data center power modeling tool. Five models (CatalogItem, Scenario, Site, LineItem, Assumption) with entity relationships and engine calculation formulas.
resource: /prisma/schema.prisma
tags: [data-model, prisma, schema, calculations]
---

# Data Model

The application uses **Prisma 6** with an **SQLite** database (`prisma/dev.db`). The schema defines five models that represent the planning domain.

## Entity-Relationship Diagram

```
Scenario
 ├── [Site] → [LineItem] → CatalogItem
 └── [Assumption]
```

A **Scenario** is a top-level planning container. It contains one or more **Site** records (data center locations). Each Site has **LineItem** records (hardware deployment schedules) that reference **CatalogItem** definitions. Scenarios also carry **Assumption** records for scenario-wide parameters.

These models implement the [core concepts](quickstart.md) of scenarios, sites, line items, and quarterly granularity described in the quickstart.

## Models

### `CatalogItem`

Global hardware catalog — the shared dictionary of equipment types.

| Field | Purpose |
|---|---|
| `category` | One of: GPU, CPU, Storage, Network |
| `powerKw` | Per-unit power draw (kW) |
| `cost` | Per-unit capital cost |
| `capacityType` / `capacityVal` | Compute capacity metric (e.g., TFLOPS, cores) |
| `liquidCoolingKw` / `airCoolingKw` | Cooling resource requirements |
| `rackSpaceU` | Rack space consumption (U) |
| `electricalCapacityKw` | Electrical infrastructure draw |

### `Scenario`

Top-level planning sandbox.

| Field | Purpose |
|---|---|
| `name` | Human-readable scenario name |
| `description` | Free-text notes |
| `horizonStart` / `horizonEnd` | Time window in `YYYYQ#` format |
| `isBase` | Flag marking the baseline/reference scenario |

### `Site`

A data center location within a scenario.

| Field | Purpose |
|---|---|
| `name` | Site identifier (e.g., BayView, Mt.Wash) |
| `totalItCapacityMw` | Total IT power capacity (MW) |
| `electricalCapacityMw` | Total electrical facility capacity (MW) |
| `liquidCoolingKw` / `airCoolingKw` | Cooling capacity |
| `totalRackSpaceU` | Available rack space |
| `baselineItPowerKw` | Pre-existing legacy IT load (kW) |
| `baselineElectricalKw` | Pre-existing electrical load (kW) |
| `utilityRate` | Electricity rate ($/kWh) |
| `inflationRate` | Annual rate increase |

### `LineItem`

A hardware deployment schedule row.

| Field | Purpose |
|---|---|
| `startQuarter` / `endQuarter` | Active window in `YYYYQ#` format |
| `quantity` | Number of units |
| `projectTag` | Optional grouping label |
| `actualQuantity` | Actual deployed count (for variance tracking) |

**Relationships**: belongs to `Site`, belongs to `CatalogItem`.

### `Assumption`

Scenario-wide key-value parameters.

| Field | Purpose |
|---|---|
| `key` | Parameter name (e.g., `cooling_overhead`, `inflation_rate`) |
| `value` | Numeric value |

**Relationships**: belongs to `Scenario`.

## Engine Calculation Formulas

The [engine modules](architecture/overview.md) compute projections from these models using the following formulas:

**Per-line-item, per-quarter** (Projector):
```
powerMw = quantity × catalogItem.powerKw / 1000
capex = quantity × catalogItem.cost    (only in deployment quarter)
```

**Per-site, per-quarter** (Aggregator):
```
totalItPowerMw = baselineItPowerKw/1000 + Σ(lineItem.powerMw)
mechanicalLoadKw = totalItPowerMw × 1000 × cooling_overhead - totalItPowerKw × 1000
facilityPowerMw = totalItPowerMw × cooling_overhead
remainingItCapacityMw = site.totalItCapacityMw - totalItPowerMw
utilityCost = totalFacilityPowerMw × utilityRate × 24 × 30 × 3  (per quarter, with inflation)
```

**Constraint ratios** (CapacityAnalyzer):
```
powerRatio = totalItPowerMw / totalItCapacityMw
electricalRatio = totalFacilityPowerMw / electricalCapacityMw
coolingRatio = mechanicalLoadKw / (liquidCoolingKw + airCoolingKw)
rackRatio = usedRackSpaceU / totalRackSpaceU
```

Status thresholds: `ok` (≤80%), `warning` (>80% and <100%), `critical` (≥100%).

## Source Files

| Evidence | Path |
|---|---|
| Prisma schema | `prisma/schema.prisma` |
| Database migrations | `prisma/migrations/` |
| Seed data | `prisma/seed.ts` |
| DB client | `lib/db.ts` |
| Server actions | `lib/actions.ts` |