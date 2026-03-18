import { CatalogItem, LineItem } from "@prisma/client";
import { TimeUtils } from "./time";

export type ProjectorSettings = {
    horizonStart: string;
    horizonEnd: string;
};

export type ProjectedPoint = {
    quarter: string;
    activeUnits: number; // Units online in this quarter
    powerMw: number;
    capex: number;
    opex: number;
    capacity: {
        type: string | null;
        value: number;
    };
    projectTag?: string; // Track which project this belongs to
};

export class Projector {
    /**
     * Projects a single line item over the horizon
     * Returns quarterly breakdown of power, capex, capacity
     */
    static projectLineItem(
        item: LineItem & { catalogItem: CatalogItem },
        settings: ProjectorSettings
    ): ProjectedPoint[] {
        const quarters = TimeUtils.generateRange(settings.horizonStart, settings.horizonEnd);

        // Determine lifecycle based on start/end quarters
        const startIdx = TimeUtils.toIndex(item.startQuarter);
        const endIdx = item.endQuarter
            ? TimeUtils.toIndex(item.endQuarter)
            : TimeUtils.toIndex(settings.horizonEnd) + 100; // Indefinite (extends beyond horizon)

        return quarters.map((q) => {
            const currentIdx = TimeUtils.toIndex(q);
            const isActive = currentIdx >= startIdx && currentIdx < endIdx;

            // Is this the first quarter of deployment? (For Capex calculation)
            const isDeploymentQuarter = currentIdx === startIdx;

            // Values
            const activeUnits = isActive ? item.quantity : 0;

            // --- Calculations matching Excel formulas ---

            // Power = units * kW_per_unit / 1000 (to get MW)
            // Excel formula: `=I*G/1000` where I=qty, G=powerKw
            const powerMw = (activeUnits * item.catalogItem.powerKw) / 1000;

            // Capex = units * cost_per_unit (only in deployment quarter)
            // Excel: Capex hit only when equipment first arrives
            const capex = isDeploymentQuarter ? (item.quantity * item.catalogItem.cost) : 0;

            // Opex placeholder - calculated at aggregation level with rates
            const opex = 0;

            // Capacity tracking
            const capacityVal = activeUnits * (item.catalogItem.capacityVal || 0);

            return {
                quarter: q,
                activeUnits,
                powerMw,
                capex,
                opex,
                capacity: {
                    type: item.catalogItem.capacityType,
                    value: capacityVal
                },
                projectTag: item.projectTag || undefined
            };
        });
    }
}
