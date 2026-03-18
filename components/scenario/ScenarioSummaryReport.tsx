"use client";

import { SiteProjection } from "@/lib/engine/aggregator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScenarioSummaryReportProps {
    projections: Record<string, SiteProjection[]>;
    siteNames: Record<string, string>;
}

export function ScenarioSummaryReport({ projections, siteNames }: ScenarioSummaryReportProps) {
    // Calculate aggregated metrics across all sites
    const allQuarters = new Set<string>();
    Object.values(projections).forEach(siteProjections => {
        siteProjections.forEach(p => allQuarters.add(p.quarter));
    });
    const sortedQuarters = Array.from(allQuarters).sort();

    const aggregatedData = sortedQuarters.map(quarter => {
        let totalItPower = 0;
        let totalAdjustedPower = 0;
        let totalUtilityCost = 0;
        let totalCapex = 0;
        let totalGpus = 0;

        Object.entries(projections).forEach(([siteId, siteProjections]) => {
            const p = siteProjections.find(sp => sp.quarter === quarter);
            if (p) {
                totalItPower += p.totalItPowerMw;
                totalAdjustedPower += p.adjustedPowerMw;
                totalUtilityCost += p.utilityCost;
                totalCapex += p.capex;
                totalGpus += p.capacity['GPU'] || 0;
            }
        });

        return {
            quarter,
            totalItPower,
            totalAdjustedPower,
            totalUtilityCost,
            totalCapex,
            totalGpus
        };
    });

    // Calculate totals
    const totalProjectCapex = aggregatedData.reduce((sum, d) => sum + d.totalCapex, 0);
    const totalProjectUtility = aggregatedData.reduce((sum, d) => sum + d.totalUtilityCost, 0);
    const peakItPower = Math.max(...aggregatedData.map(d => d.totalItPower));
    const peakAdjustedPower = Math.max(...aggregatedData.map(d => d.totalAdjustedPower));
    const maxGpus = Math.max(...aggregatedData.map(d => d.totalGpus));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Peak IT Power</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{peakItPower.toFixed(2)} MW</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Peak Adjusted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{peakAdjustedPower.toFixed(2)} MW</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Capex</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(totalProjectCapex / 1000000).toFixed(1)}M</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Utilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(totalProjectUtility / 1000000).toFixed(1)}M</div>
                    </CardContent>
                </Card>
            </div>

            {/* Per-Site Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Site Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {Object.entries(projections).map(([siteId, siteProjections]) => {
                            if (siteProjections.length === 0) return null;
                            const siteTotalCapex = siteProjections.reduce((sum, p) => sum + p.capex, 0);
                            const siteTotalUtility = siteProjections.reduce((sum, p) => sum + p.utilityCost, 0);
                            const sitePeakPower = Math.max(...siteProjections.map(p => p.totalItPowerMw));
                            const siteMaxGpus = Math.max(...siteProjections.map(p => p.capacity['GPU'] || 0));

                            return (
                                <div key={siteId} className="bg-muted rounded-lg p-4">
                                    <h3 className="font-semibold mb-2">{siteNames[siteId]}</h3>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Peak Power:</span>
                                            <span>{sitePeakPower.toFixed(2)} MW</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Capex:</span>
                                            <span>${(siteTotalCapex / 1000000).toFixed(1)}M</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Utilities:</span>
                                            <span>${(siteTotalUtility / 1000000).toFixed(1)}M</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Max GPUs:</span>
                                            <span>{siteMaxGpus.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Aggregated Report Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Aggregated Timeline (All Sites)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Quarter</TableHead>
                                    <TableHead className="text-right">IT Power</TableHead>
                                    <TableHead className="text-right">Adjusted</TableHead>
                                    <TableHead className="text-right">GPUs</TableHead>
                                    <TableHead className="text-right">Utility Cost</TableHead>
                                    <TableHead className="text-right">Capex</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {aggregatedData.map((d) => (
                                    <TableRow key={d.quarter}>
                                        <TableCell className="font-medium">{d.quarter}</TableCell>
                                        <TableCell className="text-right">{d.totalItPower.toFixed(2)} MW</TableCell>
                                        <TableCell className="text-right">{d.totalAdjustedPower.toFixed(2)} MW</TableCell>
                                        <TableCell className="text-right">{d.totalGpus.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">${Math.round(d.totalUtilityCost).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            {d.totalCapex > 0 ? `$${Math.round(d.totalCapex).toLocaleString()}` : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
