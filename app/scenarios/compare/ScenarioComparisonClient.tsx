"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScenarioSelector } from "@/components/comparison/ScenarioSelector";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { ScenarioComparison } from "@/lib/engine/comparison";
import { Aggregator, SiteProjection } from "@/lib/engine/aggregator";
import { ProjectorSettings } from "@/lib/engine/projector";

interface ScenarioComparisonClientProps {
  scenarios: any[];
}

export function ScenarioComparisonClient({ scenarios }: ScenarioComparisonClientProps) {
  const [baseScenarioId, setBaseScenarioId] = useState<string>("");
  const [compareScenarioId, setCompareScenarioId] = useState<string>("");

  const horizon: ProjectorSettings = { horizonStart: "2024-Q1", horizonEnd: "2027-Q4" };

  const comparison = useMemo(() => {
    if (!baseScenarioId || !compareScenarioId) return null;

    const baseScenario = scenarios.find((s) => s.id === baseScenarioId);
    const compareScenario = scenarios.find((s) => s.id === compareScenarioId);

    if (!baseScenario || !compareScenario) return null;

    const baseProjections = aggregateScenario(baseScenario, horizon);
    const compareProjections = aggregateScenario(compareScenario, horizon);

    return ScenarioComparison.compareScenarios(baseScenarioId, compareScenarioId, {
      base: {
        name: baseScenario.name,
        projections: baseProjections,
      },
      compare: {
        name: compareScenario.name,
        projections: compareProjections,
      },
    });
  }, [baseScenarioId, compareScenarioId, scenarios]);

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "+";
    if (absValue >= 1_000_000) {
      return `${sign}$${(absValue / 1_000_000).toFixed(1)}M`;
    }
    return `${sign}$${absValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const formatPower = (value: number) => {
    const sign = value < 0 ? "" : "+";
    return `${sign}${value.toFixed(2)} MW`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Compare Scenarios</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Scenarios to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <ScenarioSelector
            scenarios={scenarios}
            baseScenarioId={baseScenarioId || null}
            compareScenarioId={compareScenarioId || null}
            onBaseChange={setBaseScenarioId}
            onCompareChange={setCompareScenarioId}
          />
        </CardContent>
      </Card>

      {!baseScenarioId || !compareScenarioId ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              {!baseScenarioId && !compareScenarioId
                ? "Select two scenarios to compare their power projections, costs, and capacity."
                : !baseScenarioId
                  ? "Please select a base scenario."
                  : "Please select a scenario to compare against."}
            </p>
          </CardContent>
        </Card>
      ) : comparison ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Peak Power Delta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPower(comparison.summary.peakPowerDelta)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total CapEx Delta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(comparison.summary.totalCapexDelta)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Utility Delta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(comparison.summary.totalUtilityDelta)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Quarterly Comparison: {comparison.baseScenario.name} vs{" "}
                {comparison.compareScenario.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonTable comparison={comparison} />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function aggregateScenario(scenario: any, horizon: ProjectorSettings): SiteProjection[] {
  const allProjections: SiteProjection[] = [];

  for (const site of scenario.sites) {
    const siteProjections = Aggregator.aggregateSite(
      site as any,
      scenario.assumptions as any,
      horizon
    );
    allProjections.push(...siteProjections);
  }

  return aggregateByQuarter(allProjections);
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
