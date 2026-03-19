import { SiteProjection } from "./aggregator";

/**
 * Result of comparing two scenarios, containing projections,
 * differences, and summary metrics
 */
export type ComparisonResult = {
    baseScenario: {
        name: string;
        projections: SiteProjection[];
    };
    compareScenario: {
        name: string;
        projections: SiteProjection[];
    };
    differences: {
        quarter: string;
        baseValue: number;
        compareValue: number;
        delta: number;
        percentChange: number;
    }[];
    summary: {
        peakPowerDelta: number;
        totalCapexDelta: number;
        totalUtilityDelta: number;
    };
};

/**
 * Aggregated data for a single quarter across all sites
 */
type AggregatedQuarterData = {
    quarter: string;
    adjustedPowerMw: number;
    capex: number;
    utilityCost: number;
};

/**
 * Static class for comparing scenario projections
 */
export class ScenarioComparison {
    /**
     * Compare two scenarios by their projections
     * Returns a complete comparison result with differences and summary
     */
    static compareScenarios(
        baseId: string,
        compareId: string,
        projections: {
            base: {
                name: string;
                projections: SiteProjection[];
            };
            compare: {
                name: string;
                projections: SiteProjection[];
            };
        }
    ): ComparisonResult {
        const baseAggregated = aggregateByQuarter(projections.base.projections);
        const compareAggregated = aggregateByQuarter(projections.compare.projections);

        const differences = this.findDifferences(baseAggregated, compareAggregated);
        const summary = calculateSummaryDifferences(baseAggregated, compareAggregated);

        return {
            baseScenario: {
                name: projections.base.name,
                projections: projections.base.projections,
            },
            compareScenario: {
                name: projections.compare.name,
                projections: projections.compare.projections,
            },
            differences,
            summary,
        };
    }

    /**
     * Identifies quarters where values differ between base and compare scenarios
     * Returns an array of differences with delta and percent change
     */
    static findDifferences(
        base: AggregatedQuarterData[],
        compare: AggregatedQuarterData[]
    ): ComparisonResult["differences"] {
        const differences: ComparisonResult["differences"] = [];

        // Create a map for faster lookup
        const baseMap = new Map(base.map((b) => [b.quarter, b]));
        const compareMap = new Map(compare.map((c) => [c.quarter, c]));

        // Get all unique quarters from both scenarios
        const allQuarters = new Set([...baseMap.keys(), ...compareMap.keys()]);

        for (const quarter of allQuarters) {
            const baseData = baseMap.get(quarter);
            const compareData = compareMap.get(quarter);

            // Skip if either is missing (data should be present for same quarters)
            if (!baseData || !compareData) continue;

            // Compare adjusted power (the key metric for power consumption)
            const baseValue = baseData.adjustedPowerMw;
            const compareValue = compareData.adjustedPowerMw;

            // Only include if values actually differ (with small epsilon for floating point)
            const epsilon = 0.001;
            if (Math.abs(baseValue - compareValue) > epsilon) {
                const { delta, percentChange } = this.calculateDeltas(baseValue, compareValue);

                differences.push({
                    quarter,
                    baseValue,
                    compareValue,
                    delta,
                    percentChange,
                });
            }
        }

        // Sort by quarter chronologically
        return differences.sort((a, b) => {
            const parseQuarter = (q: string) => {
                const [year, qNum] = q.split("-Q");
                return parseInt(year) * 4 + parseInt(qNum) - 1;
            };
            return parseQuarter(a.quarter) - parseQuarter(b.quarter);
        });
    }

    /**
     * Computes the delta and percent change between two values
     * Returns delta (compare - base) and percent change
     */
    static calculateDeltas(baseValue: number, compareValue: number): {
        delta: number;
        percentChange: number;
    } {
        const delta = compareValue - baseValue;

        // Handle edge case where base is 0
        if (Math.abs(baseValue) < 0.0001) {
            return {
                delta,
                percentChange: compareValue > 0 ? Infinity : 0,
            };
        }

        const percentChange = (delta / baseValue) * 100;

        return {
            delta: Math.round(delta * 1000) / 1000, // Round to 3 decimals
            percentChange: Math.round(percentChange * 100) / 100, // Round to 2 decimals
        };
    }
}

/**
 * Aggregates site projections by quarter, summing power, capex, and utility costs
 * across all sites in the scenario
 */
export function aggregateByQuarter(
    projections: SiteProjection[]
): AggregatedQuarterData[] {
    const quarterMap = new Map<string, AggregatedQuarterData>();

    for (const proj of projections) {
        if (!quarterMap.has(proj.quarter)) {
            quarterMap.set(proj.quarter, {
                quarter: proj.quarter,
                adjustedPowerMw: 0,
                capex: 0,
                utilityCost: 0,
            });
        }

        const data = quarterMap.get(proj.quarter)!;
        data.adjustedPowerMw += proj.adjustedPowerMw;
        data.capex += proj.capex;
        data.utilityCost += proj.utilityCost;
    }

    // Convert map to array and sort by quarter
    return Array.from(quarterMap.values()).sort((a, b) => {
        const parseQuarter = (q: string) => {
            const [year, qNum] = q.split("-Q");
            return parseInt(year) * 4 + parseInt(qNum) - 1;
        };
        return parseQuarter(a.quarter) - parseQuarter(b.quarter);
    });
}

/**
 * Calculates summary metrics comparing base and compare scenarios
 * Returns peak power delta, total capex delta, and total utility delta
 */
export function calculateSummaryDifferences(
    base: AggregatedQuarterData[],
    compare: AggregatedQuarterData[]
): ComparisonResult["summary"] {
    // Calculate peak power for each scenario
    const basePeakPower = base.length > 0
        ? Math.max(...base.map((b) => b.adjustedPowerMw))
        : 0;
    const comparePeakPower = compare.length > 0
        ? Math.max(...compare.map((c) => c.adjustedPowerMw))
        : 0;

    // Calculate totals for each scenario
    const baseTotalCapex = base.reduce((sum, b) => sum + b.capex, 0);
    const compareTotalCapex = compare.reduce((sum, c) => sum + c.capex, 0);

    const baseTotalUtility = base.reduce((sum, b) => sum + b.utilityCost, 0);
    const compareTotalUtility = compare.reduce((sum, c) => sum + c.utilityCost, 0);

    return {
        peakPowerDelta: Math.round((comparePeakPower - basePeakPower) * 1000) / 1000,
        totalCapexDelta: Math.round((compareTotalCapex - baseTotalCapex) * 1000) / 1000,
        totalUtilityDelta: Math.round((compareTotalUtility - baseTotalUtility) * 1000) / 1000,
    };
}
