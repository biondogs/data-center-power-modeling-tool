"use client";

import { SiteProjection } from "@/lib/engine/aggregator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReportTableProps {
    projections: SiteProjection[];
    siteName: string;
}

export function ReportTable({ projections, siteName }: ReportTableProps) {
    if (projections.length === 0) {
        return (
            <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                    No projection data available for {siteName}
                </CardContent>
            </Card>
        );
    }

    // Calculate totals for summary
    const totalCapex = projections.reduce((sum, p) => sum + p.capex, 0);
    const totalUtility = projections.reduce((sum, p) => sum + p.utilityCost, 0);
    const peakPower = Math.max(...projections.map(p => p.totalItPowerMw));
    const peakAdjusted = Math.max(...projections.map(p => p.adjustedPowerMw));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{siteName} - Quarterly Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Peak IT Power</div>
                        <div className="text-2xl font-bold">{peakPower.toFixed(2)} MW</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Peak Adjusted</div>
                        <div className="text-2xl font-bold">{peakAdjusted.toFixed(2)} MW</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Total Capex</div>
                        <div className="text-2xl font-bold">${(totalCapex / 1000000).toFixed(1)}M</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Total Utilities</div>
                        <div className="text-2xl font-bold">${(totalUtility / 1000000).toFixed(1)}M</div>
                    </div>
                </div>

                {/* Detailed Table */}
                <ScrollArea className="h-[400px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Quarter</TableHead>
                                <TableHead className="text-right">IT Power</TableHead>
                                <TableHead className="text-right">Baseline</TableHead>
                                <TableHead className="text-right">Total IT</TableHead>
                                <TableHead className="text-right">Adjusted</TableHead>
                                <TableHead className="text-right">Mech Load</TableHead>
                                <TableHead className="text-right">Rate</TableHead>
                                <TableHead className="text-right">Utility Cost</TableHead>
                                <TableHead className="text-right">Capex</TableHead>
                                <TableHead className="text-right">Remaining</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projections.map((p) => (
                                <TableRow key={p.quarter}>
                                    <TableCell className="font-medium">{p.quarter}</TableCell>
                                    <TableCell className="text-right">{p.itPowerMw.toFixed(2)} MW</TableCell>
                                    <TableCell className="text-right">{p.baselineItPowerMw.toFixed(2)} MW</TableCell>
                                    <TableCell className="text-right">{p.totalItPowerMw.toFixed(2)} MW</TableCell>
                                    <TableCell className="text-right">{p.adjustedPowerMw.toFixed(2)} MW</TableCell>
                                    <TableCell className="text-right">{p.mechanicalLoadMw.toFixed(2)} MW</TableCell>
                                    <TableCell className="text-right">${p.electricityRatePerKwh.toFixed(4)}</TableCell>
                                    <TableCell className="text-right">${Math.round(p.utilityCost).toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        {p.capex > 0 ? `$${Math.round(p.capex).toLocaleString()}` : '-'}
                                    </TableCell>
                                    <TableCell className={`text-right ${p.remainingPowerMw < 0 ? 'text-destructive font-medium' : ''}`}>
                                        {p.remainingPowerMw.toFixed(2)} MW
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
