import { getScenarios, getCatalogItems } from "@/lib/services/data";
import { Aggregator, SiteProjection } from "@/lib/engine/aggregator";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const scenarios = await getScenarios();
  const catalogItems = await getCatalogItems();
  
  const horizon = { horizonStart: "2024Q1", horizonEnd: "2026Q4" };
  
  const scenarioProjections: Record<string, {
    name: string;
    projections: SiteProjection[];
  }> = {};
  
  for (const scenario of scenarios) {
    const allSiteProjections: SiteProjection[] = [];
    
    for (const site of scenario.sites) {
      const siteProjections = Aggregator.aggregateSite(
        site as any,
        scenario.assumptions,
        horizon
      );
      allSiteProjections.push(...siteProjections);
    }
    
    const aggregatedByQuarter = aggregateByQuarter(allSiteProjections);
    
    scenarioProjections[scenario.id] = {
      name: scenario.name,
      projections: aggregatedByQuarter
    };
  }
  
  return (
    <DashboardView 
      scenarios={scenarios} 
      catalogItems={catalogItems}
      scenarioProjections={scenarioProjections}
    />
  );
}

function aggregateByQuarter(projections: SiteProjection[]): SiteProjection[] {
  const byQuarter = new Map<string, SiteProjection>();
  
  for (const proj of projections) {
    if (byQuarter.has(proj.quarter)) {
      const existing = byQuarter.get(proj.quarter)!;
      existing.itPowerMw += proj.itPowerMw;
      existing.totalItPowerMw += proj.totalItPowerMw;
      existing.adjustedPowerMw += proj.adjustedPowerMw;
      existing.mechanicalLoadMw += proj.mechanicalLoadMw;
      existing.totalFacilityPowerMw += proj.totalFacilityPowerMw;
      existing.usedPowerMw += proj.usedPowerMw;
      existing.remainingPowerMw += proj.remainingPowerMw;
      existing.utilityCost += proj.utilityCost;
      existing.capex += proj.capex;
      
      for (const [key, value] of Object.entries(proj.capacity)) {
        existing.capacity[key] = (existing.capacity[key] || 0) + value;
      }
    } else {
      byQuarter.set(proj.quarter, { ...proj });
    }
  }
  
  return Array.from(byQuarter.values()).sort((a, b) => 
    a.quarter.localeCompare(b.quarter)
  );
}
