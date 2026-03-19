"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createScenario(formData: FormData) {
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
}

export async function addLineItem(siteId: string, data: {
    catalogItemId: string;
    quantity: number;
    startQuarter: string;
    endQuarter?: string;
    projectTag?: string;
}) {
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
}

export async function updateLineItem(id: string, data: {
    catalogItemId?: string;
    quantity?: number;
    startQuarter?: string;
    endQuarter?: string | null;
    projectTag?: string;
}) {
    const item = await prisma.lineItem.findUnique({ where: { id } });
    if (!item) {
        throw new Error("Line item not found");
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
}

export async function deleteLineItem(id: string) {
    const item = await prisma.lineItem.findUnique({ where: { id } });
    if (item) {
        const site = await prisma.site.findUnique({ where: { id: item.siteId } });
        await prisma.lineItem.delete({ where: { id } });
        if (site) {
            revalidatePath(`/scenarios/${site.scenarioId}`);
        }
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
}) {
    await prisma.catalogItem.create({ data });
    revalidatePath("/catalog");
    revalidatePath("/");
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
}) {
    await prisma.catalogItem.update({
        where: { id },
        data
    });
    revalidatePath("/catalog");
}

export async function deleteCatalogItem(id: string) {
    try {
        await prisma.catalogItem.delete({ where: { id } });
        revalidatePath("/catalog");
    } catch (e) {
        console.error("Failed to delete catalog item", e);
        throw new Error("Cannot delete item that is currently in use by a scenario.");
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
) {
    const site = await prisma.site.update({
        where: { id: siteId },
        data
    });

    revalidatePath(`/scenarios/${site.scenarioId}`);
}

export async function updateScenarioAssumptions(
    scenarioId: string,
    data: {
        coolingOverhead: number;
        globalInflation: number;
    }
) {
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
}

export async function deleteScenario(id: string): Promise<{ success: boolean; error?: string }> {
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
        console.error("Failed to delete scenario", e);
        return { success: false, error: "Failed to delete scenario" };
    }
}

export async function deleteScenarios(ids: string[]): Promise<{ success: boolean; deletedCount: number; error?: string }> {
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
        return { success: true, deletedCount };
    } catch (e) {
        console.error("Failed to delete scenarios", e);
        return { success: false, deletedCount: 0, error: "Failed to delete scenarios" };
    }
}
