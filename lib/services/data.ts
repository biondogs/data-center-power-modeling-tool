import { prisma } from "@/lib/db";

export async function getCatalogItems() {
    return await prisma.catalogItem.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function getScenarios() {
    return await prisma.scenario.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { sites: true }
            }
        }
    });
}

export async function getScenarioById(id: string) {
    return await prisma.scenario.findUnique({
        where: { id },
        include: {
            sites: {
                include: {
                    lineItems: {
                        include: { catalogItem: true }
                    }
                }
            },
            assumptions: true
        }
    });
}
