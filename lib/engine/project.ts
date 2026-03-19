import { CatalogItem, LineItem } from "@prisma/client";
import { ProjectedPoint } from "./projector";
import { TimeUtils } from "./time";

export type ProjectSummary = {
    name: string;
    description: string | null;
    status: string | null;
    totalCapex: number;
    totalPowerMw: number;
    startQuarter: string | null;
    endQuarter: string | null;
    lineItemCount: number;
    sites: string[];
};

export type ProjectPortfolio = Record<string, ProjectSummary>;

export type ProjectMetrics = {
    budgetUtilization: number | null;
    timelineStatus: "on track" | "delayed";
    riskLevel: "low" | "medium" | "high";
};

export type LineItemWithCatalog = LineItem & { catalogItem: CatalogItem };

export class ProjectAggregator {
    static aggregateByProject(
        lineItems: LineItemWithCatalog[],
        projections: ProjectedPoint[][]
    ): ProjectPortfolio {
        const projects = new Map<string, {
            name: string;
            description: string | null;
            status: string | null;
            lineItems: LineItemWithCatalog[];
            projectedPoints: ProjectedPoint[];
            siteNames: Set<string>;
        }>();

        for (let i = 0; i < lineItems.length; i++) {
            const item = lineItems[i];
            const proj = projections[i];
            const tag = item.projectTag || "Unassigned";

            if (!projects.has(tag)) {
                projects.set(tag, {
                    name: tag,
                    description: null,
                    status: null,
                    lineItems: [],
                    projectedPoints: [],
                    siteNames: new Set()
                });
            }

            const project = projects.get(tag)!;
            project.lineItems.push(item);
            project.projectedPoints.push(...proj);
            project.siteNames.add(item.siteId.toString());
        }

        const portfolio: ProjectPortfolio = {};

        for (const [tag, data] of projects) {
            const totalCapex = data.projectedPoints.reduce(
                (sum, p) => sum + p.capex,
                0
            );

            const peakPowerMw = Math.max(
                ...data.projectedPoints.map(p => p.powerMw),
                0
            );

            const startQuarters = data.lineItems
                .map(li => li.startQuarter)
                .filter((q): q is string => q !== null)
                .sort();
            const endQuarters = data.lineItems
                .map(li => li.endQuarter)
                .filter((q): q is string => q !== null)
                .sort();

            const startQuarter = startQuarters.length > 0 ? startQuarters[0] : null;
            const endQuarter = endQuarters.length > 0 ? endQuarters[endQuarters.length - 1] : null;

            portfolio[tag] = {
                name: tag,
                description: data.description,
                status: data.status,
                totalCapex,
                totalPowerMw: peakPowerMw,
                startQuarter,
                endQuarter,
                lineItemCount: data.lineItems.length,
                sites: Array.from(data.siteNames)
            };
        }

        return portfolio;
    }
}

/**
 * Calculates derived metrics for a project summary
 * @param projectSummary - The project summary to analyze
 * @param targetCapex - Optional budget target for utilization calculation
 * @returns ProjectMetrics with budget utilization, timeline status, and risk level
 */
export function calculateProjectMetrics(
    projectSummary: ProjectSummary,
    targetCapex?: number
): ProjectMetrics {
    // Calculate budget utilization
    const budgetUtilization = targetCapex && targetCapex > 0
        ? (projectSummary.totalCapex / targetCapex) * 100
        : null;

    // Determine timeline status
    // If endQuarter is in the past relative to current quarter, check if complete
    let timelineStatus: "on track" | "delayed" = "on track";
    if (projectSummary.endQuarter) {
        const currentQuarter = TimeUtils.format({
            year: new Date().getFullYear(),
            q: Math.floor(new Date().getMonth() / 3) + 1
        });
        const currentIdx = TimeUtils.toIndex(currentQuarter);
        const endIdx = TimeUtils.toIndex(projectSummary.endQuarter);
        
        if (endIdx < currentIdx) {
            timelineStatus = "delayed";
        }
    }

    // Determine risk level based on power capacity and spending
    let riskLevel: "low" | "medium" | "high" = "low";
    
    // High power usage indicates higher risk
    if (projectSummary.totalPowerMw > 10) {
        riskLevel = "high";
    } else if (projectSummary.totalPowerMw > 5) {
        riskLevel = "medium";
    }

    // Budget overruns indicate high risk
    if (budgetUtilization !== null && budgetUtilization > 100) {
        riskLevel = "high";
    } else if (budgetUtilization !== null && budgetUtilization > 80) {
        riskLevel = riskLevel === "high" ? "high" : "medium";
    }

    return {
        budgetUtilization,
        timelineStatus,
        riskLevel
    };
}
