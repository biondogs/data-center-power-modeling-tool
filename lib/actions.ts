"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionResult } from "@/lib/useServerAction";

export async function createScenario(formData: FormData): Promise<ActionResult> {
    try {
        const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const cloneFromId = formData.get("cloneFromId") as string;

    if (!name) throw new Error("Name is required");

    let newScenario;

    if (cloneFromId) {
        // Deep copy logic
        const source = await prisma.scenario.findUnique({
            where: { id: cloneFromId },
            include: {
                assumptions: true,
                sites: { include: { lineItems: true } }
            }
        });

        if (!source) throw new Error("Source scenario not found");

        newScenario = await prisma.scenario.create({
            data: {
                name: `${name} (Copy)`,
                description: description || source.description,
                isBase: false,
                horizonStart: source.horizonStart,
                horizonEnd: source.horizonEnd,
                assumptions: {
                    create: source.assumptions.map(a => ({ key: a.key, value: a.value }))
                },
                sites: {
                    create: source.sites.map(s => ({
                        name: s.name,
                        totalItCapacityMw: s.totalItCapacityMw,
                        electricalCapacityMw: s.electricalCapacityMw,
                        electricityRatePerKwh: s.electricityRatePerKwh,
                        inflationRate: s.inflationRate,
                        baselineItPowerMw: s.baselineItPowerMw,
                        baselineMechanicalMw: s.baselineMechanicalMw,
                        lineItems: {
                            create: s.lineItems.map(li => ({
                                catalogItemId: li.catalogItemId,
                                projectTag: li.projectTag,
                                startQuarter: li.startQuarter,
                                endQuarter: li.endQuarter,
                                quantity: li.quantity
                            }))
                        }
                    }))
                }
            }
        });
    } else {
        newScenario = await prisma.scenario.create({
            data: {
                name,
                description,
                isBase: false,
                horizonStart: '2024Q1',
                horizonEnd: '2026Q4',
                assumptions: {
                    create: [
                        { key: 'inflation_rate', value: 0.10 },
                        { key: 'cooling_overhead', value: 1.35 }
                    ]
                },
                sites: {
                    create: [
                        {
                            name: 'BayView',
                            totalItCapacityMw: 12,
                            electricityRatePerKwh: 0.10,
                            inflationRate: 0.10
                        },
                        {
                            name: 'Mt.Wash',
                            totalItCapacityMw: 1.05,
                            electricityRatePerKwh: 0.0755,
                            inflationRate: 0.0
                        },
                        {
                            name: 'Bloomberg',
                            totalItCapacityMw: 1.2,
                            electricityRatePerKwh: 0.10,
                            inflationRate: 0.10
                        }
                    ]
                }
            }
        });
    }

    revalidatePath("/");
    redirect(`/scenarios/${newScenario.id}`);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : "Failed");
  }
}

export async function addLineItem(siteId: string, data: {
    catalogItemId: string;
    quantity: number;
    startQuarter: string;
    endQuarter?: string;
    projectTag?: string;
}): Promise<ActionResult> {
    try {
        await prisma.lineItem.create({
            data: {
                siteId,
                ...data
            }
        });

        const site = await prisma.site.findUnique({ where: { id: siteId } });
        if (site) {
            revalidatePath(`/scenarios/${site.scenarioId}`);
        }

        return { success: true };
    } catch (e) {
        console.error('[addLineItem] Error:', e);
        const msg = e instanceof Error ? e.message : 'Operation failed';
        return { success: false, error: msg };
    }
}

export async function updateLineItem(id: string, data: {
    catalogItemId?: string;
    quantity?: number;
    startQuarter?: string;
    endQuarter?: string | null;
    projectTag?: string;
}): Promise<ActionResult> {
    try {
        const item = await prisma.lineItem.findUnique({ where: { id } });
        if (!item) {
            return { success: false, error: "Line item not found" };
        }

        await prisma.lineItem.update({
            where: { id },
            data: {
                ...(data.catalogItemId && { catalogItemId: data.catalogItemId }),
                ...(data.quantity !== undefined && { quantity: data.quantity }),
                ...(data.startQuarter && { startQuarter: data.startQuarter }),
                ...(data.endQuarter !== undefined && { endQuarter: data.endQuarter }),
                ...(data.projectTag !== undefined && { projectTag: data.projectTag }),
            }
        });

        const site = await prisma.site.findUnique({ where: { id: item.siteId } });
        if (site) {
            revalidatePath(`/scenarios/${site.scenarioId}`);
        }

        return { success: true };
    } catch (e) {
        console.error('[updateLineItem] Error:', e);
        const msg = e instanceof Error ? e.message : 'Operation failed';
        return { success: false, error: msg };
    }
}

export async function deleteLineItem(id: string): Promise<ActionResult> {
    try {
        const item = await prisma.lineItem.findUnique({ where: { id } });
        if (item) {
            const site = await prisma.site.findUnique({ where: { id: item.siteId } });
            await prisma.lineItem.delete({ where: { id } });
            if (site) {
                revalidatePath(`/scenarios/${site.scenarioId}`);
            }
        }

        return { success: true };
    } catch (e) {
        console.error('[deleteLineItem] Error:', e);
        const msg = e instanceof Error ? e.message : 'Operation failed';
        return { success: false, error: msg };
    }
}

// Catalog Actions

export async function createCatalogItem(data: {
    name: string;
    category: string;
    vendor?: string;
    model?: string;
    powerKw: number;
    cost: number;
    capacityType?: string;
    capacityVal?: number;
}): Promise<ActionResult> {
    try {
        await prisma.catalogItem.create({ data });
        revalidatePath("/catalog");
        revalidatePath("/");
        return { success: true };
    } catch (e) {
        console.error('[createCatalogItem] Error:', e);
        const msg = e instanceof Error ? e.message : 'Operation failed';
        return { success: false, error: msg };
    }
}

export async function updateCatalogItem(id: string, data: {
    name: string;
    category: string;
    vendor?: string;
    model?: string;
    powerKw: number;
    cost: number;
    capacityType?: string;
    capacityVal?: number;
}): Promise<ActionResult> {
    try {
        await prisma.catalogItem.update({
            where: { id },
            data
        });
        revalidatePath("/catalog");
        return { success: true };
    } catch (e) {
        console.error('[updateCatalogItem] Error:', e);
        const msg = e instanceof Error ? e.message : 'Operation failed';
        return { success: false, error: msg };
    }
}

export async function deleteCatalogItem(id: string): Promise<ActionResult> {
    try {
        await prisma.catalogItem.delete({ where: { id } });
        revalidatePath("/catalog");
        return { success: true };
    } catch (e) {
        console.error('[deleteCatalogItem] Error:', e);
        const msg = e instanceof Error ? e.message : 'Operation failed';
        return { success: false, error: msg };
    }
}

export async function deleteCatalogItems(ids: string[]): Promise<{ success: boolean; deletedCount: number; failedCount: number; errors: string[] }> {
    let deletedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const id of ids) {
        try {
            const item = await prisma.catalogItem.findUnique({
                where: { id },
                include: { lineItems: true }
            });

            if (!item) {
                failedCount++;
                errors.push(`Item not found: ${id}`);
                continue;
            }

            if (item.lineItems.length > 0) {
                failedCount++;
                errors.push(`Cannot delete "${item.name}" - it's in use by ${item.lineItems.length} line item(s)`);
                continue;
            }

            await prisma.catalogItem.delete({ where: { id } });
            deletedCount++;
        } catch (e) {
            console.error("Failed to delete catalog item", e);
            failedCount++;
            errors.push(`Failed to delete item ${id}`);
        }
    }

    revalidatePath("/catalog");
    return { success: deletedCount > 0, deletedCount, failedCount, errors };
}

// Site Settings Actions

export async function updateSiteSettings(
    siteId: string,
    data: {
        totalItCapacityMw: number;
        electricalCapacityMw: number;
        electricityRatePerKwh: number;
        inflationRate: number;
        baselineItPowerMw: number;
        baselineMechanicalMw: number;
    }
): Promise<ActionResult> {
    try {
        const site = await prisma.site.update({
            where: { id: siteId },
            data
        });

        revalidatePath(`/scenarios/${site.scenarioId}`);
        return { success: true };
    } catch (e) {
        console.error('[updateSiteSettings] Error:', e);
        const msg = e instanceof Error ? e.message : 'Operation failed';
        return { success: false, error: msg };
    }
}

export async function updateScenarioAssumptions(
    scenarioId: string,
    data: {
        coolingOverhead: number;
        globalInflation: number;
    }
): Promise<ActionResult> {
    try {
        const scenario = await prisma.scenario.findUnique({
            where: { id: scenarioId },
            include: { assumptions: true }
        });

        if (!scenario) throw new Error("Scenario not found");

        // Update or create cooling_overhead assumption
        const coolingAssumption = scenario.assumptions.find(a => a.key === 'cooling_overhead');
        if (coolingAssumption) {
            await prisma.assumption.update({
                where: { id: coolingAssumption.id },
                data: { value: data.coolingOverhead }
            });
        } else {
            await prisma.assumption.create({
                data: {
                    scenarioId,
                    key: 'cooling_overhead',
                    value: data.coolingOverhead
                }
            });
        }

        // Update or create inflation_rate assumption
        const inflationAssumption = scenario.assumptions.find(a => a.key === 'inflation_rate');
        if (inflationAssumption) {
            await prisma.assumption.update({
                where: { id: inflationAssumption.id },
                data: { value: data.globalInflation }
            });
        } else {
            await prisma.assumption.create({
                data: {
                    scenarioId,
                    key: 'inflation_rate',
                    value: data.globalInflation
                }
            });
        }

        revalidatePath(`/scenarios/${scenarioId}`);
        return { success: true };
    } catch (e) {
        console.error('[updateScenarioAssumptions] Error:', e);
        const msg = e instanceof Error ? e.message : 'Operation failed';
        return { success: false, error: msg };
    }
}

export async function deleteScenario(id: string): Promise<ActionResult> {
    try {
        const scenario = await prisma.scenario.findUnique({
            where: { id }
        });

        if (!scenario) {
            return { success: false, error: "Scenario not found" };
        }

        // Delete scenario and all related data (cascade will handle lineItems, sites, assumptions)
        await prisma.scenario.delete({ where: { id } });

        revalidatePath("/");
        return { success: true };
    } catch (e) {
        console.error('[deleteScenario] Error:', e);
        const msg = e instanceof Error ? e.message : 'Operation failed';
        return { success: false, error: msg };
    }
}

export async function deleteScenarios(ids: string[]): Promise<ActionResult> {
    try {
        let deletedCount = 0;

        for (const id of ids) {
            const scenario = await prisma.scenario.findUnique({ where: { id } });
            if (scenario) {
                await prisma.scenario.delete({ where: { id } });
                deletedCount++;
            }
        }

        revalidatePath("/");
        return { success: true };
    } catch (e) {
        console.error('[deleteScenarios] Error:', e);
        const msg = e instanceof Error ? e.message : 'Operation failed';
        return { success: false, error: msg };
    }
}

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
