import { Assumption, CatalogItem, LineItem, Site } from "@prisma/client";
import { Projector, ProjectorSettings } from "./projector";
import { TimeUtils } from "./time";

// Extended Site type with line items and catalog data
export type SiteWithLineItems = Site & {
    lineItems: (LineItem & { catalogItem: CatalogItem })[];
};

// Excel-style projection result with detailed breakdown
export type SiteProjection = {
    // Time period
    quarter: string;
    year: number;
    quarterNum: number;

    // IT Power (raw from equipment)
    itPowerMw: number;
    baselineItPowerMw: number;
    totalItPowerMw: number;

    // Adjusted/Cooled Power
    adjustedPowerMw: number;  // IT power after cooling overhead
    mechanicalLoadMw: number; // Mechanical cooling power required
    totalFacilityPowerMw: number; // Total IT + Mechanical

    // Capacity Analysis
    availablePowerMw: number;    // Total capacity minus baseline
    usedPowerMw: number;         // New deployment IT power
    remainingPowerMw: number;    // Available - used

    // Costs
    electricityRatePerKwh: number;
    utilityCost: number;
    capex: number;

    // Capacity tracking
    capacity: Record<string, number>; // "GPU": 100, "Cores": 5000

    // Per-project breakdown (for detailed reporting)
    projectBreakdown?: Record<string, {
        powerMw: number;
        capex: number;
        quantity: number;
    }>;
};

export class Aggregator {
    /**
     * Aggregates power and cost projections for a site across all quarters
     * Matches the Excel calculation logic from the reference spreadsheet
     */
    static aggregateSite(
        site: SiteWithLineItems,
        assumptions: Assumption[],
        settings: ProjectorSettings
    ): SiteProjection[] {
        const quarters = TimeUtils.generateRange(settings.horizonStart, settings.horizonEnd);

        // Resolve Global Assumptions
        const coolingOverhead = assumptions.find(a => a.key === 'cooling_overhead')?.value || 1.35;
        const inflationRate = assumptions.find(a => a.key === 'inflation_rate')?.value || 0.10;

        // Site-specific electricity rate (from Excel Power Blocks sheet columns P-Q)
        const baseRate = site.electricityRatePerKwh || 0.10;
        const siteInflation = site.inflationRate || inflationRate;

        // Site capacity limits (from Excel Baseline Power sheet)
        const totalCapacity = site.totalItCapacityMw || 0;
        const baselineIt = site.baselineItPowerMw || 0;

        // Calculate available power for new deployments
        // This is: Total capacity - baseline load
        const availableForNewDeployments = totalCapacity - baselineIt;

        // Project all line items independently
        const projections = site.lineItems.map(li => Projector.projectLineItem(li, settings));

        // Track cumulative inflation by year
        let currentRate = baseRate;

        return quarters.map((q, idx) => {
            const qObj = TimeUtils.parse(q);

            // Check if this is start of a new year (Q1) and idx > 0, then apply inflation
            if (qObj.q === 1 && idx > 0) {
                currentRate = baseRate * Math.pow(1 + siteInflation, qObj.year - TimeUtils.parse(quarters[0]).year);
            }

            // 1. Sum raw metrics from all deployed equipment
            let itPowerMw = 0;
            let capex = 0;
            const capacity: Record<string, number> = {};
            const projectBreakdown: NonNullable<SiteProjection['projectBreakdown']> = {};

            for (const proj of projections) {
                const point = proj.find(p => p.quarter === q);
                if (point) {
                    itPowerMw += point.powerMw;
                    capex += point.capex;

                    // Track capacity
                    if (point.capacity.type) {
                        capacity[point.capacity.type] = (capacity[point.capacity.type] || 0) + point.capacity.value;
                    }

                    // Track project breakdown
                    if (point.projectTag) {
                        if (!projectBreakdown[point.projectTag]) {
                            projectBreakdown[point.projectTag] = { powerMw: 0, capex: 0, quantity: 0 };
                        }
                        projectBreakdown[point.projectTag].powerMw += point.powerMw;
                        if (point.capex > 0) {
                            projectBreakdown[point.projectTag].capex += point.capex;
                        }
                        projectBreakdown[point.projectTag].quantity += point.activeUnits;
                    }
                }
            }

            // Calculate totals with baseline
            const totalItPowerMw = itPowerMw + baselineIt;

            // Cooling overhead calculation (from Excel)
            // Mechanical load = (total IT power) * (cooling overhead - 1)
            // Example: If overhead is 1.35 and IT is 10MW, mechanical = 3.5MW
            const adjustedPowerMw = totalItPowerMw * coolingOverhead;
            const mechanicalLoadMw = adjustedPowerMw - totalItPowerMw;

            // Total facility power
            const totalFacilityPowerMw = adjustedPowerMw;

            // Available vs used power for new deployments
            const usedPowerMw = itPowerMw;  // Only new deployments (not baseline)
            const remainingPowerMw = availableForNewDeployments - usedPowerMw;

            // Hourly calculation for utility cost
            // Excel uses: Hours in quarter = 24 * 365.25 / 4 ≈ 2191.5
            const hoursPerQuarter = 24 * 365.25 / 4;

            // Utility cost = (adjusted power MW * 1000 kW/MW) * hours * rate
            const energyKwh = (adjustedPowerMw * 1000) * hoursPerQuarter;
            const utilityCost = energyKwh * currentRate;

            return {
                quarter: q,
                year: qObj.year,
                quarterNum: qObj.q,
                itPowerMw,
                baselineItPowerMw: baselineIt,
                totalItPowerMw,
                adjustedPowerMw,
                mechanicalLoadMw,
                totalFacilityPowerMw,
                availablePowerMw: availableForNewDeployments,
                usedPowerMw,
                remainingPowerMw,
                electricityRatePerKwh: currentRate,
                utilityCost,
                capex,
                capacity,
                projectBreakdown: Object.keys(projectBreakdown).length > 0 ? projectBreakdown : undefined
            };
        });
    }

    /**
     * Calculate summary statistics across all quarters
     */
    static calculateSummary(projections: SiteProjection[]) {
        if (projections.length === 0) {
            return {
                peakPowerMw: 0,
                peakAdjustedPowerMw: 0,
                totalCapex: 0,
                totalUtilityCost: 0,
                maxGpuCount: 0
            };
        }

        return {
            peakPowerMw: Math.max(...projections.map(p => p.totalItPowerMw)),
            peakAdjustedPowerMw: Math.max(...projections.map(p => p.adjustedPowerMw)),
            totalCapex: projections.reduce((sum, p) => sum + p.capex, 0),
            totalUtilityCost: projections.reduce((sum, p) => sum + p.utilityCost, 0),
            maxGpuCount: Math.max(...projections.map(p => p.capacity['GPU'] || 0))
        };
    }
}
