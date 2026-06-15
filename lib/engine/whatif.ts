import { LineItem, CatalogItem, Site, Assumption } from "@prisma/client";
import { Aggregator, SiteWithLineItems, SiteProjection } from "./aggregator";
import { Projector, ProjectorSettings } from "./projector";
import { CapacityAnalyzer } from "./capacity";

export type WhatIfChange =
  | {
      type: "addLineItem";
      lineItem: Omit<LineItem, "id" | "createdAt" | "updatedAt">;
      catalogItem: CatalogItem;
    }
  | {
      type: "modifyLineItem";
      lineItemId: string;
      changes: Partial<LineItem>;
    }
  | {
      type: "removeLineItem";
      lineItemId: string;
    }
  | {
      type: "modifyAssumption";
      key: string;
      value: number;
    }
  | {
      type: "modifySite";
      siteId: string;
      changes: Partial<Site>;
    };

export type WhatIfScenario = {
  id: string;
  name: string;
  description: string;
  changes: WhatIfChange[];
  baseScenarioId: string;
};

export type WhatIfResult = {
  scenario: WhatIfScenario;
  projections: Record<string, SiteProjection[]>;
  capacityAnalysis: Record<string, ReturnType<typeof CapacityAnalyzer.analyzeSiteCapacity>>;
  impact: {
    peakPowerDelta: number;
    totalCapexDelta: number;
    totalUtilityDelta: number;
    capacityViolations: string[];
  };
};

export class WhatIfEngine {
  static applyChanges(
    baseSites: SiteWithLineItems[],
    baseAssumptions: Assumption[],
    settings: ProjectorSettings,
    changes: WhatIfChange[]
  ): WhatIfResult {
    const modifiedSites: SiteWithLineItems[] = JSON.parse(JSON.stringify(baseSites));
    let modifiedAssumptions: Assumption[] = JSON.parse(JSON.stringify(baseAssumptions));

    for (const change of changes) {
      switch (change.type) {
        case "addLineItem":
          this.applyAddLineItem(modifiedSites, change);
          break;
        case "modifyLineItem":
          this.applyModifyLineItem(modifiedSites, change);
          break;
        case "removeLineItem":
          this.applyRemoveLineItem(modifiedSites, change);
          break;
        case "modifyAssumption":
          modifiedAssumptions = this.applyModifyAssumption(modifiedAssumptions, change);
          break;
        case "modifySite":
          this.applyModifySite(modifiedSites, change);
          break;
      }
    }

    const projections: Record<string, SiteProjection[]> = {};
    const capacityAnalysis: Record<string, ReturnType<typeof CapacityAnalyzer.analyzeSiteCapacity>> = {};

    let totalPeakPower = 0;
    let totalCapex = 0;
    let totalUtility = 0;
    const capacityViolations: string[] = [];

    for (const site of modifiedSites) {
      const siteProjections = Aggregator.aggregateSite(site, modifiedAssumptions, settings);
      projections[site.id] = siteProjections;

      const capacity = CapacityAnalyzer.analyzeSiteCapacity(site, siteProjections);
      capacityAnalysis[site.id] = capacity;

      const peak = siteProjections.length > 0
        ? Math.max(...siteProjections.map((p) => p.totalItPowerMw))
        : 0;
      totalPeakPower += peak;
      totalCapex += siteProjections.reduce((sum, p) => sum + p.capex, 0);
      totalUtility += siteProjections.reduce((sum, p) => sum + p.utilityCost, 0);

      for (const constraint of capacity.constraints) {
        if (constraint.status === "critical") {
          capacityViolations.push(`${site.name}: ${constraint.name}`);
        }
      }
    }

    const baseProjections = this.calculateBaseTotals(baseSites, baseAssumptions, settings);

    return {
      scenario: {
        id: `whatif-${Date.now()}`,
        name: "What-If Scenario",
        description: "Temporary scenario for testing changes",
        changes,
        baseScenarioId: "",
      },
      projections,
      capacityAnalysis,
      impact: {
        peakPowerDelta: totalPeakPower - baseProjections.peakPower,
        totalCapexDelta: totalCapex - baseProjections.capex,
        totalUtilityDelta: totalUtility - baseProjections.utility,
        capacityViolations,
      },
    };
  }

  static suggestAlternatives(
    lineItem: LineItem & { catalogItem: CatalogItem },
    catalogItems: CatalogItem[]
  ): CatalogItem[] {
    const category = lineItem.catalogItem.category;
    const capacityType = lineItem.catalogItem.capacityType;

    return catalogItems.filter((item) => {
      if (item.id === lineItem.catalogItemId) return false;
      if (item.category !== category) return false;

      const powerRatio = item.powerKw / lineItem.catalogItem.powerKw;
      const costRatio = item.cost / lineItem.catalogItem.cost;

      return powerRatio >= 0.8 && powerRatio <= 1.2 && costRatio < 1;
    });
  }

  private static applyAddLineItem(
    sites: SiteWithLineItems[],
    change: Extract<WhatIfChange, { type: "addLineItem" }>
  ): void {
    const site = sites.find((s) => s.id === change.lineItem.siteId);
    if (site) {
      site.lineItems.push({
        ...change.lineItem,
        catalogItem: change.catalogItem,
      } as LineItem & { catalogItem: CatalogItem });
    }
  }

  private static applyModifyLineItem(
    sites: SiteWithLineItems[],
    change: Extract<WhatIfChange, { type: "modifyLineItem" }>
  ): void {
    for (const site of sites) {
      const item = site.lineItems.find((li) => li.id === change.lineItemId);
      if (item) {
        Object.assign(item, change.changes);
      }
    }
  }

  private static applyRemoveLineItem(
    sites: SiteWithLineItems[],
    change: Extract<WhatIfChange, { type: "removeLineItem" }>
  ): void {
    for (const site of sites) {
      site.lineItems = site.lineItems.filter((li) => li.id !== change.lineItemId);
    }
  }

  private static applyModifyAssumption(
    assumptions: Assumption[],
    change: Extract<WhatIfChange, { type: "modifyAssumption" }>
  ): Assumption[] {
    const existing = assumptions.find((a) => a.key === change.key);
    if (existing) {
      existing.value = change.value;
      return assumptions;
    }
    return [
      ...assumptions,
      {
        id: `temp-${change.key}`,
        scenarioId: "",
        key: change.key,
        value: change.value,
      } as Assumption,
    ];
  }

  private static applyModifySite(
    sites: SiteWithLineItems[],
    change: Extract<WhatIfChange, { type: "modifySite" }>
  ): void {
    const site = sites.find((s) => s.id === change.siteId);
    if (site) {
      Object.assign(site, change.changes);
    }
  }

  private static calculateBaseTotals(
    sites: SiteWithLineItems[],
    assumptions: Assumption[],
    settings: ProjectorSettings
  ): { peakPower: number; capex: number; utility: number } {
    let peakPower = 0;
    let capex = 0;
    let utility = 0;

    for (const site of sites) {
      const projections = Aggregator.aggregateSite(site, assumptions, settings);
      peakPower += Math.max(...projections.map((p) => p.totalItPowerMw));
      capex += projections.reduce((sum, p) => sum + p.capex, 0);
      utility += projections.reduce((sum, p) => sum + p.utilityCost, 0);
    }

    return { peakPower, capex, utility };
  }
}
