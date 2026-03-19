import { Site } from "@prisma/client";
import { SiteProjection } from "./aggregator";

export type CapacityConstraint = {
    type: 'power' | 'cooling' | 'rack' | 'electrical';
    name: string;
    limit: number;
    used: number;
    remaining: number;
    utilization: number; // 0-1 percentage
    status: 'ok' | 'warning' | 'critical';
    quartersOverLimit: string[]; // Quarters where constraint is violated
};

export type SiteCapacityStatus = {
    siteId: string;
    siteName: string;
    constraints: CapacityConstraint[];
    overallStatus: 'ok' | 'warning' | 'critical';
    peakQuarter: string;
    peakUtilization: number;
};

export class CapacityAnalyzer {
    /**
     * Analyzes capacity constraints for a site across all quarters
     * Returns status for each constraint type with violations highlighted
     */
    static analyzeSiteCapacity(
        site: Site,
        projections: SiteProjection[],
        warningThreshold: number = 0.8,
        criticalThreshold: number = 1.0
    ): SiteCapacityStatus {
        const constraints: CapacityConstraint[] = [];
        let maxUtilization = 0;
        let peakQuarter = projections[0]?.quarter || '';

        // 1. Power Capacity Constraint
        if (site.totalItCapacityMw > 0) {
            const quartersOverLimit: string[] = [];
            let peakUsed = 0;

            for (const proj of projections) {
                const utilization = proj.totalItPowerMw / site.totalItCapacityMw;
                if (utilization > maxUtilization) {
                    maxUtilization = utilization;
                    peakQuarter = proj.quarter;
                }
                if (utilization >= criticalThreshold) {
                    quartersOverLimit.push(proj.quarter);
                }
                peakUsed = Math.max(peakUsed, proj.totalItPowerMw);
            }

            const utilization = peakUsed / site.totalItCapacityMw;
            constraints.push({
                type: 'power',
                name: 'IT Power Capacity',
                limit: site.totalItCapacityMw,
                used: peakUsed,
                remaining: Math.max(0, site.totalItCapacityMw - peakUsed),
                utilization,
                status: this.getStatus(utilization, warningThreshold, criticalThreshold),
                quartersOverLimit
            });
        }

        // 2. Electrical Capacity Constraint
        if (site.electricalCapacityMw > 0) {
            const quartersOverLimit: string[] = [];
            let peakUsed = 0;

            for (const proj of projections) {
                const utilization = proj.totalFacilityPowerMw / site.electricalCapacityMw;
                if (utilization >= criticalThreshold) {
                    quartersOverLimit.push(proj.quarter);
                }
                peakUsed = Math.max(peakUsed, proj.totalFacilityPowerMw);
            }

            const utilization = peakUsed / site.electricalCapacityMw;
            constraints.push({
                type: 'electrical',
                name: 'Electrical Infrastructure',
                limit: site.electricalCapacityMw,
                used: peakUsed,
                remaining: Math.max(0, site.electricalCapacityMw - peakUsed),
                utilization,
                status: this.getStatus(utilization, warningThreshold, criticalThreshold),
                quartersOverLimit
            });
        }

        // 3. Cooling Capacity Constraint (Liquid + Air)
        const totalCoolingKw = site.liquidCoolingCapacityKw + site.airCoolingCapacityKw;
        if (totalCoolingKw > 0) {
            const quartersOverLimit: string[] = [];
            let peakUsed = 0;

            for (const proj of projections) {
                const mechanicalKw = proj.mechanicalLoadMw * 1000;
                const utilization = mechanicalKw / totalCoolingKw;
                if (utilization >= criticalThreshold) {
                    quartersOverLimit.push(proj.quarter);
                }
                peakUsed = Math.max(peakUsed, mechanicalKw);
            }

            const utilization = peakUsed / totalCoolingKw;
            constraints.push({
                type: 'cooling',
                name: 'Cooling Capacity',
                limit: totalCoolingKw / 1000, // Convert to MW for display
                used: peakUsed / 1000,
                remaining: Math.max(0, (totalCoolingKw - peakUsed) / 1000),
                utilization,
                status: this.getStatus(utilization, warningThreshold, criticalThreshold),
                quartersOverLimit
            });
        }

        // 4. Rack Space Constraint
        if (site.totalRackSpaceU > 0) {
            const quartersOverLimit: string[] = [];
            // This would need line item rack space data - simplified for now
            const utilization = site.usedRackSpaceU / site.totalRackSpaceU;
            
            if (utilization >= criticalThreshold) {
                // Find quarters where new deployments push over
                projections.forEach(p => {
                    if (p.usedPowerMw > 0) quartersOverLimit.push(p.quarter);
                });
            }

            constraints.push({
                type: 'rack',
                name: 'Rack Space',
                limit: site.totalRackSpaceU,
                used: site.usedRackSpaceU,
                remaining: site.totalRackSpaceU - site.usedRackSpaceU,
                utilization,
                status: this.getStatus(utilization, warningThreshold, criticalThreshold),
                quartersOverLimit
            });
        }

        // Determine overall status
        const criticalCount = constraints.filter(c => c.status === 'critical').length;
        const warningCount = constraints.filter(c => c.status === 'warning').length;
        const overallStatus = criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'ok';

        return {
            siteId: site.id,
            siteName: site.name,
            constraints,
            overallStatus,
            peakQuarter,
            peakUtilization: maxUtilization
        };
    }

    /**
     * Check if a proposed deployment would exceed any capacity constraints
     */
    static checkDeploymentCapacity(
        site: Site,
        currentProjections: SiteProjection[],
        newPowerMw: number,
        newCoolingKw: number,
        newRackSpaceU: number
    ): { allowed: boolean; violations: string[] } {
        const violations: string[] = [];

        // Check current peak + new deployment
        const peakPower = Math.max(...currentProjections.map(p => p.totalItPowerMw));
        if (site.totalItCapacityMw > 0 && peakPower + newPowerMw > site.totalItCapacityMw) {
            violations.push(`Power capacity exceeded: ${(peakPower + newPowerMw).toFixed(2)} MW > ${site.totalItCapacityMw} MW`);
        }

        // Check electrical
        const peakFacility = Math.max(...currentProjections.map(p => p.totalFacilityPowerMw));
        if (site.electricalCapacityMw > 0 && peakFacility + newPowerMw * 1.35 > site.electricalCapacityMw) {
            violations.push(`Electrical capacity exceeded: ${(peakFacility + newPowerMw * 1.35).toFixed(2)} MW > ${site.electricalCapacityMw} MW`);
        }

        // Check rack space
        if (site.totalRackSpaceU > 0 && site.usedRackSpaceU + newRackSpaceU > site.totalRackSpaceU) {
            violations.push(`Rack space exceeded: ${site.usedRackSpaceU + newRackSpaceU}U > ${site.totalRackSpaceU}U`);
        }

        return {
            allowed: violations.length === 0,
            violations
        };
    }

    private static getStatus(
        utilization: number,
        warningThreshold: number,
        criticalThreshold: number
    ): 'ok' | 'warning' | 'critical' {
        if (utilization >= criticalThreshold) return 'critical';
        if (utilization >= warningThreshold) return 'warning';
        return 'ok';
    }
}
