# Data Center Capacity & Power Modeling Tool — User Guide

> Plan, model, and analyze data center capacity, power, and costs across multiple sites over quarterly time horizons.

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [Navigating the Application](#navigating-the-application)
5. [Hardware Catalog](#hardware-catalog)
6. [Scenarios](#scenarios)
7. [Sites](#sites)
8. [Capacity Planning](#capacity-planning)
9. [Financial Projections](#financial-projections)
10. [What-If Analysis](#what-if-analysis)
11. [Scenario Comparison](#scenario-comparison)
12. [Export](#export)
13. [Key Formulas](#key-formulas)
14. [Deployment & Operations](#deployment--operations)
15. [FAQ](#faq)

---

## Overview

This tool enables data center operators, capacity planners, and infrastructure teams to:

- **Model** data center deployments across multiple physical sites
- **Track** power utilization, rack space, and electrical capacity in real time
- **Project** utility costs with inflation-adjusted electricity rates over quarterly horizons
- **Analyze** "what-if" changes to hardware deployments before committing them
- **Compare** multiple planning scenarios side by side

### Architecture

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Frontend** | React, shadcn/ui, Tailwind CSS v4, Recharts |
| **Forms** | React Hook Form + Zod validation |
| **Database** | SQLite via Prisma ORM |
| **Testing** | Vitest |
| **Deployment** | Docker / standalone Next.js output |

---

## Getting Started

### Prerequisites

- **Node.js** 20+ 
- **npm** (or pnpm/yarn)
- **Docker** (optional, for containerized deployment)

### Quick Start — Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Push Prisma schema and seed sample data
npx prisma db push
npm run db:seed

# Start the development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Quick Start — Docker

```bash
docker compose up --build
```

The application will be available at `http://localhost:3000`.

### Project Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test` | Run all tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint check |
| `npm run build:binary` | Build + pack with Caxa |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run via Docker Compose |
| `npx prisma db push` | Sync schema to database |
| `npm run db:seed` | Seed database with sample data |

---

## Core Concepts

### Scenario

A **scenario** is a complete, self-contained planning exercise. Each scenario has:

- **Name & Description** — identifying labels
- **Time Horizon** — `horizonStart` and `horizonEnd` (e.g., `2026Q1` → `2028Q4`)
- **Base Date** — the reference point for quarterly offsets
- **Status** — `draft`, `active`, or `archived`
- **Sites** — one or more data center locations within this scenario
- **Assumptions** — scenario-level parameters (cooling overhead, electricity inflation)

Scenarios are **isolated from each other**. Changing one scenario never affects another.

### Quarter Format

All time references use a `YYYYQ#` string format:

| String | Meaning |
|---|---|
| `2026Q1` | January–March 2026 |
| `2026Q2` | April–June 2026 |
| `2027Q4` | October–December 2027 |

The engine computes quarter offsets, generates ranges, and performs date arithmetic using this format.

### Assumptions

Each scenario carries scenario-wide assumptions that drive all calculations:

| Assumption Key | Default | Description |
|---|---|---|
| `cooling_overhead` | `1.35` | Multiplier applied to IT power to compute total mechanical (cooling) load |
| `electricity_cost_inflation` | `0.03` | Annual inflation rate applied to utility rates per quarter |
| `base_electricity_rate` | Varies per site | Base $/kWh for each site's utility provider |

---

## Navigating the Application

### Dashboard (`/`)

The landing page shows **all scenarios** as cards with key metrics:

- Total IT power (MW)
- Total capex ($M)
- Peak utility cost ($M/quarter)
- Scenario status and quarter count

Actions available: **Create New**, **Clone**, **Delete**.

### Scenario Detail (`/scenarios/[id]`)

The main workspace for a single scenario. Contains:

- **KPI Cards** — live summary metrics
- **Sites Table** — overview of all sites in the scenario
- **Financial Charts** — capex, utility costs, total power over time (Recharts)
- **Capacity Gauge** — overall utilization across all sites

### Catalog (`/catalog`)

Browse and manage reusable hardware definitions. See [Hardware Catalog](#hardware-catalog) below.

### Scenario Comparison (`/scenarios/compare`)

Select two or more scenarios to view side-by-side comparisons. See [Scenario Comparison](#scenario-comparison) below.

---

## Hardware Catalog

The **Hardware Catalog** is a global, shared repository of hardware definitions. Items in the catalog are reusable across all scenarios.

### Catalog Item Properties

| Field | Type | Description |
|---|---|---|
| **Name** | String (unique) | Human-readable identifier (e.g., "H100 8-GPU Server") |
| **Category** | String | `GPU`, `CPU`, `Storage`, `Network` |
| **Model** | String (optional) | Specific model (e.g., "H100") |
| **Vendor** | String (optional) | Manufacturer (e.g., "Nvidia", "Lenovo", "Dell", "SMC") |
| **Power (kW)** | Float | Power draw per server/unit in kilowatts |
| **Cost ($)** | Float | Capital cost per unit |
| **Capacity Type** | String (optional) | Unit of capacity: `GPU`, `Cores`, `TB` |
| **Capacity Value** | Float (optional) | Quantity of the capacity type (e.g., 8 GPUs) |
| **Liquid Cooling (kW)** | Float (optional) | Liquid cooling power consumed per unit |
| **Air Cooling (kW)** | Float (optional) | Air cooling power consumed per unit |
| **Rack Space (U)** | Int (optional) | Rack units consumed per unit |
| **Electrical Capacity (kW)** | Float (optional) | Electrical circuit capacity required per unit |

### Managing Catalog Items

1. **Add** — Click **New Item** in the Catalog page. Fill in all required fields.
2. **Edit** — Click the edit icon on any existing item to modify its properties.
3. **Delete** — Remove an item that is not currently referenced by any line item.

### Best Practices

- Define one catalog item per **hardware model variant** (e.g., separate items for H100 8-GPU vs. H200 8-GPU)
- Keep power values as **measured or spec-sheet values** (not estimates)
- Include cooling and rack space values for accurate capacity planning

---

## Scenarios

### Creating a Scenario

1. From the Dashboard, click **New Scenario**
2. Fill in:
   - **Name** (required) — e.g., "2026–2028 Phoenix Expansion"
   - **Description** (optional) — purpose and scope
   - **Horizon Start** — first planning quarter (e.g., `2026Q1`)
   - **Horizon End** — last planning quarter (e.g., `2028Q4`)
   - **Base Date** — reference quarter for offset calculations
3. Click **Create**

### Cloning a Scenario

Cloning creates a complete copy of a scenario (sites, line items, assumptions) so you can branch and explore alternatives without modifying the original.

1. Open the source scenario
2. Click **Clone**
3. Enter a new name for the clone
4. The clone is created with `draft` status

### Editing a Scenario

- **Name, Description, Horizon**: Edit directly from the scenario header
- **Assumptions**: Edit via the What-If Analysis dialog → Assumptions tab, or from the scenario settings panel
- **Status**: Toggle between `draft`, `active`, and `archived`

### Deleting a Scenario

1. Click the **Delete** button (trash icon)
2. Confirm the deletion in the modal dialog

> ⚠️ Deletion is **permanent** and cannot be undone. All sites, line items, and assumptions are cascade-deleted. Consider **archiving** or **cloning** first.

---

## Sites

A **Site** represents a physical data center location within a scenario.

### Site Properties

| Field | Description |
|---|---|
| **Name** | Site identifier (e.g., "Phoenix DC-1", "Frankfurt Edge") |
| **Location** | City/region label |
| **Total IT Capacity (MW)** | Maximum IT power the site can support |
| **Total Electrical Capacity (MW)** | Total power available from utility (IT + cooling + overhead) |
| **Rack Capacity (U)** | Total rack unit space available |
| **Base Electricity Rate ($/kWh)** | Starting utility rate before inflation adjustments |

### Managing Sites

1. From a scenario detail page, click **Add Site**
2. Fill in site properties and electrical characteristics
3. **Edit** an existing site by clicking its edit icon
4. **Delete** a site that has no active line items

### Site Plan Editor

The **Site Plan Editor** provides a structured view of a single site's deployments:

- Lists all line items assigned to the site
- Shows per-quarter deployment schedules
- Displays power and capex summaries
- Allows inline editing of quantities, start/end quarters

---

## Capacity Planning

The capacity engine analyzes four constraint types per site and flags violations:

### Constraint Types

| Constraint | Description | Alert Threshold |
|---|---|---|
| **Power** | IT power vs. IT capacity (MW) | Warning: ≥ 80%, Critical: > 100% |
| **Cooling** | Total mechanical load (IT × cooling overhead) vs. electrical capacity | Warning: ≥ 80%, Critical: > 100% |
| **Rack** | Total rack U consumed vs. rack capacity | Warning: ≥ 80%, Critical: > 100% |
| **Electrical** | Total electrical draw vs. site electrical capacity | Warning: ≥ 80%, Critical: > 100% |

### Capacity Status

Each site receives an overall status:

- **🟢 OK** — All constraints are below warning thresholds
- **🟡 Warning** — At least one constraint is between 80–100% utilized
- **🔴 Critical** — At least one constraint is exceeded (> 100%)

### What's Shown

- **Remaining Power (MW)** — `totalITCapacityMW - adjustedPowerMW`
- **Utilization %** — per constraint, per quarter
- **Quarters Over Limit** — specific quarters where a constraint is violated
- **Peak Quarter** — the quarter with highest utilization

---

## Financial Projections

### Capex Tracking

Capital expenditure is tracked per line item per quarter:

```
Quarterly Capex = quantity_deployed_this_quarter × unit_cost
```

- Capex is recognized in the **start quarter** of each deployment
- If a deployment spans multiple quarters, capex can be distributed proportionally
- The scenario-level capex chart shows cumulative and quarterly spending

### Utility Cost Projections

Electricity cost is projected quarterly with inflation adjustment:

```
Quarterly Utility Cost = totalPowerMW × 1000 × 2160 × ratePerKWh × (1 + inflation)^(quarterOffset / 4)
```

Where:

| Variable | Source |
|---|---|
| `totalPowerMW` | IT power + cooling overhead for the site |
| `1000` | Conversion from MW to kW |
| `2160` | Hours per quarter (90 days × 24 hours) |
| `ratePerKWh` | Site-specific base electricity rate |
| `inflation` | Scenario assumption: `electricity_cost_inflation` |
| `quarterOffset` | Number of quarters from the base date |

### Total Cost of Ownership

The TCO view combines:

- **Cumulative Capex** — total hardware investment
- **Cumulative Utility Costs** — total electricity spend
- **Per-Quarter Breakdown** — see the mix of capex vs. opex each quarter

---

## What-If Analysis

The **What-If Analysis** dialog lets you test hypothetical changes against a scenario **without modifying the actual data**. Changes are calculated in real-time and shown as deltas.

### Accessing What-If

1. Open any scenario
2. Click **What-If Analysis** (lightning bolt icon)

### Change Types

| Tab | Action |
|---|---|
| **Add Item** | Add a new line item (select catalog item, quantity, site, quarters) |
| **Modify** | Adjust quantity, start/end quarter of an existing line item |
| **Assumptions** | Temporarily change cooling overhead or electricity inflation |
| **Capacity** | Test different site capacity limits |

### Results Shown

- **Impact Summary** — delta in peak power, total capex, and utility costs
- **Updated Projections** — revised quarterly charts with original overlaid
- **Change Log** — list of all pending changes with descriptions

### Exporting What-If Results

1. Make your changes in the What-If dialog
2. Click **Export Analysis**
3. A JSON file is downloaded containing:
   - Original scenario snapshot
   - All applied changes
   - Computed projections and deltas
   - Timestamp

> 💡 What-If changes are **never auto-saved**. Use the export feature to document your analysis, or manually apply changes to create a new cloned scenario.

---

## Scenario Comparison

Compare two or more scenarios side by side to evaluate alternatives.

### How to Compare

1. Navigate to `/scenarios/compare`
2. Select scenarios from the dropdown
3. View the comparison table

### Comparison Dimensions

| Metric | Description |
|---|---|
| **Total IT Power (MW)** | Peak power draw across all sites |
| **Total Electrical (MW)** | Peak including cooling overhead |
| **Total Capex ($M)** | Cumulative capital spend |
| **Peak Utility ($M/q)** | Highest quarterly utility cost |
| **Avg Utility ($M/q)** | Average quarterly utility cost |
| **Sites Count** | Number of sites in the scenario |
| **Line Items Count** | Total number of deployment line items |
| **Horizon** | Time span of the scenario |
| **Cooling Overhead** | Scenario assumption |
| **Electricity Inflation** | Scenario assumption |

---

## Export

### Export Scenario Data as JSON

From any scenario page, click **Export** to download a complete JSON snapshot.

The export includes:

- Scenario metadata (name, description, horizon, assumptions)
- All sites with their electrical characteristics
- All line items with deployment schedules and actuals tracking
- All catalog item references
- Computed projections per quarter

### Exported JSON Structure

```json
{
  "scenario": {
    "id": "...",
    "name": "...",
    "description": "...",
    "horizonStart": "2026Q1",
    "horizonEnd": "2028Q4",
    "status": "active",
    "assumptions": [
      { "key": "cooling_overhead", "value": 1.35 },
      { "key": "electricity_cost_inflation", "value": 0.03 }
    ]
  },
  "sites": [
    {
      "id": "...",
      "name": "...",
      "totalItCapacityMw": 50.0,
      "totalElectricalCapacityMw": 75.0,
      "totalRackCapacityU": 1000,
      "baseElectricityRate": 0.08,
      "lineItems": [...]
    }
  ],
  "catalogItems": [...],
  "exportedAt": "2026-01-15T12:00:00Z"
}
```

---

## Key Formulas

All calculations are performed by the **Calculation Engine** (`lib/engine/`).

### IT Power

```
IT Power (MW) = Σ(lineItem.quantity × lineItem.catalogItem.powerKw) / 1000
```

Summed per line item, per quarter (only for quarters within the item's deployment window).

### Total Mechanical Load (Cooling)

```
Total Power (MW) = IT Power (MW) × cooling_overhead
```

The `cooling_overhead` assumption defaults to `1.35` (i.e., 35% overhead for cooling and supporting infrastructure).

### Remaining IT Capacity

```
Remaining IT Power (MW) = totalITCapacityMw - IT Power (MW)
```

### Quarterly Utility Cost

```
Utility Cost = Total Power (MW) × 1000 × 2160 × ratePerKWh × (1 + inflationRate)^(quarterOffset / 4)
```

- `1000` converts MW to kW
- `2160` = hours per quarter (90 × 24)
- `quarterOffset` = quarters elapsed since `baseDate`
- Inflation is applied **quarterly** (annual rate ÷ 4 per quarter)

### Quarterly Capex

```
Capex = quantity × unitCost
```

Recognized in the deployment's `startQuarter` (or spread across quarters if the item has a multi-quarter deployment).

### Capacity Utilization

```
Power Utilization % = IT Power (MW) / totalITCapacityMw
Cooling Utilization % = Total Power (MW) / totalElectricalCapacityMw
Rack Utilization % = Total U Used / totalRackCapacityU
```

---

## Deployment & Operations

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `file:./dev.db` | SQLite database path |

Create `.env` from the example:

```bash
cp .env.example .env
```

### Database

- **Development**: SQLite (`dev.db`), zero configuration
- **Schema Management**: `npx prisma db push` to sync changes
- **Seeding**: `npm run db:seed` loads sample data (H100 servers, sample sites, demo scenario)

### Docker Deployment

The project includes `Dockerfile` and `docker-compose.yml`:

```dockerfile
# Multi-stage build
# Stage 1: Build the Next.js app
# Stage 2: Production runtime with standalone output
# Exposes port 3000
```

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports: ["3000:3000"]
    volumes: [./data:/app/data]  # Persist SQLite database
```

### Production Checklist

- [ ] Set `DATABASE_URL` to a production-grade SQLite path or migrate to PostgreSQL
- [ ] Set `NODE_ENV=production`
- [ ] Run `npm run build`
- [ ] Run `npx prisma db push`
- [ ] Run `npm run start` (or use Docker Compose)
- [ ] Configure reverse proxy / SSL termination (e.g., nginx, Caddy)
- [ ] Set up database backups (SQLite file backups or PostgreSQL pg_dump)

---

## FAQ

### Q: Can I use multiple databases?

The current setup uses SQLite via Prisma. To switch to PostgreSQL, update the `datasource` in `prisma/schema.prisma` and set `DATABASE_URL` to a PostgreSQL connection string.

### Q: How do I add a new hardware type?

Add it to the **Hardware Catalog** (`/catalog`). Set the category to `GPU`, `CPU`, `Storage`, or `Network` and fill in power, cost, and capacity specs.

### Q: What happens when I exceed capacity?

The Capacity Analyzer flags the site as **Critical** and lists the specific quarters where constraints are exceeded. Charts show red zones, and KPI badges change to red. The tool does **not** prevent you from deploying — it alerts you.

### Q: Can I track actuals vs. plan?

Yes. Line items support **actuals tracking** fields:

- `actualStartQuarter`
- `actualEndQuarter`
- `actualQuantity`
- `varianceNotes`

These allow you to compare planned deployments against what was actually deployed.

### Q: How does inflation affect my projections?

The `electricity_cost_inflation` assumption (default 3% annual) compounds quarterly. A site with $100K/quarter base utility cost in the base quarter will cost approximately $107.5K/quarter one year later.

### Q: Is the What-If analysis saved?

No. What-If changes exist only in the browser session. Export the analysis as JSON or clone the scenario and apply changes manually to persist them.

---

## File Structure Reference

```
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Dashboard
│   ├── catalog/page.tsx        # Hardware Catalog
│   ├── scenarios/
│   │   ├── [id]/page.tsx       # Scenario detail page
│   │   └── compare/            # Scenario comparison
│   └── layout.tsx              # Root layout
├── components/
│   ├── catalog/                # Catalog UI components
│   ├── scenario/               # Scenario UI components
│   │   ├── SitePlanEditor.tsx  # Site deployment editor
│   │   └── DeleteScenarioButton.tsx
│   ├── whatif/
│   │   └── WhatIfDialog.tsx    # What-if analysis modal
│   └── ui/                     # shadcn/ui primitives
├── lib/
│   ├── engine/                 # Calculation engine (pure functions)
│   │   ├── index.ts            # Engine entry point
│   │   ├── capacity.ts         # Capacity constraint analysis
│   │   ├── aggregator.ts       # Line item aggregation
│   │   ├── projector.ts        # Financial projection engine
│   │   ├── time.ts             # Quarter date utilities
│   │   └── whatif.ts           # What-if change simulation
│   ├── actions.ts              # Server actions (CRUD)
│   ├── db.ts                   # Prisma client instance
│   └── useServerAction.ts      # Client-side server action hook
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Sample data seeder
├── public/                     # Static assets
├── Dockerfile                  # Docker build config
├── docker-compose.yml          # Docker Compose setup
├── next.config.ts              # Next.js config (standalone output)
└── package.json
```

---

## Support & Issues

For bugs, feature requests, or questions, file an issue in the project repository.

---

*Last updated: June 2026*
