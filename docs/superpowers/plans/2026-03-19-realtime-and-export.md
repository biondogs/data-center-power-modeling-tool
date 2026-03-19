# Real-time Updates & Export Functionality Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement two features: (1) Real-time UI updates when adding line items (no page refresh required), and (2) Export functionality for scenarios with all configuration data including catalog.

**Architecture:** 
- Feature 1: Use Next.js `router.refresh()` after server actions to trigger client-side data refetch without full page reload. Minimal change to existing patterns.
- Feature 2: Create JSON export with complete scenario data (sites, line items, assumptions) + referenced catalog items. Client-side file download.

**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma, shadcn/ui

---

## Chunk 1: Real-time Updates for Line Items

### Task 1.1: Modify AddLineItemDialog for Router Refresh

**Files:**
- Modify: `components/scenario/AddLineItemDialog.tsx`

**Context:**
The `AddLineItemDialog` currently calls `addLineItem` server action but doesn't refresh the page data after completion. Users must manually refresh to see new line items.

**Solution:**
Import `useRouter` from `next/navigation` and call `router.refresh()` after the server action completes. This triggers Next.js to refetch server data without full page reload.

- [ ] **Step 1: Add router import and hook**

```typescript
import { useRouter } from "next/navigation";

export function AddLineItemDialog({ siteId, catalogItems }: AddLineItemDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();  // ADD THIS
    // ...
}
```

- [ ] **Step 2: Call router.refresh() after mutation**

```typescript
async function onSubmit(formData: FormData) {
    setLoading(true);
    const catalogItemId = formData.get("catalogItemId") as string;
    const quantity = parseInt(formData.get("quantity") as string);
    const startQuarter = formData.get("startQuarter") as string;
    const endQuarter = formData.get("endQuarter") as string || undefined;
    const projectTag = formData.get("projectTag") as string || "";

    await addLineItem(siteId, {
        catalogItemId,
        quantity,
        startQuarter,
        endQuarter,
        projectTag
    });
    
    router.refresh();  // ADD THIS - triggers data refetch
    setLoading(false);
    setOpen(false);
}
```

- [ ] **Step 3: Test the change**

1. Start dev server: `npm run dev`
2. Navigate to a scenario with sites
3. Click "Add Line Item" in a SitePlanEditor
4. Fill form and submit
5. **Verify:** Line item appears in table immediately without manual page refresh

- [ ] **Step 4: Commit**

```bash
git add components/scenario/AddLineItemDialog.tsx
git commit -m "feat: add router.refresh() for real-time line item updates"
```

---

### Task 1.2: Modify EditLineItemDialog for Router Refresh

**Files:**
- Modify: `components/scenario/EditLineItemDialog.tsx`

**Context:**
Same issue - edits don't reflect until page refresh.

- [ ] **Step 1: Add router import and hook**

```typescript
import { useRouter } from "next/navigation";

export function EditLineItemDialog({ lineItem, catalogItems }: EditLineItemDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();  // ADD THIS
    // ...
}
```

- [ ] **Step 2: Call router.refresh() after update**

In the `onSubmit` function, after `await updateLineItem(...)`, add:
```typescript
router.refresh();
```

- [ ] **Step 3: Test**

1. Click edit on existing line item
2. Change quantity or dates
3. Submit
4. **Verify:** Table updates immediately with new values

- [ ] **Step 4: Commit**

```bash
git add components/scenario/EditLineItemDialog.tsx
git commit -m "feat: add router.refresh() for real-time line item edits"
```

---

### Task 1.3: Modify SitePlanEditor Delete for Router Refresh

**Files:**
- Modify: `components/scenario/SitePlanEditor.tsx`

**Context:**
Delete currently uses a form action. Need to wrap it to refresh after deletion.

- [ ] **Step 1: Add router import and create wrapper function**

```typescript
"use client";

import { useRouter } from "next/navigation";  // ADD THIS

interface SitePlanEditorProps {
    // ... existing props
}

export function SitePlanEditor({ site, catalogItems }: SitePlanEditorProps) {
    const router = useRouter();  // ADD THIS
    
    // ADD THIS WRAPPER FUNCTION
    async function handleDelete(lineItemId: string) {
        await deleteLineItem(lineItemId);
        router.refresh();
    }
    
    // ... rest of component
}
```

- [ ] **Step 2: Update delete button to use wrapper**

Change:
```typescript
<form action={() => deleteLineItem(item.id)}>
```

To:
```typescript
<form action={() => handleDelete(item.id)}>
```

- [ ] **Step 3: Test**

1. Click delete button on a line item
2. Confirm deletion
3. **Verify:** Item disappears from table immediately

- [ ] **Step 4: Commit**

```bash
git add components/scenario/SitePlanEditor.tsx
git commit -m "feat: add router.refresh() for real-time line item deletion"
```

---

## Chunk 2: Export Functionality

### Task 2.1: Create Export Server Action

**Files:**
- Modify: `lib/actions.ts`

**Context:**
Need to create a server action that exports all scenario data including sites, line items, assumptions, and referenced catalog items.

- [ ] **Step 1: Add exportScenario function to actions.ts**

Add at the end of `lib/actions.ts`:

```typescript
export async function exportScenario(scenarioId: string): Promise<{
    success: boolean;
    data?: {
        scenario: {
            id: string;
            name: string;
            description: string | null;
            horizonStart: string;
            horizonEnd: string;
            isBase: boolean;
        };
        sites: Array<{
            id: string;
            name: string;
            totalItCapacityMw: number;
            electricalCapacityMw: number;
            electricityRatePerKwh: number;
            inflationRate: number;
            baselineItPowerMw: number;
            baselineMechanicalMw: number;
            liquidCoolingCapacityKw: number;
            airCoolingCapacityKw: number;
            totalRackSpaceU: number;
            usedRackSpaceU: number;
            baselineLiquidCoolingKw: number;
            baselineAirCoolingKw: number;
            baselineElectricalKw: number;
        }>;
        assumptions: Array<{
            key: string;
            value: number;
        }>;
        lineItems: Array<{
            id: string;
            siteId: string;
            catalogItemId: string;
            projectTag: string | null;
            startQuarter: string;
            endQuarter: string | null;
            quantity: number;
            actualStartQuarter: string | null;
            actualEndQuarter: string | null;
            actualQuantity: number | null;
            varianceNotes: string | null;
        }>;
        catalogItems: Array<{
            id: string;
            name: string;
            category: string;
            model: string | null;
            vendor: string | null;
            powerKw: number;
            cost: number;
            capacityType: string | null;
            capacityVal: number | null;
            liquidCoolingCapacityKw: number | null;
            airCoolingCapacityKw: number | null;
            rackSpaceU: number | null;
            electricalCapacityKw: number | null;
        }>;
    };
    error?: string;
}> {
    try {
        const scenario = await prisma.scenario.findUnique({
            where: { id: scenarioId },
            include: {
                sites: true,
                assumptions: true,
            }
        });

        if (!scenario) {
            return { success: false, error: "Scenario not found" };
        }

        // Get all line items for this scenario's sites
        const siteIds = scenario.sites.map(s => s.id);
        const lineItems = await prisma.lineItem.findMany({
            where: { siteId: { in: siteIds } }
        });

        // Get all referenced catalog items
        const catalogItemIds = [...new Set(lineItems.map(li => li.catalogItemId))];
        const catalogItems = catalogItemIds.length > 0
            ? await prisma.catalogItem.findMany({
                where: { id: { in: catalogItemIds } }
            })
            : [];

        return {
            success: true,
            data: {
                scenario: {
                    id: scenario.id,
                    name: scenario.name,
                    description: scenario.description,
                    horizonStart: scenario.horizonStart,
                    horizonEnd: scenario.horizonEnd,
                    isBase: scenario.isBase,
                },
                sites: scenario.sites.map(s => ({
                    id: s.id,
                    name: s.name,
                    totalItCapacityMw: s.totalItCapacityMw,
                    electricalCapacityMw: s.electricalCapacityMw,
                    electricityRatePerKwh: s.electricityRatePerKwh,
                    inflationRate: s.inflationRate,
                    baselineItPowerMw: s.baselineItPowerMw,
                    baselineMechanicalMw: s.baselineMechanicalMw,
                    liquidCoolingCapacityKw: s.liquidCoolingCapacityKw,
                    airCoolingCapacityKw: s.airCoolingCapacityKw,
                    totalRackSpaceU: s.totalRackSpaceU,
                    usedRackSpaceU: s.usedRackSpaceU,
                    baselineLiquidCoolingKw: s.baselineLiquidCoolingKw,
                    baselineAirCoolingKw: s.baselineAirCoolingKw,
                    baselineElectricalKw: s.baselineElectricalKw,
                })),
                assumptions: scenario.assumptions.map(a => ({
                    key: a.key,
                    value: a.value,
                })),
                lineItems: lineItems.map(li => ({
                    id: li.id,
                    siteId: li.siteId,
                    catalogItemId: li.catalogItemId,
                    projectTag: li.projectTag,
                    startQuarter: li.startQuarter,
                    endQuarter: li.endQuarter,
                    quantity: li.quantity,
                    actualStartQuarter: li.actualStartQuarter,
                    actualEndQuarter: li.actualEndQuarter,
                    actualQuantity: li.actualQuantity,
                    varianceNotes: li.varianceNotes,
                })),
                catalogItems: catalogItems.map(ci => ({
                    id: ci.id,
                    name: ci.name,
                    category: ci.category,
                    model: ci.model,
                    vendor: ci.vendor,
                    powerKw: ci.powerKw,
                    cost: ci.cost,
                    capacityType: ci.capacityType,
                    capacityVal: ci.capacityVal,
                    liquidCoolingCapacityKw: ci.liquidCoolingCapacityKw,
                    airCoolingCapacityKw: ci.airCoolingCapacityKw,
                    rackSpaceU: ci.rackSpaceU,
                    electricalCapacityKw: ci.electricalCapacityKw,
                })),
            }
        };
    } catch (e) {
        console.error("Failed to export scenario", e);
        return { success: false, error: "Failed to export scenario" };
    }
}
```

- [ ] **Step 2: Test the action**

Create a quick test in a route handler or use it from a component to verify it returns correct data structure.

- [ ] **Step 3: Commit**

```bash
git add lib/actions.ts
git commit -m "feat: add exportScenario server action"
```

---

### Task 2.2: Create Export Button Component

**Files:**
- Create: `components/scenario/ExportScenarioButton.tsx`

**Context:**
Need a UI component that triggers the export and downloads the JSON file.

- [ ] **Step 1: Create the component**

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportScenario } from "@/lib/actions";

interface ExportScenarioButtonProps {
    scenarioId: string;
    scenarioName: string;
}

export function ExportScenarioButton({ scenarioId, scenarioName }: ExportScenarioButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleExport() {
        setLoading(true);
        try {
            const result = await exportScenario(scenarioId);
            
            if (result.success && result.data) {
                // Create JSON blob
                const jsonStr = JSON.stringify(result.data, null, 2);
                const blob = new Blob([jsonStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                
                // Create download link
                const a = document.createElement("a");
                a.href = url;
                a.download = `${scenarioName.replace(/[^a-zA-Z0-9-_]/g, "_")}_export_${new Date().toISOString().split("T")[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert(`Export failed: ${result.error || "Unknown error"}`);
            }
        } catch (e) {
            console.error("Export failed", e);
            alert("Export failed. See console for details.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={loading}
        >
            <Download className="h-4 w-4 mr-2" />
            {loading ? "Exporting..." : "Export"}
        </Button>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/scenario/ExportScenarioButton.tsx
git commit -m "feat: add ExportScenarioButton component"
```

---

### Task 2.3: Add Export Button to ScenarioView

**Files:**
- Modify: `components/scenario/ScenarioView.tsx`

**Context:**
Need to integrate the export button into the scenario detail view UI.

- [ ] **Step 1: Import and add ExportScenarioButton**

Add import:
```typescript
import { ExportScenarioButton } from "./ExportScenarioButton";
```

Find where other action buttons are rendered (likely near DeleteScenarioButton) and add:
```typescript
<ExportScenarioButton 
    scenarioId={scenario.id} 
    scenarioName={scenario.name} 
/>
```

- [ ] **Step 2: Test**

1. Navigate to a scenario
2. Click "Export" button
3. **Verify:** JSON file downloads with:
   - Scenario metadata
   - Sites array
   - Assumptions array
   - Line items array
   - Catalog items array (only referenced items)

- [ ] **Step 3: Commit**

```bash
git add components/scenario/ScenarioView.tsx
git commit -m "feat: integrate export button into scenario view"
```

---

### Task 2.4: Add Global Export All Functionality (Optional Enhancement)

**Files:**
- Modify: `lib/actions.ts`
- Modify: `components/dashboard/DashboardView.tsx` or appropriate location

**Context:**
User might want to export all scenarios at once for complete backup.

- [ ] **Step 1: Create exportAllScenarios action**

```typescript
export async function exportAllScenarios(): Promise<{
    success: boolean;
    data?: {
        exportDate: string;
        version: string;
        catalogItems: Array<{
            id: string;
            name: string;
            category: string;
            model: string | null;
            vendor: string | null;
            powerKw: number;
            cost: number;
            capacityType: string | null;
            capacityVal: number | null;
            liquidCoolingCapacityKw: number | null;
            airCoolingCapacityKw: number | null;
            rackSpaceU: number | null;
            electricalCapacityKw: number | null;
        }>;
        scenarios: Array<{
            id: string;
            name: string;
            description: string | null;
            horizonStart: string;
            horizonEnd: string;
            isBase: boolean;
            sites: Array<{
                id: string;
                name: string;
                totalItCapacityMw: number;
                electricalCapacityMw: number;
                electricityRatePerKwh: number;
                inflationRate: number;
                baselineItPowerMw: number;
                baselineMechanicalMw: number;
                liquidCoolingCapacityKw: number;
                airCoolingCapacityKw: number;
                totalRackSpaceU: number;
                usedRackSpaceU: number;
                baselineLiquidCoolingKw: number;
                baselineAirCoolingKw: number;
                baselineElectricalKw: number;
                lineItems: Array<{
                    id: string;
                    catalogItemId: string;
                    projectTag: string | null;
                    startQuarter: string;
                    endQuarter: string | null;
                    quantity: number;
                    actualStartQuarter: string | null;
                    actualEndQuarter: string | null;
                    actualQuantity: number | null;
                    varianceNotes: string | null;
                }>;
            }>;
            assumptions: Array<{
                key: string;
                value: number;
            }>;
        }>;
    };
    error?: string;
}> {
    try {
        const catalogItems = await prisma.catalogItem.findMany();
        const scenarios = await prisma.scenario.findMany({
            include: {
                sites: {
                    include: {
                        lineItems: true
                    }
                },
                assumptions: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return {
            success: true,
            data: {
                exportDate: new Date().toISOString(),
                version: "1.0",
                catalogItems: catalogItems.map(ci => ({
                    id: ci.id,
                    name: ci.name,
                    category: ci.category,
                    model: ci.model,
                    vendor: ci.vendor,
                    powerKw: ci.powerKw,
                    cost: ci.cost,
                    capacityType: ci.capacityType,
                    capacityVal: ci.capacityVal,
                    liquidCoolingCapacityKw: ci.liquidCoolingCapacityKw,
                    airCoolingCapacityKw: ci.airCoolingCapacityKw,
                    rackSpaceU: ci.rackSpaceU,
                    electricalCapacityKw: ci.electricalCapacityKw,
                })),
                scenarios: scenarios.map(s => ({
                    id: s.id,
                    name: s.name,
                    description: s.description,
                    horizonStart: s.horizonStart,
                    horizonEnd: s.horizonEnd,
                    isBase: s.isBase,
                    sites: s.sites.map(site => ({
                        id: site.id,
                        name: site.name,
                        totalItCapacityMw: site.totalItCapacityMw,
                        electricalCapacityMw: site.electricalCapacityMw,
                        electricityRatePerKwh: site.electricityRatePerKwh,
                        inflationRate: site.inflationRate,
                        baselineItPowerMw: site.baselineItPowerMw,
                        baselineMechanicalMw: site.baselineMechanicalMw,
                        liquidCoolingCapacityKw: site.liquidCoolingCapacityKw,
                        airCoolingCapacityKw: site.airCoolingCapacityKw,
                        totalRackSpaceU: site.totalRackSpaceU,
                        usedRackSpaceU: site.usedRackSpaceU,
                        baselineLiquidCoolingKw: site.baselineLiquidCoolingKw,
                        baselineAirCoolingKw: site.baselineAirCoolingKw,
                        baselineElectricalKw: site.baselineElectricalKw,
                        lineItems: site.lineItems.map(li => ({
                            id: li.id,
                            catalogItemId: li.catalogItemId,
                            projectTag: li.projectTag,
                            startQuarter: li.startQuarter,
                            endQuarter: li.endQuarter,
                            quantity: li.quantity,
                            actualStartQuarter: li.actualStartQuarter,
                            actualEndQuarter: li.actualEndQuarter,
                            actualQuantity: li.actualQuantity,
                            varianceNotes: li.varianceNotes,
                        })),
                    })),
                    assumptions: s.assumptions.map(a => ({
                        key: a.key,
                        value: a.value,
                    })),
                })),
            }
        };
    } catch (e) {
        console.error("Failed to export all scenarios", e);
        return { success: false, error: "Failed to export all scenarios" };
    }
}
```

- [ ] **Step 2: Create ExportAllButton component**

Create `components/ExportAllButton.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportAllScenarios } from "@/lib/actions";

export function ExportAllButton() {
    const [loading, setLoading] = useState(false);

    async function handleExport() {
        setLoading(true);
        try {
            const result = await exportAllScenarios();
            
            if (result.success && result.data) {
                const jsonStr = JSON.stringify(result.data, null, 2);
                const blob = new Blob([jsonStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement("a");
                a.href = url;
                a.download = `data_center_tool_backup_${new Date().toISOString().split("T")[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert(`Export failed: ${result.error || "Unknown error"}`);
            }
        } catch (e) {
            console.error("Export failed", e);
            alert("Export failed. See console for details.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleExport}
            disabled={loading}
        >
            <Download className="h-4 w-4 mr-2" />
            {loading ? "Exporting..." : "Export All"}
        </Button>
    );
}
```

- [ ] **Step 3: Add to dashboard or main page**

Add to `app/page.tsx` or `components/dashboard/DashboardView.tsx` near other action buttons.

- [ ] **Step 4: Commit**

```bash
git add lib/actions.ts components/ExportAllButton.tsx app/page.tsx
git commit -m "feat: add export all scenarios functionality"
```

---

## Summary

After completing all tasks:

1. **Real-time updates:** All line item CRUD operations (add, edit, delete) immediately reflect in the UI without manual page refresh
2. **Export functionality:** Users can export individual scenarios or all data as JSON for backup/sharing

**Files Modified/Created:**
- `components/scenario/AddLineItemDialog.tsx` - router.refresh()
- `components/scenario/EditLineItemDialog.tsx` - router.refresh()
- `components/scenario/SitePlanEditor.tsx` - router.refresh() wrapper
- `lib/actions.ts` - exportScenario() and exportAllScenarios()
- `components/scenario/ExportScenarioButton.tsx` - New
- `components/scenario/ScenarioView.tsx` - Add export button
- `components/ExportAllButton.tsx` - New (optional)
