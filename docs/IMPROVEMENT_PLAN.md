# Improvement Plan

Data Center Capacity & Power Modeling Tool — Comprehensive Codebase Enhancements

> **Generated:** 2026-06-15
> **Based on:** Multi-agent code review (3 specialized reviewers + 3 deep-dive investigators + debate synthesis)
> **Scope:** Full-stack improvements prioritized by risk and impact

---

## Executive Summary

| Priority | Count | Estimated Effort | Themes |
|----------|-------|-----------------|--------|
| 🔴 Critical | 3 | ~6–8 hrs | Server action error handling, input validation, user-facing feedback |
| 🟠 High | 4 | ~8–10 hrs | ScenarioView decomposition, error boundaries, engine tests, loading states |
| 🟡 Medium | 4 | ~5–6 hrs | Accessibility, barrel exports, Docker persistence, capacity gauge UX |
| 🟢 Low | 3 | ~2–3 hrs | Docs README, seed robustness, lint/CI automation |

**Total estimated effort:** ~21–27 hours across 14 tasks in 4 phases.

### Top 3 Risks Addressed

1. **Silent mutation failures** — Server actions return `void`; errors crash the UI with no feedback
2. **No server-side validation** — Server actions accept untyped, unvalidated input (NaN, negatives, empty strings)
3. **God component** — ScenarioView at ~800 lines is unmaintainable and untestable

---

## Phase 1 — Critical (Data Integrity & User Feedback)

### C1. Standardize Server Action Error Handling

**File:** `lib/actions.ts`
**Problem:** Only `deleteScenario` returns `{ success: boolean, error?: string }`. All other actions return `void` and rely solely on `revalidatePath()`. If a mutation fails, the error is swallowed and the user sees no feedback.

**Fix:**

```typescript
// New return type for ALL server actions
export type ActionResult =
  | { success: true }
  | { success: false; error: string; errors?: string[] };
```

Every action becomes:

```typescript
export async function addLineItem(siteId: string, data: AddLineItemData): Promise<ActionResult> {
  try {
    const site = await prisma.site.findUnique({ where: { id: siteId }, include: { scenario: true } });
    if (!site) return { success: false, error: 'Site not found' };

    await prisma.lineItem.create({ data: { ...data, siteId } });
    revalidatePath(`/scenarios/${site.scenarioId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to add line item', errors: [String(err)] };
  }
}
```

**Actions to update (16 total):** createScenario, updateScenario, deleteScenario, createSite, updateSite, deleteSite, addLineItem, updateLineItem, deleteLineItem, updateActuals, createCatalogItem, updateCatalogItem, deleteCatalogItems, updateScenarioAssumptions, exportScenario, exportAllScenarios

**Acceptance criteria:**
- [ ] Every server action returns `ActionResult`
- [ ] Every action has try/catch
- [ ] Every error includes a user-friendly message
- [ ] All calling components check `.success` and display errors

**Estimated effort:** 2 hours

---

### C2. Add Server-Side Zod Validation

**Files:** `lib/schemas.ts` (new), `lib/actions.ts`
**Problem:** Client-side Zod schemas exist in dialog components (AddLineItemDialog, CatalogDialog, CreateScenarioDialog, EditLineItemDialog) but server actions accept raw `FormData` or untyped objects. `parseFloat('abc')` → `NaN`, negative quantities accepted, empty strings pass through.

**Fix:** Create `lib/schemas.ts` with Zod schemas for every input type:

```typescript
import { z } from 'zod';

export const catalogItemSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  category: z.string().trim().min(1),
  vendor: z.string().trim().max(100).optional().nullable(),
  model: z.string().trim().max(100).optional().nullable(),
  powerKw: z.coerce.number().positive('Power must be positive'),
  cost: z.coerce.number().nonnegative('Cost cannot be negative'),
  capacityType: z.string().trim().max(100).optional().nullable(),
  capacityVal: z.coerce.number().nonnegative().optional().nullable(),
  liquidCoolingCapacityKw: z.coerce.number().nonnegative().optional().nullable(),
  airCoolingCapacityKw: z.coerce.number().nonnegative().optional().nullable(),
  rackSpaceU: z.coerce.number().int().nonnegative().optional().nullable(),
  electricalCapacityKw: z.coerce.number().nonnegative().optional().nullable(),
});

export const lineItemSchema = z.object({
  catalogItemId: z.string().uuid('Invalid catalog item ID'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
  startQuarter: z.string().regex(/^\d{4}Q[1-4]$/, 'Format: YYYYQN (e.g., 2024Q1)'),
  endQuarter: z.string().regex(/^\d{4}Q[1-4]$/, 'Format: YYYYQN').nullable(),
  projectTag: z.string().trim().max(100).optional().nullable(),
});

export const siteSchema = z.object({
  name: z.string().trim().min(1, 'Site name is required').max(200),
  totalItCapacityMw: z.coerce.number().positive('IT capacity must be positive'),
  electricalCapacityMw: z.coerce.number().positive(),
  liquidCoolingCapacityKw: z.coerce.number().nonnegative(),
  airCoolingCapacityKw: z.coerce.number().nonnegative(),
  totalRackSpaceU: z.coerce.number().int().nonnegative(),
  usedRackSpaceU: z.coerce.number().int().nonnegative(),
  electricityRatePerKwh: z.coerce.number().nonnegative(),
  inflationRate: z.coerce.number().min(0).max(1),
  baselineItPowerMw: z.coerce.number().nonnegative(),
  baselineMechanicalMw: z.coerce.number().nonnegative(),
  baselineLiquidCoolingKw: z.coerce.number().nonnegative(),
  baselineAirCoolingKw: z.coerce.number().nonnegative(),
  baselineElectricalKw: z.coerce.number().nonnegative(),
});

export const assumptionSchema = z.object({
  key: z.enum(['cooling_overhead', 'inflation_rate']),
  value: z.coerce.number().nonnegative(),
});

export const scenarioSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  horizonStart: z.string().regex(/^\d{4}Q[1-4]$/, 'Format: YYYYQN').nullable(),
  horizonEnd: z.string().regex(/^\d{4}Q[1-4]$/, 'Format: YYYYQN').nullable(),
});
```

Apply in every action:

```typescript
export async function createCatalogItem(formData: FormData): Promise<ActionResult> {
  try {
    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      vendor: formData.get('vendor') as string,
      model: formData.get('model') as string,
      powerKw: formData.get('powerKw'),
      cost: formData.get('cost'),
      capacityType: formData.get('capacityType'),
      capacityVal: formData.get('capacityVal'),
      liquidCoolingCapacityKw: formData.get('liquidCoolingCapacityKw'),
      airCoolingCapacityKw: formData.get('airCoolingCapacityKw'),
      rackSpaceU: formData.get('rackSpaceU'),
      electricalCapacityKw: formData.get('electricalCapacityKw'),
    };

    const parsed = catalogItemSchema.parse(data); // Throws if invalid
    await prisma.catalogItem.create({ data: parsed });
    revalidatePath('/catalog');
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: 'Invalid input', errors: err.errors.map(e => e.message) };
    }
    return { success: false, error: 'Failed to create catalog item' };
  }
}
```

**Acceptance criteria:**
- [ ] `lib/schemas.ts` exists with schemas for all input types
- [ ] Every server action validates with Zod before Prisma
- [ ] Zod errors returned as `{ success: false, errors: [...] }`
- [ ] Invalid data never reaches the database

**Estimated effort:** 3 hours

---

### C3. Add Error Display in Components

**Files:** All components that call server actions
**Problem:** Components call server actions but don't check results or display errors.

**Fix:** Create a simple error toast/notification pattern:

```typescript
// lib/useActionResult.ts
'use client';
import { useState, useCallback } from 'react';
import type { ActionResult } from './actions';

export function useActionResult() {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    errors: string[] | null;
  }>({ loading: false, error: null, errors: null });

  const execute = useCallback(async <T>(fn: () => Promise<ActionResult & T>) => {
    setState({ loading: true, error: null, errors: null });
    try {
      const result = await fn();
      if (!result.success) {
        setState({ loading: false, error: result.error || 'Operation failed', errors: result.errors || null });
      } else {
        setState({ loading: false, error: null, errors: null });
      }
      return result;
    } catch (err) {
      setState({ loading: false, error: String(err), errors: null });
    }
  }, []);

  const clear = useCallback(() => setState({ loading: false, error: null, errors: null }), []);

  return { ...state, execute, clear };
}
```

Usage in AddLineItemDialog:

```typescript
const { loading, error, execute, clear } = useActionResult();

const handleSubmit = async (data: AddLineItemData) => {
  const result = await execute(() => addLineItem(siteId, data));
  if (result.success) {
    // close dialog, refresh
  }
};
```

Render error inline:

```tsx
{error && (
  <div className="text-sm text-destructive mt-2">{error}</div>
)}
```

**Acceptance criteria:**
- [ ] `useActionResult` hook exists and is used in all mutation components
- [ ] Errors display inline near the form/trigger
- [ ] No unhandled promise rejections in the browser

**Estimated effort:** 2 hours

---

## Phase 2 — High (Architecture & Reliability)

### H1. Decompose ScenarioView

**File:** `components/scenario/ScenarioView.tsx` (~800 lines)
**Problem:** Single component handles scenario settings, site management, line item CRUD, capacity analysis, reports, exports, and assumption editing. Unmaintainable and untestable.

**Proposed decomposition:**

```
ScenarioView (orchestrator, ~100 lines)
├── ScenarioSettings (~50 lines) — name, description, horizon editing
├── ScenarioActions (~30 lines) — delete, export, create-site buttons
├── ScenarioCapacitySection (~50 lines) — gauges + alerts wrapper
├── ScenarioSitesSection (~80 lines) — SitePlanEditor list, site management
├── ScenarioReportSection (~40 lines) — SummaryReport + PowerChart
└── ScenarioAssumptions (~40 lines) — Assumption editing dialog + display
```

Each extracted component is a focused client component with clearly defined props.

**Stubs:**

```typescript
// components/scenario/ScenarioSettings.tsx
export default function ScenarioSettings({
  scenario,
  onSave,
}: {
  scenario: ScenarioWithRelations;
  onSave: (data: ScenarioUpdateData) => Promise<ActionResult>;
}) {
  // Name, description, horizon editing form
}

// components/scenario/ScenarioActions.tsx
export default function ScenarioActions({
  scenario,
  onDelete,
  onExport,
  onCreateSite,
}: {
  scenario: ScenarioWithRelations;
  onDelete: (id: string) => Promise<ActionResult>;
  onExport: (id: string) => Promise<ActionResult>;
  onCreateSite: (scenarioId: string) => void;
}) {
  // Delete, export, create site buttons
}

// components/scenario/ScenarioCapacitySection.tsx
export default function ScenarioCapacitySection({
  projections,
  sites,
}: {
  projections: Record<string, SiteProjection[]>;
  sites: SiteWithLineItems[];
}) {
  // CapacityGauge + CapacityAlertPanel per site
}
```

**Acceptance criteria:**
- [ ] ScenarioView reduced to ~100 lines (orchestrator only)
- [ ] 5+ extracted sub-components, each under 100 lines
- [ ] All existing functionality preserved
- [ ] All tests still pass

**Estimated effort:** 3 hours

---

### H2. Add Error Boundaries

**Files:** `components/common/ErrorBoundary.tsx` (new), `app/scenarios/[id]/error.tsx` (new), `app/error.tsx` (new), `app/global-error.tsx` (new)
**Problem:** If any component throws (e.g., null `catalogItem`, `NaN` in calculations), the entire page crashes with a generic Next.js error.

**Fix — React error boundary for client components:**

```typescript
// components/common/ErrorBoundary.tsx
'use client';
import { Component, type ErrorInfo, type ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 text-destructive rounded-lg border border-destructive/50">
            <h2 className="font-bold mb-2">Something went wrong</h2>
            <p className="text-sm">{this.state.error?.message}</p>
            <button
              className="mt-4 px-3 py-1 bg-muted rounded"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

**Fix — Route-level error pages:**

```typescript
// app/scenarios/[id]/error.tsx
export default function ScenarioError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-xl font-bold text-destructive mb-4">Failed to load scenario</h1>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button onClick={() => reset()} className="btn-primary">Try again</button>
    </div>
  );
}
```

Wrap key sections in ScenarioView with ErrorBoundary:

```tsx
<ErrorBoundary>
  <ScenarioCapacitySection projections={projections} sites={sites} />
</ErrorBoundary>
```

**Acceptance criteria:**
- [ ] ErrorBoundary component exists and is used in ScenarioView for capacity and report sections
- [ ] Route-level error.tsx exists for scenarios/[id] and catalog
- [ ] Global error.tsx exists in app/
- [ ] No uncaught React errors crash the entire page

**Estimated effort:** 1 hour

---

### H3. Add Loading States to Forms

**Files:** All dialog components (`AddLineItemDialog`, `EditLineItemDialog`, `CatalogDialog`, `CreateScenarioDialog`)
**Problem:** When a user clicks "Save", there's no visual feedback. Double-clicking causes duplicate submissions.

**Fix:** Add disabled state + loading indicator to all form submit buttons:

```tsx
{loading && (
  <DialogContent>
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Saving...</span>
    </div>
  </DialogContent>
)}
```

Disable form during submission:

```tsx
<Button type="submit" disabled={loading}>
  {loading ? 'Saving...' : 'Save'}
</Button>
```

Prevent dialog close during submission by checking `loading` state in `onOpenChange`.

**Acceptance criteria:**
- [ ] All 4 dialog forms show loading state during submission
- [ ] Submit buttons disabled while loading
- [ ] Dialog cannot be closed during submission
- [ ] No duplicate submissions possible

**Estimated effort:** 1.5 hours

---

### H4. Expand Engine Test Coverage

**Files:** `lib/engine/engine.test.ts` (expand), new `lib/engine/edge-cases.test.ts`
**Problem:** 36 tests pass but coverage misses edge cases: zero quantities, negative values, empty arrays, null catalog items, overlapping quarters, single-quarter deployments, missing assumptions.

**Fix — New edge case test file:**

```typescript
// lib/engine/edge-cases.test.ts
import { describe, it, expect } from 'vitest';
import { TimeUtils } from './time';
import { Projector } from './projector';
import { Aggregator } from './aggregator';
import { CapacityAnalyzer } from './capacity';
import { WhatIfEngine } from './whatif';

describe('TimeUtils edge cases', () => {
  it('rejects invalid quarter format with hyphen', () => {
    expect(() => TimeUtils.parse('2024-Q1')).toThrow();
  });
  it('rejects Q0 and Q5', () => {
    expect(() => TimeUtils.parse('2024Q0')).toThrow();
    expect(() => TimeUtils.parse('2024Q5')).toThrow();
  });
  it('generates range for same start/end', () => {
    const range = TimeUtils.generateRange('2024Q1', '2024Q1');
    expect(range).toEqual(['2024Q1']);
  });
});

describe('Projector edge cases', () => {
  it('handles zero quantity line item', () => {
    // Should produce zero power, zero capex
  });
  it('handles NaN power from invalid catalog item', () => {
    // Should produce 0 or throw — needs defined behavior
  });
});

describe('Aggregator edge cases', () => {
  it('handles site with no line items', () => {
    // Should return projections with only baseline
  });
  it('handles zero cooling overhead', () => {
    // Should not divide by zero
  });
  it('handles negative inflation rate', () => {
    // Should handle gracefully (deflation)
  });
  it('handles very large quantities without overflow', () => {
    // 10000 units of H100 — check for reasonable output
  });
});

describe('CapacityAnalyzer edge cases', () => {
  it('handles site with zero capacity', () => {
    // Should report all constraints as critical
  });
  it('handles site with zero usage', () => {
    // Should report all constraints as OK
  });
});

describe('WhatIfEngine edge cases', () => {
  it('handles empty changes array', () => {
    // Should return identical to base
  });
  it('handles removing all line items from a site', () => {
    // Should produce zero power projections
  });
  it('suggestsAlternatives with no matching items', () => {
    // Should return empty array
  });
});
```

**Acceptance criteria:**
- [ ] All 36 existing tests still pass
- [ ] 20+ new edge case tests added
- [ ] All new tests pass
- [ ] NaN behavior is explicitly defined and tested

**Estimated effort:** 2.5 hours

---

## Phase 3 — Medium (UX & Polish)

### M1. Fix CapacityGauge Accessibility

**File:** `components/scenario/CapacityGauge.tsx`
**Problem:** SVG gauge has no ARIA attributes. Screen readers can't interpret it. Color-only status (green/yellow/red) fails WCAG for colorblind users.

**Fix:**

```tsx
<svg
  role="img"
  aria-label={`${name}: ${percentage.toFixed(0)}% utilization — ${statusText}`}
  className="..."
>
  <title>{`${name}: ${percentage.toFixed(0)}%`}</title>
  {/* ... SVG content ... */}
</svg>

{/* Text label below gauge */}
<span className="text-sm font-medium" style={{ color: statusColor }}>
  {percentage.toFixed(0)}% — {statusText}
</span>
```

**Acceptance criteria:**
- [ ] SVG has `role="img"` and `aria-label`
- [ ] Status conveyed via text, not just color
- [ ] Passes WCAG 2.1 Level AA color contrast

**Estimated effort:** 30 min

---

### M2. Add Barrel Exports from lib/engine/

**File:** `lib/engine/index.ts` (new)
**Problem:** Consumers import from individual files (`@/lib/engine/aggregator`, `@/lib/engine/capacity`). No central re-export.

**Fix:**

```typescript
// lib/engine/index.ts
export { TimeUtils } from './time';

export { Projector } from './projector';
export type { ProjectorSettings, LineProjection } from './projector';

export { Aggregator } from './aggregator';
export type { SiteProjection, SiteWithLineItems } from './aggregator';

export { CapacityAnalyzer } from './capacity';
export type { CapacityConstraint, SiteCapacityStatus } from './capacity';

export { ProjectAggregator, calculateProjectMetrics } from './project';
export type { ProjectSummary, ProjectMetrics } from './project';

export { TimelineEngine } from './timeline';
export type { TimelineEntry } from './timeline';

export { WhatIfEngine } from './whatif';
export type { WhatIfChange, WhatIfScenario, WhatIfResult } from './whatif';
```

Update 2–3 consumer files to use barrel:

```typescript
// Before
import { Aggregator } from '@/lib/engine/aggregator';
import { CapacityAnalyzer } from '@/lib/engine/capacity';

// After
import { Aggregator, CapacityAnalyzer } from '@/lib/engine';
```

**Acceptance criteria:**
- [ ] `lib/engine/index.ts` exists with all exports
- [ ] At least 2 consumer files updated
- [ ] All tests still pass

**Estimated effort:** 30 min

---

### M3. Fix Docker Volume Persistence

**File:** `docker-compose.yml`
**Problem:** Volume mounted at `/tmp/pmt-data`. On macOS and Linux, `/tmp` is cleared on reboot, destroying the SQLite database.

**Fix:**

```yaml
# docker-compose.yml (change)
volumes:
  # Before:
  # - /tmp/pmt-data:/app/data
  # After:
  - pmt-data:/app/data

volumes:
  pmt-data:
    driver: local
```

**Acceptance criteria:**
- [ ] Docker uses named volume
- [ ] Database persists across container restarts
- [ ] `npm run docker:up` still works

**Estimated effort:** 15 min

---

### M4. Add Capacity Gauge Trend Indicators

**File:** `components/scenario/CapacityGauge.tsx`
**Problem:** Gauges show current utilization but don't show whether capacity is trending toward overcommit.

**Fix:** Compare current quarter utilization with next quarter to show trend:

```tsx
{/* Add trend arrow */}
{nextQuarterPercent > percent ? (
  <span className="text-orange-500 ml-1">↑</span>
) : nextQuarterPercent < percent ? (
  <span className="text-green-500 ml-1">↓</span>
) : null}
```

**Acceptance criteria:**
- [ ] Gauge shows trend arrow (↑/↓) based on next quarter
- [ ] Last quarter in horizon shows no trend (N/A)
- [ ] Visually unobtrusive

**Estimated effort:** 45 min

---

## Phase 4 — Low (Documentation & Hygiene)

### L1. Add docs/README.md

**File:** `docs/README.md` (new)
**Problem:** No entry point to the documentation directory. Users won't find docs without being told.

**Fix:**

```markdown
# Documentation

| Document | Audience | Contents |
|----------|----------|----------|
| [INSTALL.md](INSTALL.md) | All | Setup, prerequisites, Docker, troubleshooting |
| [USER_GUIDE.md](USER_GUIDE.md) | End users | Features, workflows, concepts, export |
| [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | Developers | Architecture, code patterns, testing, adding features |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architects | Data model, calculation engine, component flow |
| [UPGRADE.md](UPGRADE.md) | DevOps | Migrations, dependency updates, backup/restore |
| [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md) | Team | Planned improvements, priorities, code stubs |

For AI agent context, see the project root [AGENTS.md](../AGENTS.md).
```

**Estimated effort:** 10 min

---

### L2. Improve Seed Script Robustness

**File:** `prisma/seed.ts`
**Problem:** Seed creates scenarios without checking for existing data. Running seed twice creates duplicates.

**Fix:** Use `upsert` instead of `create` for scenarios and sites:

```typescript
await prisma.scenario.upsert({
  where: { name: 'Baseline Plan' },
  create: { name: 'Baseline Plan', isBase: true, ... },
  update: {}, // No-op if exists
});
```

**Acceptance criteria:**
- [ ] `npx prisma db seed` can be run multiple times safely
- [ ] No duplicate records on repeated runs

**Estimated effort:** 30 min

---

### L3. Add Pre-commit Hook or CI Check

**File:** `.husky/pre-commit` (new), or GitHub Actions workflow
**Problem:** `npx tsc --noEmit` is a manual step. Type errors can slip into commits.

**Fix:** Add a pre-commit hook:

```bash
#!/usr/bin/env sh
npx tsc --noEmit
npm run test
```

Or a GitHub Actions workflow:

```yaml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm install
      - run: npx prisma generate
      - run: npm run build
      - run: npm run test
```

**Estimated effort:** 30 min

---

## Implementation Order & Dependencies

```
Phase 1 (Critical)          Phase 2 (High)            Phase 3 (Medium)         Phase 4 (Low)
─────────────               ─────────────             ────────────             ─────────
C1: Error handling ──────→ H1: ScenarioView decom    M1: Accessibility        L1: docs README
C2: Zod validation ──────→ H2: Error boundaries     M2: Barrel exports       L2: Seed robustness
C3: Error display in UI ──→ H3: Loading states      M3: Docker volumes       L3: Pre-commit hook
                         H4: Engine test coverage   M4: Gauge trends
```

**Key dependencies:**
- C1 must be done before H1 (extracted components need `ActionResult` return type)
- C2 must be done before C3 (validation errors need the error display layer)
- C3 can be done after C1+C2 or in parallel
- H1–H4 are independent of each other
- M1–M4 are independent
- L1–L3 can be done anytime

---

## Rollback Plan

Each phase is isolated. If a phase causes issues:

| Phase | Rollback |
|-------|----------|
| C1 (error handling) | Revert `lib/actions.ts` to previous version, update components to ignore return values |
| C2 (Zod validation) | Remove `lib/schemas.ts`, revert actions to raw parsing |
| C3 (error display) | Remove `useActionResult` hook, revert component updates |
| H1 (ScenarioView) | Revert to monolithic ScenarioView, delete extracted components |
| H2 (error boundaries) | Remove ErrorBoundary wrapper and error.tsx files |
| H3 (loading states) | Remove disabled/loading from form buttons |
| H4 (tests) | Delete new test file |
| M1–M4 | Revert individual file changes |
| L1–L3 | Delete new files |

**Safety measures:**
- Each phase is on its own git branch
- Run `npm run test` after every phase
- Run `npx tsc --noEmit` after every phase
- Manual smoke test in browser after every phase
