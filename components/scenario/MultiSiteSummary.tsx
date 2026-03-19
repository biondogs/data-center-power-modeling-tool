"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Zap, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import type { SiteProjection } from "@/lib/engine/aggregator";

interface SiteData {
  name: string;
  projections: SiteProjection[];
}

interface MultiSiteSummaryProps {
  sites: Record<string, SiteData>;
}

export function MultiSiteSummary({ sites }: MultiSiteSummaryProps) {
  const summary = useMemo(() => {
    const siteSummaries = Object.entries(sites).map(([siteId, siteData]) => {
      const projections = siteData.projections;
      const peakPower = Math.max(...projections.map((p) => p.totalItPowerMw));
      const totalCapex = projections.reduce((sum, p) => sum + p.capex, 0);
      const totalUtility = projections.reduce((sum, p) => sum + p.utilityCost, 0);
      const avgPower = projections.reduce((sum, p) => sum + p.totalItPowerMw, 0) / projections.length;

      return {
        siteId,
        name: siteData.name,
        peakPower,
        totalCapex,
        totalUtility,
        avgPower,
        quarterCount: projections.length,
      };
    });

    const totalPeakPower = siteSummaries.reduce((sum, s) => sum + s.peakPower, 0);
    const totalCapex = siteSummaries.reduce((sum, s) => sum + s.totalCapex, 0);
    const totalUtility = siteSummaries.reduce((sum, s) => sum + s.totalUtility, 0);
    const avgPower = siteSummaries.length > 0
      ? siteSummaries.reduce((sum, s) => sum + s.avgPower, 0) / siteSummaries.length
      : 0;

    return {
      siteSummaries,
      totals: {
        peakPower: totalPeakPower,
        capex: totalCapex,
        utility: totalUtility,
        avgPower,
      },
    };
  }, [sites]);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(sites).length}</div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Combined Peak Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totals.peakPower.toFixed(1)} MW</div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total CAPEX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totals.capex)}</div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Utility Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totals.utility)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site-by-Site Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead className="text-right">Peak Power</TableHead>
                <TableHead className="text-right">Avg Power</TableHead>
                <TableHead className="text-right">Total CAPEX</TableHead>
                <TableHead className="text-right">Utility Cost</TableHead>
                <TableHead className="text-right">Quarters</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.siteSummaries.map((site) => (
                <TableRow key={site.siteId}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell className="text-right">{site.peakPower.toFixed(2)} MW</TableCell>
                  <TableCell className="text-right">{site.avgPower.toFixed(2)} MW</TableCell>
                  <TableCell className="text-right">{formatCurrency(site.totalCapex)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(site.totalUtility)}</TableCell>
                  <TableCell className="text-right">{site.quarterCount}</TableCell>
                </TableRow>
              ))}
              {summary.siteSummaries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No sites available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
