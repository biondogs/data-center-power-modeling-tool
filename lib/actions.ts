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
                assumptions: {
                    create: source.assumptions.map(a => ({ key: a.key, value: a.value }))
                },
                sites: {
                    create: source.sites.map(s => ({
                        name: s.name,
                        powerLimitMw: s.powerLimitMw,
                        baselinePowerMw: s.baselinePowerMw,
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
                assumptions: {
                    create: [
                        { key: 'inflation_rate', value: 0.03 },
                        { key: 'cooling_overhead', value: 1.35 }
                    ]
                },
                sites: {
                    create: [
                        { name: 'BayView', powerLimitMw: 50 },
                        { name: 'Mt. Wash', powerLimitMw: 30 },
                        { name: 'Bloomberg', powerLimitMw: 20 }
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
    powerKw: number;
    cost: number;
    capacityType?: string;
    capacityVal?: number;
    unitsPerBlock?: number;
}) {
    await prisma.catalogItem.create({ data });
    revalidatePath("/catalog");
    revalidatePath("/"); // Dashboard might use it?
}

export async function updateCatalogItem(id: string, data: {
    name: string;
    category: string;
    vendor?: string;
    powerKw: number;
    cost: number;
    capacityType?: string;
    capacityVal?: number;
    unitsPerBlock?: number;
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
