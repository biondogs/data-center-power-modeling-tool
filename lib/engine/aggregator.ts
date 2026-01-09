import { Assumption, CatalogItem, LineItem, Site } from "@prisma/client";
import { Projector, ProjectorSettings } from "./projector";
import { TimeUtils } from "./time";

export type SiteProjection = {
    quarter: string;
    totalItPowerMw: number;
    adjustedPowerMw: number; // After cooling overhead
    utilityCost: number;
    capex: number;
    capacity: Record<string, number>; // "GPU": 100, "Cores": 5000
};

export class Aggregator {
    static aggregateSite(
        site: Site & { lineItems: (LineItem & { catalogItem: CatalogItem })[] },
        assumptions: Assumption[],
        settings: ProjectorSettings
    ): SiteProjection[] {
        const quarters = TimeUtils.generateRange(settings.horizonStart, settings.horizonEnd);

        // Resolve Assumptions
        const coolingOverhead = assumptions.find(a => a.key === 'cooling_overhead')?.value || 1.0;
        const baseRate = assumptions.find(a => a.key === 'electricity_rate_usd_kwh')?.value || 0.10; // Default $0.10
        const inflation = assumptions.find(a => a.key === 'inflation_rate')?.value || 0.0;

        // Project all line items independently
        const projections = site.lineItems.map(li => Projector.projectLineItem(li, settings));

        return quarters.map((q) => {
            // 1. Sum raw metrics
            let itPowerMw = 0;
            let capex = 0;
            const capacity: Record<string, number> = {};

            for (const proj of projections) {
                const point = proj.find(p => p.quarter === q);
                if (point) {
                    itPowerMw += point.powerMw;
                    capex += point.capex;

                    if (point.capacity.type) {
                        capacity[point.capacity.type] = (capacity[point.capacity.type] || 0) + point.capacity.value;
                    }
                }
            }

            // Add baseline power (from Site model) if needed?
            // Prompt says: "Baseline available IT power and baseline existing equipment load per quarter"
            // Detailed replication might need time-phased baseline. For now, we assume site.baselinePowerMw is constant existing load.
            itPowerMw += (site.baselinePowerMw || 0);

            // 2. Adjustments
            const adjustedPowerMw = itPowerMw * coolingOverhead;

            // 3. Costs
            // Calculate inflation factor based on time since start?
            // Or based on Year.
            const qObj = TimeUtils.parse(q);
            const startObj = TimeUtils.parse(settings.horizonStart);
            const yearDiff = qObj.year - startObj.year; // Simple annual inflation
            // Compounded inflation: rate * (1 + inflation)^years
            const inflationFactor = Math.pow(1 + inflation, yearDiff);
            const currentRate = baseRate * inflationFactor;

            // MW to kWh
            // Hours in quarter ≈ 24 * 365.25 / 4 ≈ 2191.5
            const hours = 24 * 365.25 / 4;
            const energyKwh = (adjustedPowerMw * 1000) * hours; // MW -> kW -> kWh
            const utilityCost = energyKwh * currentRate;

            return {
                quarter: q,
                totalItPowerMw: itPowerMw,
                adjustedPowerMw,
                utilityCost,
                capex,
                capacity
            };
        });
    }
}
