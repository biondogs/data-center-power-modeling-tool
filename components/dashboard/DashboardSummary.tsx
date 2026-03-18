"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteProjection } from "@/lib/engine/aggregator";

interface DashboardSummaryProps {
  scenarioProjections: Record<string, {
    name: string;
    projections: SiteProjection[];
  }>;
}

export function DashboardSummary({ scenarioProjections }: DashboardSummaryProps) {
  const scenarios = Object.values(scenarioProjections);
  
  if (scenarios.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No scenarios configured
          </CardContent>
        </Card>
      </div>
    );
  }

  let totalPeakPower = 0;
  let totalPeakAdjusted = 0;
  let totalCapex = 0;
  let totalUtility = 0;

  scenarios.forEach(scenario => {
    const projections = scenario.projections;
    if (projections.length > 0) {
      totalPeakPower += Math.max(...projections.map(p => p.totalItPowerMw));
      totalPeakAdjusted += Math.max(...projections.map(p => p.adjustedPowerMw));
      totalCapex += projections.reduce((sum, p) => sum + p.capex, 0);
      totalUtility += projections.reduce((sum, p) => sum + p.utilityCost, 0);
    }
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Total Peak IT Power</div>
          <div className="text-3xl font-bold mt-1">{totalPeakPower.toFixed(2)} MW</div>
          <div className="text-xs text-muted-foreground mt-1">Across all scenarios</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Total Peak Adjusted</div>
          <div className="text-3xl font-bold mt-1">{totalPeakAdjusted.toFixed(2)} MW</div>
          <div className="text-xs text-muted-foreground mt-1">With cooling overhead</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Total CAPEX</div>
          <div className="text-3xl font-bold mt-1">{formatCurrency(totalCapex)}</div>
          <div className="text-xs text-muted-foreground mt-1">Hardware investments</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Total OPEX</div>
          <div className="text-3xl font-bold mt-1">{formatCurrency(totalUtility)}</div>
          <div className="text-xs text-muted-foreground mt-1">Utility costs (all quarters)</div>
        </CardContent>
      </Card>
    </div>
  );
}
