"use client";

import { useState } from "react";
import { Scenario, Site, LineItem, CatalogItem, Assumption } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SitePlanEditor } from "./SitePlanEditor";
import { Button } from "@/components/ui/button";
import { Settings, BarChart2, Table as TableIcon } from "lucide-react";

type ScenarioWithDetails = Scenario & {
    sites: (Site & {
        lineItems: (LineItem & { catalogItem: CatalogItem })[]
    })[];
    assumptions: Assumption[];
};

import { SiteProjection } from "@/lib/engine/aggregator";
import { PowerChart } from "./PowerChart";
import { ExportScenarioButton } from "./ExportScenarioButton";

interface ScenarioViewProps {
    scenario: ScenarioWithDetails;
    catalogItems: CatalogItem[];
    projections: Record<string, SiteProjection[]>;
    siteNames: Record<string, string>;
}

export function ScenarioView({ scenario, catalogItems, projections, siteNames }: ScenarioViewProps) {
    const [activeSiteId, setActiveSiteId] = useState<string>(
        scenario.sites.length > 0 ? scenario.sites[0].id : ""
    );

    const activeSite = scenario.sites.find((s) => s.id === activeSiteId);
    const activeProjection = activeSite ? projections[activeSite.id] : [];


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">{scenario.name}</h1>
                    <p className="text-muted-foreground">{scenario.description}</p>
                </div>
                <ExportScenarioButton
                    scenarioName={scenario.name}
                    projections={projections}
                    siteNames={siteNames}
                />
            </div>

            <Tabs defaultValue="plan" className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                    <TabsList>
                        <TabsTrigger value="plan" className="flex items-center gap-2">
                            <TableIcon className="h-4 w-4" /> Plan
                        </TabsTrigger>
                        <TabsTrigger value="analysis" className="flex items-center gap-2">
                            <BarChart2 className="h-4 w-4" /> Analysis
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" /> Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Site Selector (Only visible in Plan/Analysis likely, but fine here) */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Active Site:</span>
                        <Select value={activeSiteId} onValueChange={setActiveSiteId}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Site" />
                            </SelectTrigger>
                            <SelectContent>
                                {scenario.sites.map(site => (
                                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <TabsContent value="plan" className="m-0">
                    {activeSite ? (
                        <SitePlanEditor site={activeSite} catalogItems={catalogItems} />
                    ) : (
                        <Card>
                            <CardContent className="py-10 text-center text-muted-foreground">
                                No sites available. Go to Settings to add a site.
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="analysis">
                    {activeSite ? (
                        <div className="grid gap-6">
                            <PowerChart data={activeProjection} siteName={activeSite.name} />
                        </div>
                    ) : (
                        <Card><CardContent className="py-10">No site selected</CardContent></Card>
                    )}
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader><CardTitle>Scenario Settings</CardTitle></CardHeader>
                        <CardContent>
                            Assumptions editor coming soon.
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
