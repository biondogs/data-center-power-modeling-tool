# Security & Reliability Audit Report
**Project:** Power Modeling Tool  
**Date:** 2025  
**Scope:** Full codebase — server actions, engine, Prisma schema, forms, Docker, exports

---

## Executive Summary

This project is a **local-only, no-auth Next.js application** backed by SQLite via Prisma. There are **zero authentication or authorization** mechanisms — which is acceptable if the app is intentionally local-only. However, there are significant gaps in **input validation** (Zod is a dependency but never imported), **division-by-zero** in calculations, **schema constraints**, and **race conditions** in multi-step mutations.

### Severity Legend
- 🔴 **CRITICAL** — Can cause data corruption, crashes, or data loss
- 🟠 **HIGH** — Can cause incorrect results or reliability issues
- 🟡 **MEDIUM** — Should be fixed for robustness
- 🔵 **LOW** — Nice-to-have improvement

---

## 1. Input Validation — Server Actions (`lib/actions.ts`)

### 🔴 CRITICAL: Zero Zod Validation on Server Actions

**Zod is listed as a dependency (`zod@^4.3.5`) but is never imported anywhere in the project.** A search for `import.*zod` across the entire codebase returns zero results. This means every server action accepts raw, unvalidated input.

**Affected functions:**

| Function | Input | Risk |
|---|---|---|
| `createScenario(formData: FormData)` | `formData.get("name") as string` | No type enforcement; could pass `null`, `undefined`, objects |
| `addLineItem(siteId, data)` | `catalogItemId`, `quantity`, `startQuarter` | Negative quantity, empty string IDs |
| `updateLineItem(id, data)` | Partial object with `quantity?: number` | Zero or negative quantity |
| `updateSiteSettings(siteId, data)` | All numeric fields unvalidated | Negative capacity, negative rates |
| `updateScenarioAssumptions(scenarioId, data)` | `coolingOverhead`, `globalInflation` | Zero overhead, extreme inflation |
| `createCatalogItem(data)` | `powerKw`, `cost` | Negative values |

**Fix:** Create Zod schemas and use `.parse()` or `.safeParse()` on every input:

```typescript
import { z } from "zod";

const AddLineItemSchema = z.object({
  siteId: z.string().uuid(),
  catalogItemId: z.string().uuid(),
  quantity: z.number().int().min(1),
  startQuarter: z.string().regex(/^\d{4}Q[1-4]$/),
  endQuarter: z.string().regex(/^\d{4}Q[1-4]$/).nullable().optional(),
  projectTag: z.string().max(100).optional(),
});

export async function addLineItem(siteId: string, data: unknown) {
  const parsed = AddLineItemSchema.parse({ siteId, ...data });
  // ... proceed with parsed data
}
```

### 🟡 MEDIUM: `createScenario` — `formData.get()` returns `string | null`, cast to `string`

```typescript
// Line 8-10: Unsafe casts — null becomes null, not caught by !name check
const name = formData.get("name") as string;         // Could be null
const description = formData.get("description") as string;  // Could be null
const cloneFromId = formData.get("cloneFromId") as string; // Could be null
```

`formData.get()` returns `string | null | File`. The `as string` cast is unsafe. The `if (!name)` check partially mitigates the name, but `description` and `cloneFromId` pass through as `null` when empty.

### 🟡 MEDIUM: `addLineItem` — No existence check on `siteId` or `catalogItemId`

If `siteId` or `catalogItemId` don't exist, Prisma throws a `PrismaClientKnownRequestError` which is swallowed silently by the caller — the UI never gets feedback.

### 🟡 MEDIUM: `updateLineItem` — Empty string `projectTag` not handled

```typescript
...(data.projectTag !== undefined && { projectTag: data.projectTag }),
```
An empty string `""` is not `undefined`, so it gets persisted. Should validate with `.trim()`.

---

## 2. XSS / CSRF

### 🔵 LOW: No XSS Risk (Current Architecture)

- All user data (scenario names, descriptions, project tags) is stored and re-rendered through React, which auto-escapes JSX content.
- No `dangerouslySetInnerHTML` found in the codebase.
- Export is JSON-only, not HTML.

### 🟠 HIGH: No CSRF Protection

- **No `middleware.ts`** file exists.
- **No CSRF token generation or validation.**
- Next.js server actions have built-in CSRF protection **when using the default cookie-based session**. However, this app has **no session cookie configuration** — so the protection may not apply.
- For a local-only tool, this is lower priority, but if this ever runs on a network, CSRF is a real concern.

**Fix:** Add `next.config.ts` headers or a middleware:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add anti-CSRF headers for local development
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}
```

---

## 3. Unauthorized Access Patterns

### 🔵 LOW: No Authentication Layer

There is no auth middleware, no login page, no role system. Every server action can be called by anyone who can reach the endpoint.

**Assessment:** Acceptable for a **local-only tool**, but:
- No check prevents accessing/deleting any scenario
- `deleteScenario(id)` and `deleteCatalogItems(ids)` have no ownership checks
- If deployed to a network, this is a **🔴 CRITICAL** vulnerability

**Recommendation:** At minimum, add a simple API key or local secret in `.env` for deployment scenarios.

---

## 4. Race Conditions in Mutations

### 🟠 HIGH: `updateScenarioAssumptions` — TOCTOU (Time-of-Check-Time-of-Use)

```typescript
// Line ~270-314
const scenario = await prisma.scenario.findUnique({ ... });
if (!scenario) throw new Error("Scenario not found");

// Between this check and the update, another request could delete the scenario
const coolingAssumption = scenario.assumptions.find(a => a.key === 'cooling_overhead');
if (coolingAssumption) {
  await prisma.assumption.update({
    where: { id: coolingAssumption.id },
    data: { value: data.coolingOverhead }
  });
}
```

If two requests fire concurrently, both find the assumption, both try to update — the last write wins with no conflict detection. SQLite's serial nature helps, but concurrent Next.js server actions can interleave.

### 🟡 MEDIUM: `deleteScenarios` — Partial failure on concurrent delete

```typescript
for (const id of ids) {
  const scenario = await prisma.scenario.findUnique({ where: { id } });
  if (scenario) {
    await prisma.scenario.delete({ where: { id } });
  }
}
```

If a scenario is deleted between `findUnique` and `delete`, the delete throws. The catch block returns `deletedCount: 0` even if some succeeded — misleading result.

### 🟡 MEDIUM: `createScenario` clone — No transaction

The deep copy of a scenario (assumptions + sites + lineItems) is a multi-entity insert with no `prisma.$transaction()`. If line items fail, assumptions and sites are already created — orphaned data.

**Fix:**
```typescript
newScenario = await prisma.$transaction(async (tx) => {
  return tx.scenario.create({ ... });
});
```

---

## 5. Cascade Delete Safety

### 🟡 MEDIUM: Scenario Delete — Cascading Deletes All Related Data

Schema cascade chain:
```
Scenario (onDelete: Cascade)
  → Site (onDelete: Cascade)
    → LineItem (onDelete: Cascade)
  → Assumption (onDelete: Cascade)
```

`deleteScenario(id)` deletes the scenario, all sites, all line items, all assumptions. This is intentional and properly cascade-configured. No issue here.

### 🔴 CRITICAL: `deleteCatalogItem` — Hard Delete Without `cascade`

```prisma
// LineItem → CatalogItem relation:
catalogItem CatalogItem @relation(fields: [catalogItemId], references: [id])
```

There is **no `onDelete: Cascade`** on the LineItem→CatalogItem relation. This means:
- If a CatalogItem is deleted while LineItems reference it → **Prisma throws** (foreign key violation)
- The `deleteCatalogItem` function catches this and shows "Cannot delete item in use" — this is correct behavior
- BUT `deleteCatalogItems` (batch delete) checks `item.lineItems.length` before deleting — this check-to-delete is a **race condition**

**Risk:** In high-concurrency scenarios, a LineItem could be added between the check and the delete.

---

## 6. Division by Zero in Calculations

### 🟠 HIGH: `capacity.ts` — Multiple Divisions Without Zero Guards

**Line 45:** `proj.totalItPowerMw / site.totalItCapacityMw` — guarded by `if (site.totalItCapacityMw > 0)` ✅

**Line 75:** `proj.totalFacilityPowerMw / site.electricalCapacityMw` — guarded by `if (site.electricalCapacityMw > 0)` ✅

**Line 103:** `mechanicalKw / totalCoolingKw` — guarded by `if (totalCoolingKw > 0)` ✅

**Line 127:** `site.usedRackSpaceU / site.totalRackSpaceU` — guarded by `if (site.totalRackSpaceU > 0)` ✅

These are well-guarded. ✅

### 🟠 HIGH: `comparison.ts` — `calculateDeltas` Handles Zero Base

```typescript
// Line 146-151
if (Math.abs(baseValue) < 0.0001) {
  return {
    delta,
    percentChange: compareValue > 0 ? Infinity : 0,
  };
}
```

Returns `Infinity` for percentChange — this will break charting/rendering in the UI (Recharts will likely crash or show NaN). Should clamp to a max value.

### 🟡 MEDIUM: `aggregator.ts` — `currentRate` Initialization

```typescript
let currentRate = baseRate;
```
If `baseRate` is `0` (from `site.electricityRatePerKwh || 0.10`), the rate stays 0. The fallback `0.10` handles the `null` case, but a user could set `0` intentionally. Utility costs would be 0 — silently wrong.

### 🔵 LOW: `whatif.ts` — `Math.max(...emptyArray)`

```typescript
const peak = Math.max(...siteProjections.map((p) => p.totalItPowerMw));
```

If `siteProjections` is empty, `Math.max(...[])` returns `-Infinity`. No crash, but `-Infinity` propagates into deltas.

---

## 7. Empty State Handling

### 🟡 MEDIUM: `aggregator.ts` — `calculateSummary` Empty Guard ✅

```typescript
if (projections.length === 0) {
  return { peakPowerMw: 0, ... };
}
```

Good guard. But the calling code in `whatif.ts` doesn't guard before calling `Math.max(...siteProjections.map(...))` on potentially empty projections.

### 🟡 MEDIUM: `capacity.ts` — Empty Projections Default

```typescript
let peakQuarter = projections[0]?.quarter || '';
```

If projections is empty, `peakQuarter` is `''`. Downstream rendering may break.

### 🟡 MEDIUM: `projector.ts` — Empty Quarters Range

```typescript
const quarters = TimeUtils.generateRange(settings.horizonStart, settings.horizonEnd);
```

If `horizonStart` > `horizonEnd`, `generateRange` returns an empty array. `quarters.map()` produces `[]`. No crash, but silent empty result.

---

## 8. Prisma Schema Issues (`prisma/schema.prisma`)

### 🔴 CRITICAL: `CatalogItem.name` — No Length Limit

```prisma
name String @unique
```

No `@db.VarChar(N)` or Prisma constraint. In SQLite, strings have no inherent limit, but for data quality and UI layout, a max length should be set.

### 🟠 HIGH: `LineItem.quantity` — No Positive Constraint

```prisma
quantity Int
```

No `@default(1)` or validation. A user could insert `quantity: 0` or `quantity: -5`. All downstream calculations would produce wrong results silently.

### 🟠 HIGH: `CatalogItem.powerKw` and `CatalogItem.cost` — No Non-Negative Constraint

```prisma
powerKw Float
cost Float
```

Negative values are allowed. Negative power = negative load calculations. Negative cost = negative CAPEX.

### 🟠 HIGH: `Site` Capacity Fields — No Non-Negative Constraint

```prisma
totalItCapacityMw Float @default(0)
electricalCapacityMw Float @default(0)
electricityRatePerKwh Float @default(0.10)
```

Negative capacity or negative electricity rate is allowed and would silently corrupt projections.

### 🟡 MEDIUM: `Site.scenarioId` + `Site.name` Unique Constraint ✅

```prisma
@@unique([scenarioId, name])
```

Good — prevents duplicate site names within a scenario.

### 🟡 MEDIUM: `Assumption.scenarioId` + `Assumption.key` Unique Constraint ✅

```prisma
@@unique([scenarioId, key])
```

Good — prevents duplicate assumptions.

### 🟡 MEDIUM: `Scenario.name` — No Uniqueness Constraint

```prisma
name String
```

Multiple scenarios can have the same name. Not a bug, but confusing.

### 🟡 MEDIUM: `Scenario.isBase` — No Constraint Preventing Multiple Base Scenarios

```prisma
isBase Boolean @default(false)
```

Nothing prevents creating 10 "base" scenarios. The UI may rely on exactly one.

### 🔵 LOW: `CatalogItem` Missing Index on `category`

Frequent filtering by category (GPU, CPU, Storage) would benefit from an index.

### 🔵 LOW: `LineItem` Missing Composite Index

Frequent queries filter `LineItem` by `siteId` + `startQuarter`. A composite index would help:
```prisma
@@index([siteId, startQuarter])
```

---

## 9. Seed Data Integrity (`prisma/seed.ts`)

### 🔵 LOW: `findUnique` on `name` vs `findFirst` for Scenario

```typescript
const exists = await prisma.catalogItem.findUnique({ where: { name: item.name } })
```

Uses `findUnique` which matches the `@unique` constraint. Correct. ✅

```typescript
let scenario = await prisma.scenario.findFirst({ where: { name: scenarioName } })
```

Uses `findFirst` because `name` is not unique. Correct. ✅

### 🟡 MEDIUM: No Idempotency for Assumptions

The seed creates assumptions inline with `create`. If a scenario already exists, the seed skips it entirely — so assumptions are only created for new scenarios. If the schema changes to add new assumption keys, they won't be backfilled.

### 🟡 MEDIUM: Seed `vendor` Mismatch

The "A100-8" item has `vendor: 'SMC'` but A100 is an NVIDIA product. Data quality issue, not a code bug.

---

## 10. Form Components — Validation

### 🔴 CRITICAL: Zero Zod/React-Hook-Form Validation

Zod (`v4.3.5`) and `@hookform/resolvers` (`v5.2.2`) are both **installed** but **never used**. A search for `import.*zod` across the codebase returns **zero hits**.

**Affected components:**
- `components/scenario/SiteSettingsEditor.tsx` — numeric inputs with no schema
- `components/scenario/AddLineItemDialog.tsx` — no schema
- `components/scenario/EditLineItemDialog.tsx` — no schema
- `components/catalog/CatalogDialog.tsx` — no schema

All forms use raw `useState` + direct server action calls with no client-side or server-side schema validation.

**Fix example:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const SiteSettingsSchema = z.object({
  totalItCapacityMw: z.number().min(0),
  electricalCapacityMw: z.number().min(0),
  electricityRatePerKwh: z.number().min(0),
  inflationRate: z.number().min(0).max(1),
  baselineItPowerMw: z.number().min(0),
  baselineMechanicalMw: z.number().min(0),
});

type SiteSettingsInput = z.infer<typeof SiteSettingsSchema>;

const form = useForm<SiteSettingsInput>({
  resolver: zodResolver(SiteSettingsSchema),
  defaultValues: { ... },
});
```

---

## 11. Export Data Sanitization

### 🔵 LOW: Export Functions — Raw DB Data

`exportScenario` and `exportAllScenarios` return raw Prisma data. No fields are stripped, masked, or sanitized.

- **IDs are exposed** (UUIDs) — not sensitive for local use
- **No PII** in this application
- JSON output is safe (no HTML/JS injection vectors in numeric/string data)

**Verdict:** Acceptable for a local-only tool.

### 🟡 MEDIUM: Export Contains All Scenarios Including Deleted Ones

If soft-delete were ever implemented, the export would need filtering. Currently all deletes are hard deletes, so this is not an issue.

---

## 12. SQLite Limitations and Concurrency

### 🟠 HIGH: SQLite Write Concurrency

SQLite allows only **one writer at a time**. Concurrent server actions that write (createScenario, addLineItem, updateLineItem, deleteScenario) will cause `SqliteError: database is locked` under load.

- **Current impact:** Low for a single-user local tool
- **Risk:** If deployed behind a reverse proxy or used by multiple tabs, concurrent writes deadlock

**Mitigation:** Prisma's connection pooling helps, but doesn't solve SQLite's single-writer limit. For production multi-user, migrate to PostgreSQL.

### 🟡 MEDIUM: No WAL Mode

SQLite in WAL (Write-Ahead Logging) mode handles reads-during-writes better. The `.env` doesn't specify WAL mode.

**Fix:** Append `?connection_limit=1&pool_timeout=2000&verbose=false` to DATABASE_URL, or enable WAL mode:
```
DATABASE_URL="file:./dev.db?mode=rw"
```

Or execute `PRAGMA journal_mode=WAL;` on connection.

### 🔵 LOW: `db.ts` — Prisma Instance Logging in Production

```typescript
new PrismaClient({
    log: ["query"],  // Logs ALL queries to console
});
```

In production Docker, this floods stdout with query logs. Should be conditional:

```typescript
log: process.env.NODE_ENV === 'development' ? ["query"] : ["error"],
```

---

## 13. Environment Variable Security

### 🟡 MEDIUM: `.env.example` — Minimal Documentation

```
DATABASE_URL="file:./dev.db"
```

Only one variable documented. No `.env.local` file found. Missing:
- No note about `DATABASE_URL` format
- No `.env.example` mentions that Prisma needs `dotenv` import
- No API key / auth secret placeholder for future deployment

### 🔵 LOW: No Secrets in Codebase

No hardcoded passwords, API keys, or tokens found. ✅

---

## 14. Docker Security

### 🟡 MEDIUM: Dockerfile — Seed Script in Production Image

```dockerfile
COPY --from=builder /app/prisma/seed.ts ./prisma/
```

The seed script is copied into the production runner stage. Not a security risk, but unnecessary image bloat.

### 🟡 MEDIUM: Dockerfile — Node Source Image

```dockerfile
FROM node:20-slim AS runner
```

`node:20-slim` is fine, but `node:20-alpine` is smaller and has a reduced attack surface. The slim image does include `apt` and a larger base.

### 🔵 LOW: Dockerfile — Non-Root User ✅

```dockerfile
USER node
```

Good practice. ✅

### 🔵 LOW: Docker Compose — No Resource Limits

No `deploy.resources` limits in `docker-compose.yml`. If the SQLite DB grows large, it could consume unlimited disk/memory.

### 🔵 LOW: Docker — Health Check ✅

Both Dockerfile and docker-compose have health checks configured. ✅

### 🔵 LOW: Docker — `DATABASE_URL` in Environment

```yaml
environment:
  - DATABASE_URL=file:/data/dev.db
```

Exposed in Docker config, but SQLite file is on a named volume — acceptable. ✅

---

## 15. next.config.ts

### 🔵 LOW: Standalone Output ✅

```typescript
output: "standalone",
```

Good for Docker builds. ✅

### 🟡 MEDIUM: No Security Headers

No `headers` configuration in `next.config.ts`. Missing:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (for HTTPS deployments)

---

## 16. Additional Findings

### 🟡 MEDIUM: Error Handling — Generic Messages

```typescript
} catch (e) {
  console.error("Failed to export scenario", e);
  return { success: false, error: "Failed to export scenario" };
}
```

Error messages are generic — good for security (no info leakage), but `console.error` in production Docker may not be visible without log aggregation.

### 🟡 MEDIUM: `deleteCatalogItems` — Loop, Not Batch

```typescript
for (const id of ids) {
  // ... find, check, delete one by one
}
```

Should use `prisma.$transaction()` for atomicity and `deleteMany` for the items that pass validation.

### 🔵 LOW: `TimeUtils.parse` — Good Error Handling ✅

Throws on invalid quarter format. Used defensively throughout engine. ✅

### 🔵 LOW: `comparison.ts` — `calculateSummaryDifferences` Empty Guard ✅

```typescript
const basePeakPower = base.length > 0 ? Math.max(...) : 0;
```

Properly guards empty arrays. ✅

---

## Priority Fix Order

| Priority | Issue | File | Effort |
|---|---|---|---|
| 1 | Add Zod validation to all server actions | `lib/actions.ts` | Medium |
| 2 | Add Zod + react-hook-form to all form components | `components/` | Medium |
| 3 | Wrap `createScenario` clone in `$transaction` | `lib/actions.ts` | Small |
| 4 | Fix `Infinity` percentChange in comparison | `lib/engine/comparison.ts` | Small |
| 5 | Add `onDelete` constraints or validation to `quantity`/`powerKw`/`cost` | `prisma/schema.prisma` | Small |
| 6 | Fix `deleteScenarios` partial failure reporting | `lib/actions.ts` | Small |
| 7 | Add security headers to `next.config.ts` | `next.config.ts` | Small |
| 8 | Conditional Prisma query logging | `lib/db.ts` | Tiny |
| 9 | Enable SQLite WAL mode | `.env` | Tiny |
| 10 | Add `middleware.ts` for CSRF headers | `middleware.ts` (new) | Small |

---

## SQL Injection Risk

**✅ No SQL injection risk.** All database access goes through Prisma Client, which uses parameterized queries exclusively. No raw `.execute()` or interpolated SQL found in the codebase.
