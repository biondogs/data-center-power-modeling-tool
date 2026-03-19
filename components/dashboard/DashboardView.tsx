"use client";

import { useState } from "react";
import { Scenario, Site, LineItem, CatalogItem, Assumption } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart2, Table as TableIcon, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SiteProjection } from "@/lib/engine/aggregator";
import { PowerChart } from "@/components/scenario/PowerChart";
import { ReportTable } from "@/components/scenario/ReportTable";
import { DashboardSummary } from "./DashboardSummary";
import { ScenarioAggregateChart } from "./ScenarioAggregateChart";
import { ExportAllButton } from "@/components/ExportAllButton";

type ScenarioWithDetails = Scenario & {
    sites: (Site & {
        lineItems: (LineItem & { catalogItem: CatalogItem })[]
    })[];
    assumptions: Assumption[];
};

interface DashboardViewProps {
    scenarios: ScenarioWithDetails[];
    catalogItems: CatalogItem[];
    scenarioProjections: Record<string, {
        name: string;
        projections: SiteProjection[];
    }>;
}

export function DashboardView({ scenarios, catalogItems, scenarioProjections }: DashboardViewProps) {
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
        scenarios.length > 0 ? scenarios[0].id : ""
    );

    const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
    
    const projections = selectedScenario ? scenarioProjections[selectedScenario.id]?.projections || [] : [];
    
    const siteProjections: Record<string, SiteProjection[]> = {};
    const siteNames: Record<string, string> = {};
    
    if (selectedScenario) {
        selectedScenario.sites.forEach(site => {
            siteNames[site.id] = site.name;
            const horizon = { horizonStart: "2024Q1", horizonEnd: "2026Q4" };
            const { Aggregator } = require("@/lib/engine/aggregator");
            siteProjections[site.id] = Aggregator.aggregateSite(
                site as any,
                selectedScenario.assumptions,
                horizon
            );
        });
    }
    
    const activeSite = selectedScenario?.sites[0];
    const activeProjection = activeSite ? siteProjections[activeSite.id] || [] : [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground mt-2">
                        View analysis and reports for any scenario.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ExportAllButton />
                    <Button asChild>
                        <Link href="/scenarios">
                            Manage Scenarios <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            <DashboardSummary scenarioProjections={scenarioProjections} />

            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Scenario Analysis</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Select Scenario:</span>
                        <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
                            <SelectTrigger className="w-[300px]">
                                <SelectValue placeholder="Select a scenario" />
                            </SelectTrigger>
                            <SelectContent>
                                {scenarios.map(scenario => (
                                    <SelectItem key={scenario.id} value={scenario.id}>
                                        {scenario.name} {scenario.isBase ? "(Baseline)" : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {selectedScenario ? (
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">{selectedScenario.name}</h1>
                                <p className="text-muted-foreground">{selectedScenario.description}</p>
                            </div>
                            <Button asChild variant="outline">
                                <Link href={`/scenarios/${selectedScenario.id}`}>
                                    Open Full Scenario <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <Tabs defaultValue="analysis" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="analysis" className="flex items-center gap-2">
                                    <BarChart2 className="h-4 w-4" /> Analysis
                                </TabsTrigger>
                                <TabsTrigger value="reports" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Reports
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="analysis">
                                {activeSite ? (
                                    <div className="grid gap-6">
                                        <PowerChart data={activeProjection} siteName={activeSite.name} />
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="py-10 text-center text-muted-foreground">
                                            No sites available in this scenario.
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="reports">
                                {activeSite ? (
                                    <ReportTable projections={activeProjection} siteName={activeSite.name} />
                                ) : (
                                    <Card>
                                        <CardContent className="py-10 text-center text-muted-foreground">
                                            No sites available in this scenario.
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    <CardContent className="py-10 text-center text-muted-foreground">
                        No scenarios available. Create a scenario to view analysis.
                    </CardContent>
                )}
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <ScenarioAggregateChart scenarioProjections={scenarioProjections} />
            </div>
        </div>
    );
}
