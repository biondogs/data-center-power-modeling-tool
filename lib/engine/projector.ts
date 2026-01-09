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
};

export class Projector {
    // Projects a single line item over the horizon
    static projectLineItem(
        item: LineItem & { catalogItem: CatalogItem },
        settings: ProjectorSettings
    ): ProjectedPoint[] {
        const quarters = TimeUtils.generateRange(settings.horizonStart, settings.horizonEnd);

        // Determine lifecycle
        const startIdx = TimeUtils.toIndex(item.startQuarter);
        const endIdx = item.endQuarter
            ? TimeUtils.toIndex(item.endQuarter)
            : TimeUtils.toIndex(settings.horizonEnd) + 100; // Indefinite

        return quarters.map((q) => {
            const currentIdx = TimeUtils.toIndex(q);
            const isActive = currentIdx >= startIdx && currentIdx < endIdx;

            // Is this the first quarter of deployment? (For Capex)
            const isDeploymentQuarter = currentIdx === startIdx;

            // Values
            const activeUnits = isActive ? item.quantity : 0;

            // Calculations
            // Power = units * kW_per_unit / 1000 (to get MW)
            const powerMw = (activeUnits * item.catalogItem.powerKw) / 1000;

            // Capex = units * cost_per_unit (only in deployment quarter)
            // Note: In real world, capex might be spread, but prompt says "Excel is essentially flagging the first active quarter"
            const capex = isDeploymentQuarter ? (item.quantity * item.catalogItem.cost) : 0;

            // Opex proxy = Power * AnnualRate? 
            // Prompt says "opex proxy (currently computed as power × annual rate)"
            // This usually needs the "Rate" from assumptions. 
            // For this purely physical projection, we might skip cost-$ calculations or return raw power for later rate application.
            // But let's return a placeholder or 0 if we don't have rates.
            // We'll leave opex as 0 here and handle it in the Aggregator where we have access to Rates/Assumptions.

            // Capacity
            const capacityVal = activeUnits * (item.catalogItem.capacityVal || 0);

            return {
                quarter: q,
                activeUnits,
                powerMw,
                capex,
                opex: 0, // Calculated later
                capacity: {
                    type: item.catalogItem.capacityType,
                    value: capacityVal
                }
            };
        });
    }
}
