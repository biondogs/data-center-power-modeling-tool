# Data Center Capacity & Power Modeling Tool - Implementation Plan

## Overview

This document outlines the implementation plan for 7 major features in the Data Center Capacity & Power Modeling Tool. The plan is organized into parallel waves to maximize development efficiency while respecting feature dependencies.

**Tech Stack:** Next.js 16.1.1, React 19, TypeScript, Prisma ORM, SQLite, Tailwind CSS v4, shadcn/ui, Recharts

**Current Architecture:**
- Calculation Engine: `lib/engine/` (time.ts, projector.ts, aggregator.ts, capacity.ts)
- Server Actions: `lib/actions.ts`
- Data Services: `lib/services/data.ts`
- UI Components: `components/scenario/`, `components/dashboard/`, `components/ui/`
- Database: SQLite via Prisma with existing models (CatalogItem, Scenario, Site, LineItem, Assumption)

---

## Feature Dependency Analysis

### Dependency Graph

```
Wave 1 (Foundation):
├── F1: Capacity Alerts & Constraints (standalone)
└── F3: Scenario Comparison Tool (standalone)

Wave 2 (Project Layer):
├── F2: Project Portfolio Management
│   └── Depends on: existing projectTag field in LineItem

Wave 3 (Visualization):
├── F6: Multi-Site Aggregation
│   └── Depends on: F2 (understanding project structure)
└── F5: Timeline/Gantt View
    └── Depends on: existing quarter system

Wave 4 (Analytics & Intelligence):
├── F4: Optimization Engine
│   └── Depends on: F1 (capacity data), F6 (multi-site context)
└── F7: Historical Tracking
    └── Depends on: core projections working
```

### Feature Independence

**Can be worked on in parallel immediately:**
- F1: Capacity Alerts & Constraints
- F3: Scenario Comparison Tool

**Can start after Wave 1:**
- F2: Project Portfolio Management

**Can start after Wave 2:**
- F5: Timeline/Gantt View
- F6: Multi-Site Aggregation

**Can start after Wave 3:**
- F4: Optimization Engine
- F7: Historical Tracking

---

## Wave 1: Foundation Features (Parallel)

### F1: Capacity Alerts & Constraints

**Status:** Can be started immediately (capacity.ts already exists)

**Goal:** Visual warnings when deployments exceed site limits (power, cooling, rack, electrical)

**Files to Create/Modify:**

| File | Type | Description |
|------|------|-------------|
| `lib/engine/capacity.ts` | Modify (exists) | Enhance with detailed rack space tracking |
| `components/scenario/CapacityAlertPanel.tsx` | Create | Visual capacity warnings dashboard |
| `components/scenario/CapacityIndicator.tsx` | Create | Reusable capacity gauge component |
| `components/scenario/ConstraintWarning.tsx` | Create | Warning banners for violations |
| `app/api/capacity/[siteId]/route.ts` | Create | API endpoint for capacity status |

**Database Changes:**
- None required (existing schema supports this)
- May need to enhance `LineItem` model to track rack space consumption if not already

**UI Components Needed:**
- AlertBanner - Shows critical/warning capacity violations
- CapacityGauge - Circular progress indicator showing utilization %
- CapacitySummaryCard - Card showing all constraints status
- ConstraintTimeline - Shows when constraints will be exceeded

**API Endpoints:**
- `GET /api/capacity/[siteId]` - Returns capacity status for site
- `GET /api/capacity/[siteId]/timeline` - Returns constraint violations over time

**Testing Approach:**
- Unit tests in `lib/engine/capacity.test.ts`
- Component tests for CapacityGauge
- Integration tests for API endpoints

**Key Implementation Steps:**
1. [ ] Enhance rack space calculation in `CapacityAnalyzer.analyzeSiteCapacity()` to track by quarter
2. [ ] Create `CapacityAlertPanel` component for ScenarioView
3. [ ] Create reusable `CapacityGauge` component using shadcn/ui progress
4. [ ] Add capacity status to projections output
5. [ ] Create API routes for fetching capacity data
6. [ ] Add capacity indicators to SitePlanEditor

---

### F3: Scenario Comparison Tool

**Status:** Can be started immediately

**Goal:** Side-by-side diff of two scenarios

**Files to Create/Modify:**

| File | Type | Description |
|------|------|-------------|
| `app/scenarios/compare/page.tsx` | Create | Main comparison page |
| `components/comparison/ScenarioSelector.tsx` | Create | Dual scenario selector |
| `components/comparison/ComparisonTable.tsx` | Create | Side-by-side data comparison |
| `components/comparison/DiffView.tsx` | Create | Highlight differences between scenarios |
| `components/comparison/ComparisonChart.tsx` | Create | Overlay chart comparing two scenarios |
| `lib/engine/comparison.ts` | Create | Comparison logic engine |
| `lib/services/comparison.ts` | Create | Data fetching for comparison |

**Database Changes:**
- None required

**UI Components Needed:**
- ScenarioSelector - Dropdown to pick 2 scenarios
- ComparisonTable - Tabular diff view
- DiffBadge - Shows "+/-" indicators for changes
- ComparisonChart - Dual-line chart overlay
- DifferenceSummary - Shows key metrics delta

**API Endpoints:**
- `GET /api/scenarios/compare?baseId=X&compareId=Y` - Returns comparison data
- `POST /api/scenarios/compare/export` - Export comparison report

**Testing Approach:**
- Unit tests for comparison engine
- Component tests for DiffView
- E2E tests for comparison workflow

**Key Implementation Steps:**
1. [ ] Create `comparison.ts` engine with diff algorithms
2. [ ] Create ScenarioSelector component with search
3. [ ] Build ComparisonTable with highlighting
4. [ ] Create ComparisonChart overlay visualization
5. [ ] Build comparison page layout
6. [ ] Add export to PDF/Excel functionality

---

## Wave 2: Project Layer

### F2: Project Portfolio Management

**Status:** Can start after Wave 1 (uses existing projectTag field)

**Goal:** Group line items by project, show project-level totals (capex, power, timeline)

**Files to Create/Modify:**

| File | Type | Description |
|------|------|-------------|
| `lib/engine/projector.ts` | Modify | Enhance to track project-level data |
| `lib/engine/aggregator.ts` | Modify | Add project aggregation methods |
| `components/project/ProjectCard.tsx` | Create | Project summary card |
| `components/project/ProjectList.tsx` | Create | List of all projects in scenario |
| `components/project/ProjectDetailDialog.tsx` | Create | Drill-down project view |
| `components/project/ProjectFilter.tsx` | Create | Filter controls for projects |
| `lib/services/projects.ts` | Create | Project data fetching |
| `app/api/projects/route.ts` | Create | Project API endpoints |

**Database Changes:**
```prisma
// Add to LineItem model if not exists:
// projectTag String? // Already exists

// Optionally add Project model for richer project management:
model Project {
  id          String   @id @default(uuid())
  scenarioId  String
  scenario    Scenario @relation(fields: [scenarioId], references: [id], onDelete: Cascade)
  name        String   // Project name (unique within scenario)
  description String?
  status      String   @default("planning") // planning, active, completed
  targetCapex Float?   // Budget target
  startDate   String?  // Planned start quarter
  endDate     String?  // Planned end quarter
  lineItems   LineItem[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([scenarioId, name])
}

// Update LineItem to optionally link to Project:
// projectId String?
// project   Project? @relation(fields: [projectId], references: [id])
```

**Migration Required:**
```bash
npx prisma migrate dev --name add_project_model
```

**UI Components Needed:**
- ProjectCard - Summary card with metrics
- ProjectList - Grid/list view of projects
- ProjectMetrics - Charts showing project spend/power
- ProjectTimeline - Gantt-like project view
- ProjectFilter - Filter by status, date range

**API Endpoints:**
- `GET /api/scenarios/[id]/projects` - List projects in scenario
- `GET /api/projects/[id]` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

**Testing Approach:**
- Unit tests for project aggregation logic
- Component tests for ProjectCard
- Integration tests for project CRUD

**Key Implementation Steps:**
1. [ ] Create Project model migration
2. [ ] Update LineItem to link to Project
3. [ ] Update projector/aggregator for project-level calculations
4. [ ] Create ProjectCard component
5. [ ] Build ProjectList view
6. [ ] Add Project tab to ScenarioView
7. [ ] Create project filtering controls

---

## Wave 3: Visualization Features (Parallel)

### F5: Timeline/Gantt View

**Status:** Can start after Wave 2 (uses project data if available, otherwise standalone)

**Goal:** Visual calendar showing equipment deployments

**Files to Create/Modify:**

| File | Type | Description |
|------|------|-------------|
| `components/timeline/TimelineView.tsx` | Create | Main Gantt-style timeline |
| `components/timeline/TimelineRow.tsx` | Create | Single equipment/project row |
| `components/timeline/TimelineHeader.tsx` | Create | Quarter/year header |
| `components/timeline/DeploymentBar.tsx` | Create | Visual deployment duration bar |
| `components/timeline/TimelineZoom.tsx` | Create | Zoom controls |
| `lib/engine/timeline.ts` | Create | Timeline data preparation |
| `lib/hooks/useTimeline.ts` | Create | Timeline state management |

**Database Changes:**
- None (uses existing LineItem startQuarter/endQuarter)

**UI Components Needed:**
- TimelineView - Main container with scroll/zoom
- TimelineRow - Row for each deployment
- DeploymentBar - Colored bar showing duration
- TimelineTooltip - Hover details
- TimelineFilter - Filter by site, project, equipment type
- ZoomControls - Quarter/year view toggles

**API Endpoints:**
- `GET /api/timeline/[scenarioId]` - Returns timeline data
- `GET /api/timeline/[scenarioId]?siteId=X` - Filtered by site

**Dependencies:**
- May use project data from F2
- Uses existing quarter system

**Testing Approach:**
- Unit tests for timeline data generation
- Component tests for TimelineRow
- Visual regression tests for Gantt layout

**Key Implementation Steps:**
1. [ ] Create timeline data preparation engine
2. [ ] Build TimelineHeader with quarter labels
3. [ ] Create TimelineRow component
4. [ ] Build DeploymentBar with colors by project/equipment type
5. [ ] Add zoom controls (month/quarter/year views)
6. [ ] Implement drag-to-resize deployment dates
7. [ ] Add filter controls

---

### F6: Multi-Site Aggregation

**Status:** Can start after Wave 2 (understands project grouping)

**Goal:** View combined metrics across all sites in a scenario

**Files to Create/Modify:**

| File | Type | Description |
|------|------|-------------|
| `components/scenario/MultiSiteView.tsx` | Create | Aggregate view component |
| `components/scenario/SiteComparisonTable.tsx` | Create | Compare metrics across sites |
| `components/scenario/AggregateChart.tsx` | Create | Stacked chart showing all sites |
| `lib/engine/multi-site.ts` | Create | Multi-site aggregation logic |
| `components/dashboard/MultiSiteSummary.tsx` | Create | Dashboard widget for multi-site |

**Database Changes:**
- None required

**UI Components Needed:**
- MultiSiteView - Container for aggregate data
- SiteComparisonTable - Side-by-site metrics
- AggregateChart - Stacked area/bar chart
- SiteSelector - Toggle sites on/off
- AggregateKPIs - Summary cards for total scenario

**API Endpoints:**
- `GET /api/scenarios/[id]/aggregate` - Returns combined metrics
- `GET /api/scenarios/[id]/sites-comparison` - Site-by-site comparison

**Dependencies:**
- Can use project breakdown from F2 if available
- Enhances existing dashboard aggregation

**Testing Approach:**
- Unit tests for multi-site aggregation
- Component tests for AggregateChart
- Integration tests for multi-site data flow

**Key Implementation Steps:**
1. [ ] Create multi-site aggregation engine
2. [ ] Build MultiSiteView component
3. [ ] Create SiteComparisonTable
4. [ ] Build AggregateChart with site toggles
5. [ ] Add to ScenarioView as new tab
6. [ ] Create dashboard summary widget

---

## Wave 4: Analytics & Intelligence (Parallel)

### F4: Optimization Engine

**Status:** Can start after Wave 3 (needs capacity data from F1, multi-site context from F6)

**Goal:** What-if mode, cost suggestions, auto-detect cheaper alternatives

**Files to Create/Modify:**

| File | Type | Description |
|------|------|-------------|
| `lib/engine/optimizer.ts` | Create | Optimization algorithms |
| `components/optimizer/OptimizationPanel.tsx` | Create | Main optimization UI |
| `components/optimizer/WhatIfDialog.tsx` | Create | What-if scenario editor |
| `components/optimizer/CostSuggestion.tsx` | Create | Cost-saving recommendations |
| `components/optimizer/AlternativeCard.tsx` | Create | Equipment alternative card |
| `lib/services/optimization.ts` | Create | Optimization data fetching |
| `app/api/optimize/route.ts` | Create | Optimization API |

**Database Changes:**
- May need to add `optimized` flag to LineItem
- May need `optimization_history` table

```prisma
model OptimizationRun {
  id            String   @id @default(uuid())
  scenarioId    String
  scenario      Scenario @relation(fields: [scenarioId], references: [id], onDelete: Cascade)
  runType       String   // "what-if", "cost-optimization", "capacity-optimization"
  parameters    String   // JSON of optimization params
  results       String   // JSON of results
  savingsCapex  Float?   // Potential savings
  savingsOpex   Float?    // Potential annual savings
  createdAt     DateTime @default(now())
}

model LineItemAlternative {
  id              String   @id @default(uuid())
  lineItemId      String
  lineItem        LineItem @relation(fields: [lineItemId], references: [id], onDelete: Cascade)
  alternativeItemId String
  alternativeItem CatalogItem @relation(fields: [alternativeItemId], references: [id])
  savings         Float    // Cost savings
  reason          String   // Why this is an alternative
  isRecommended   Boolean  @default(false)
}
```

**UI Components Needed:**
- OptimizationPanel - Main dashboard
- WhatIfDialog - Edit parameters for scenarios
- CostSuggestion - List of recommendations
- AlternativeCard - Shows alternative equipment
- SavingsBadge - Shows potential savings
- OptimizationHistory - Past optimization runs

**API Endpoints:**
- `POST /api/optimize/analyze` - Run optimization analysis
- `POST /api/optimize/what-if` - Generate what-if scenario
- `GET /api/optimize/alternatives/[itemId]` - Get alternatives
- `GET /api/optimize/history` - Past optimization runs

**Dependencies:**
- F1 (Capacity data for constraint checking)
- F6 (Multi-site context for cost comparisons)
- Catalog data for alternative detection

**Testing Approach:**
- Unit tests for optimization algorithms
- Component tests for suggestion cards
- Integration tests for what-if scenarios

**Key Implementation Steps:**
1. [ ] Create optimization engine with cost comparison algorithms
2. [ ] Build WhatIfDialog for scenario modifications
3. [ ] Create CostSuggestion component
4. [ ] Implement alternative detection based on specs
5. [ ] Build optimization results dashboard
6. [ ] Add "Apply Recommendation" actions
7. [ ] Create optimization history tracking

---

### F7: Historical Tracking

**Status:** Can start after Wave 3 (needs core projections working)

**Goal:** Mark actuals vs planned, track variance

**Files to Create/Modify:**

| File | Type | Description |
|------|------|-------------|
| `lib/engine/actuals.ts` | Create | Actual vs planned comparison |
| `components/tracking/ActualsEntryDialog.tsx` | Create | Enter actual values |
| `components/tracking/VarianceReport.tsx` | Create | Variance analysis report |
| `components/tracking/VarianceChart.tsx` | Create | Visual variance comparison |
| `components/tracking/TrackingDashboard.tsx` | Create | Main tracking view |
| `lib/services/tracking.ts` | Create | Tracking data services |
| `app/api/actuals/route.ts` | Create | Actuals API endpoints |

**Database Changes:**
```prisma
model ActualValue {
  id            String   @id @default(uuid())
  siteId        String
  site          Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  quarter       String   // "2024Q1"
  
  // Actual measured values
  actualPowerMw       Float?
  actualCapex         Float?
  actualUtilityCost   Float?
  
  // Metadata
  recordedBy    String?  // Who entered this
  recordedAt    DateTime @default(now())
  notes         String?
  
  @@unique([siteId, quarter])
}

model VarianceReport {
  id            String   @id @default(uuid())
  scenarioId    String
  scenario      Scenario @relation(fields: [scenarioId], references: [id], onDelete: Cascade)
  reportDate    DateTime @default(now())
  reportPeriod  String   // Quarter or date range
  
  // Variance metrics
  powerVariancePct    Float
  capexVariancePct    Float
  costVariancePct     Float
  
  // Details
  details       String   // JSON of detailed variance by line item
}
```

**Migration Required:**
```bash
npx prisma migrate dev --name add_actuals_tracking
```

**UI Components Needed:**
- ActualsEntryDialog - Form to enter actual values
- VarianceReport - Shows planned vs actual table
- VarianceChart - Bar chart showing deltas
- TrackingDashboard - Overview of tracking status
- VarianceBadge - Shows % over/under
- QuarterStatus - Shows which quarters have actuals

**API Endpoints:**
- `POST /api/actuals` - Record actual value
- `GET /api/actuals/[siteId]` - Get actuals for site
- `GET /api/variances/[scenarioId]` - Get variance report
- `POST /api/variances/generate` - Generate variance report

**Dependencies:**
- Core projections working (baseline)
- Can use project data from F2

**Testing Approach:**
- Unit tests for variance calculations
- Component tests for VarianceReport
- Integration tests for actuals entry workflow

**Key Implementation Steps:**
1. [ ] Create ActualValue and VarianceReport migrations
2. [ ] Build actuals entry form/dialog
3. [ ] Create variance calculation engine
4. [ ] Build VarianceReport component
5. [ ] Create VarianceChart visualization
6. [ ] Add tracking tab to ScenarioView
7. [ ] Create variance alert notifications

---

## Testing Strategy

### Unit Tests
- Location: `lib/engine/*.test.ts`
- Coverage: All calculation engines
- Framework: Vitest (already configured)

### Component Tests
- Location: `components/**/*.test.tsx`
- Coverage: Interactive components
- Framework: React Testing Library

### Integration Tests
- Location: `tests/integration/*.test.ts`
- Coverage: API endpoints, data flows
- Framework: Vitest with supertest

### E2E Tests
- Location: `tests/e2e/*.spec.ts`
- Coverage: Critical user workflows
- Framework: Playwright (already in dependencies)

---

## Implementation Phases Summary

| Phase | Features | Duration Estimate | Dependencies |
|-------|----------|-------------------|--------------|
| **Wave 1** | F1 (Capacity Alerts), F3 (Scenario Comparison) | 2-3 weeks | None |
| **Wave 2** | F2 (Project Portfolio) | 1-2 weeks | Wave 1 |
| **Wave 3** | F5 (Timeline), F6 (Multi-Site) | 2-3 weeks | Wave 2 |
| **Wave 4** | F4 (Optimization), F7 (Historical Tracking) | 3-4 weeks | Wave 3 |

**Total Estimated Duration:** 8-12 weeks for full implementation

---

## Files to Create Summary

### Wave 1 (10 files)
- `components/scenario/CapacityAlertPanel.tsx`
- `components/scenario/CapacityIndicator.tsx`
- `components/scenario/ConstraintWarning.tsx`
- `app/api/capacity/[siteId]/route.ts`
- `app/scenarios/compare/page.tsx`
- `components/comparison/ScenarioSelector.tsx`
- `components/comparison/ComparisonTable.tsx`
- `components/comparison/DiffView.tsx`
- `components/comparison/ComparisonChart.tsx`
- `lib/engine/comparison.ts`

### Wave 2 (7 files + migration)
- `components/project/ProjectCard.tsx`
- `components/project/ProjectList.tsx`
- `components/project/ProjectDetailDialog.tsx`
- `components/project/ProjectFilter.tsx`
- `lib/services/projects.ts`
- `app/api/projects/route.ts`
- Migration: Add Project model

### Wave 3 (10 files)
- `components/timeline/TimelineView.tsx`
- `components/timeline/TimelineRow.tsx`
- `components/timeline/TimelineHeader.tsx`
- `components/timeline/DeploymentBar.tsx`
- `components/timeline/TimelineZoom.tsx`
- `lib/engine/timeline.ts`
- `components/scenario/MultiSiteView.tsx`
- `components/scenario/SiteComparisonTable.tsx`
- `components/scenario/AggregateChart.tsx`
- `lib/engine/multi-site.ts`

### Wave 4 (14 files + migration)
- `lib/engine/optimizer.ts`
- `components/optimizer/OptimizationPanel.tsx`
- `components/optimizer/WhatIfDialog.tsx`
- `components/optimizer/CostSuggestion.tsx`
- `components/optimizer/AlternativeCard.tsx`
- `lib/engine/actuals.ts`
- `components/tracking/ActualsEntryDialog.tsx`
- `components/tracking/VarianceReport.tsx`
- `components/tracking/VarianceChart.tsx`
- `components/tracking/TrackingDashboard.tsx`
- `lib/services/tracking.ts`
- `app/api/actuals/route.ts`
- `app/api/optimize/route.ts`
- Migration: Add ActualValue and VarianceReport models

**Total New Files:** ~41 files
**Total Migrations:** 2

---

## Critical Path Analysis

The critical path for full feature completion:

```
F1 (Capacity Alerts) ─────┐
                          ├──→ F2 (Projects) ──→ F5/F6 (Visualization) ──→ F4/F7 (Analytics)
F3 (Scenario Compare) ────┘
```

**Shortest path to value:**
1. F1 alone provides immediate value (capacity monitoring)
2. F3 alone provides immediate value (scenario comparison)
3. F1 + F3 can be delivered in Wave 1

**Recommended MVP:**
- Wave 1 only (F1 + F3) = 2-3 weeks
- Provides capacity awareness and scenario comparison
- Foundation for all other features

---

## Technical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance with large scenarios | High | Implement pagination, caching, virtualization |
| Chart rendering complexity | Medium | Use Recharts carefully, consider canvas for large datasets |
| Migration data integrity | High | Test migrations thoroughly, keep backups |
| Quarter/date calculations | Medium | Centralize in TimeUtils, add comprehensive tests |
| Capacity calculation accuracy | Critical | Validate against Excel, add golden master tests |

---

## Next Steps

1. Review and approve this plan
2. Create development branches for each wave
3. Begin Wave 1 implementation (F1 and F3 in parallel)
4. Set up feature flags for gradual rollout
5. Establish test coverage targets (recommend 80% minimum)

---

## Appendix: Component Naming Conventions

Following existing patterns:
- Components: PascalCase, descriptive (e.g., `CapacityAlertPanel`)
- Props interfaces: `ComponentNameProps`
- Server actions: camelCase verbs (e.g., `updateSiteSettings`)
- API routes: kebab-case (e.g., `/api/capacity/[siteId]`)
- Engine classes: PascalCase with static methods (e.g., `CapacityAnalyzer.analyzeSiteCapacity`)

## Appendix: Color Scheme for Alerts

Using existing shadcn/ui semantic colors:
- Critical (over limit): `text-destructive bg-destructive/10 border-destructive`
- Warning (80%+): `text-amber-500 bg-amber-500/10 border-amber-500`
- OK (<80%): `text-green-500 bg-green-500/10 border-green-500`
