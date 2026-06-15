# User Guide — Data Center Capacity & Power Modeling Tool

> Step-by-step guide for modeling data center power, capacity, and costs across multiple sites.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [The Dashboard](#the-dashboard)
- [Working with Scenarios](#working-with-scenarios)
- [Managing Sites](#managing-sites)
- [Hardware Catalog](#hardware-catalog)
- [Deployment Planning](#deployment-planning)
- [What-If Analysis](#what-if-analysis)
- [Capacity Gauges](#capacity-gauges)
- [Exporting Data](#exporting-data)
- [Understanding Results](#understanding-results)

---

## Overview

This tool helps you plan and model data center capacity across multiple sites and timelines. You can:

- **Create scenarios** with custom time horizons (quarterly granularity)
- **Add data center sites** with power, cooling, and rack capacity limits
- **Deploy hardware** from a catalog of GPU, CPU, and storage equipment
- **Model costs** including power, cooling, utility, and capital expenditure
- **Compare scenarios** side by side
- **Analyze capacity** constraints and receive alerts when approaching limits

### Key Concepts

| Term | Description |
|------|-------------|
| **Scenario** | A collection of sites, assumptions, and deployments with a shared timeline |
| **Site** | A data center with power, cooling, electrical, and rack capacity |
| **Catalog Item** | A hardware type (GPU, CPU, storage) with power draw, cost, and capacity specs |
| **Line Item** | A deployment of a specific quantity of hardware at a site during a time range |
| **Quarter** | Time periods in `YYYYQN` format (e.g., `2024Q1`, `2025Q3`) |
| **Cooling Overhead** | Multiplier for cooling power required per kW of IT load (default: 35%) |
| **Inflation Rate** | Annual rate applied to utility costs over time (default: 2%) |

---

## Getting Started

### First Time Setup

1. **Open the application** at `http://localhost:3000` (or your deployment URL)
2. You'll land on the **Dashboard** showing summary statistics
3. Click **"Create Scenario"** in the sidebar or the + button on the scenarios page

### Creating Your First Scenario

1. Click **"+ New Scenario"** 
2. Fill in:
   - **Name** — e.g., "2025 GPU Deployment Plan"
   - **Description** — Brief explanation of the scenario
   - **Start Quarter** — When planning begins (e.g., `2025Q1`)
   - **End Quarter** — Planning horizon (e.g., `2032Q4`)
3. Click **Create**
4. You'll be taken to the scenario detail page

---

## The Dashboard

The dashboard provides a high-level overview:

- **Total Scenarios** — Number of active scenarios
- **Total Sites** — Data centers across all scenarios
- **Total Deployments** — Hardware deployments planned
- **Peak Power** — Maximum projected power across all scenarios
- **Scenario Aggregate Chart** — Combined power utilization over time

---

## Working with Scenarios

### Scenario List

Navigate to **Scenarios** in the sidebar to see all scenarios:
- **Name** — Scenario title
- **Sites** — Number of data centers
- **Deployments** — Total line items
- **Peak Power** — Highest projected power across all sites
- **Actions** — View, Compare, Export, Delete

### Viewing a Scenario

Click a scenario name to open the detail page:

**Top section:**
- Scenario metadata (name, description, timeline)
- Global assumptions (cooling overhead, inflation rate)
- Actions: Edit, Export, Delete

**Site sections (one per site):**
- Site name and capacity limits
- Power chart showing IT power, adjusted power, and capacity over time
- Line items table with all deployments
- Capacity gauges for power, cooling, electrical, and rack utilization

### Editing Scenario Settings

Click the settings gear icon to update:
- **Name** and **Description**
- **Horizon Start/End** quarters
- **Cooling Overhead** (default: 0.35 = 35% cooling power per kW IT load)
- **Inflation Rate** (default: 0.02 = 2% annual)

### Comparing Scenarios

Navigate to **Scenarios → Compare**:
- Select multiple scenarios
- View side-by-side power projections
- Compare total costs and capacity utilization

### Deleting a Scenario

⚠️ **Warning:** This permanently deletes the scenario, all sites, all line items, and all assumptions. A confirmation dialog is shown before deletion.

---

## Managing Sites

### Adding a Site

In the scenario detail page, click **"+ Add Site"**:
1. **Name** — e.g., "Site A: Virginia"
2. **IT Capacity (MW)** — Total IT load the site can support
3. **Electrical Capacity (MW)** — Electrical infrastructure limit
4. **Liquid Cooling (kW)** — Liquid cooling capacity
5. **Air Cooling (kW)** — Air cooling capacity
6. **Electricity Rate ($/kWh)** — Local power cost
7. **Inflation Rate** — Site-specific inflation (falls back to scenario default)
8. **Rack Space (U)** — Total rack units available
9. **Baseline Power** — Existing baseline IT/mechanical load

### Editing Site Settings

Click the settings icon next to the site name to modify capacity and cost parameters.

### Deleting a Site

⚠️ Removes the site and all its line items. Confirm in the dialog.

---

## Hardware Catalog

The catalog is a shared library of hardware types available across all scenarios.

### Browsing the Catalog

Navigate to **Catalog** in the sidebar:
- **Name** — Hardware name (e.g., "H100-8")
- **Category** — GPU, CPU, or Storage
- **Power** — Power draw in kW
- **Cost** — Unit cost
- **Cooling** — Liquid and air cooling requirements
- **Rack Space** — Units of rack space required

### Adding Hardware

Click **"+ Add Hardware"**:
1. **Name** — Unique identifier (e.g., "H100-8")
2. **Category** — GPU, CPU, Storage, or Network
3. **Vendor** — Manufacturer (e.g., Dell, HPE)
4. **Model** — Model number
5. **Power (kW)** — Total power draw per unit
6. **Cost** — Unit acquisition cost
7. **Capacity Type** — What this provides (GPU, CPU, Storage)
8. **Capacity Value** — How much capacity per unit
9. **Rack Space (U)** — Rack units per unit
10. **Liquid/Air Cooling** — Split of cooling requirements

### Deleting Hardware

⚠️ Cannot delete hardware that is referenced by active line items. Delete dependent deployments first.

---

## Deployment Planning

### Adding a Deployment

In a site section, click **"+ Add Deployment"**:
1. **Hardware** — Select from the catalog
2. **Quantity** — Number of units
3. **Start Quarter** — When deployment begins (e.g., `2025Q2`)
4. **End Quarter** — Optional end of service life
5. **Project Tag** — Optional grouping label (e.g., "GPU-Scale-Up")

### Editing a Deployment

Click the edit icon on any line item to modify quantity, timeline, or project tag.

### Deployments Table

| Column | Description |
|--------|-------------|
| Hardware | Catalog item name |
| Qty | Number of units |
| Start | Deployment start quarter |
| End | End quarter (blank = indefinite) |
| Power | IT power contribution (MW) |
| Capex | Capital expenditure |
| Tag | Project grouping |

---

## What-If Analysis

Use what-if analysis to evaluate the impact of changes before committing:

1. Add hypothetical deployments
2. Adjust assumptions (cooling, inflation)
3. See projected impact on power, cost, and capacity
4. Compare against the base scenario

---

## Capacity Gauges

Each site displays **four capacity gauges** with color-coded utilization:

| Gauge | What It Measures |
|-------|-----------------|
| **Power** | IT power vs. total IT capacity |
| **Cooling** | Cooling load vs. cooling capacity |
| **Electrical** | Electrical load vs. electrical capacity |
| **Rack Space** | Used rack units vs. total |

### Color Coding

- 🟢 **Green** — Below 60% (Healthy)
- 🟡 **Yellow** — 60–75% (Moderate)
- 🟠 **Orange** — 75–90% (Warning)
- 🔴 **Red** — ≥90% (Critical)

### Trend Indicators

Each gauge shows a trend arrow indicating quarter-over-quarter change:
- ▲ **Up** — Utilization increasing
- ▼ **Down** — Utilization decreasing
- ● **Stable** — Little change

---

## Exporting Data

### Export Single Scenario

Click **Export** on a scenario:
- Downloads a CSV with all deployments and projections

### Export All Scenarios

From the scenarios list, click **Export All**:
- Downloads all scenarios as a combined CSV

---

## Understanding Results

### Power Chart

Each site shows a line chart over time with:
- **IT Power** — Baseline + deployed hardware power
- **Adjusted Power** — IT power + cooling overhead
- **Capacity Limit** — Horizontal line at site's IT capacity
- **Baseline** — Pre-existing power load

### Key Metrics

| Metric | Formula |
|--------|---------|
| **IT Power** | Σ(line items × powerKw) + baseline |
| **Adjusted Power** | IT Power × (1 + cooling overhead) |
| **Cooling Load** | Adjusted Power × cooling overhead / (1 + cooling overhead) |
| **Utility Cost** | Adjusted Power × 1000 × 2160h × rate × (1 + inflation)^(quarters/4) |
| **Remaining Power** | IT Capacity − IT Power |

### Alerts

When capacity exceeds thresholds, alerts appear:
- **Warning** — Approaching capacity (75–90%)
- **Critical** — At or over capacity (≥90%)
- Alerts suggest actions like deferring deployments or expanding capacity

---

## Tips & Best Practices

1. **Start with the catalog** — Define all hardware types before creating scenarios
2. **Use project tags** — Group related deployments for easier tracking
3. **Set realistic baselines** — Include existing power draw for accurate remaining capacity
4. **Model in phases** — Create separate scenarios for different deployment strategies
5. **Check cooling requirements** — Liquid vs. air cooling affects total capacity differently
6. **Use what-if analysis** — Test changes before committing to a scenario
