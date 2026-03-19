"use client";

import { useState } from "react";
import { Scenario, Site, LineItem, CatalogItem, Assumption } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SitePlanEditor } from "./SitePlanEditor";
import { Button } from "@/components/ui/button";
import { Settings, BarChart2, Table as TableIcon, FileText, FolderOpen, Calendar, Layers, Gauge, Zap, History } from "lucide-react";
import { TimelineView } from "@/components/timeline/TimelineView";
import { MultiSiteSummary } from "./MultiSiteSummary";
import { CapacityAlertPanel } from "./CapacityAlertPanel";
import { HistoricalTrackingPanel } from "./HistoricalTrackingPanel";
import { WhatIfDialog } from "@/components/whatif/WhatIfDialog";
import { updateLineItem } from "@/lib/actions";

type ScenarioWithDetails = Scenario & {
    sites: (Site & {
        lineItems: (LineItem & { catalogItem: CatalogItem })[]
    })[];
    assumptions: Assumption[];
};

import { SiteProjection } from "@/lib/engine/aggregator";
import { PowerChart } from "./PowerChart";
import { ReportTable } from "./ReportTable";
import { ScenarioSummaryReport } from "./ScenarioSummaryReport";
import { SiteSettingsEditor } from "./SiteSettingsEditor";
import { ScenarioSettingsEditor } from "./ScenarioSettingsEditor";
import { ExportScenarioButton } from "./ExportScenarioButton";
import { ProjectPortfolioView } from "@/components/project/ProjectPortfolioView";

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
    const [whatIfOpen, setWhatIfOpen] = useState(false);

    const activeSite = scenario.sites.find((s) => s.id === activeSiteId);
    const activeProjection = activeSite ? projections[activeSite.id] : [];

    const handleWhatIfApply = async (changes: any[]) => {
        console.log("Applying what-if changes:", changes);
        window.location.reload();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">{scenario.name}</h1>
                    <p className="text-muted-foreground">{scenario.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setWhatIfOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Zap className="h-4 w-4" />
                        What-If
                    </Button>
                    <ExportScenarioButton
                        scenarioName={scenario.name}
                        projections={projections}
                        siteNames={siteNames}
                    />
                </div>
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
                        <TabsTrigger value="reports" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Reports
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4" /> Projects
                        </TabsTrigger>
                        <TabsTrigger value="timeline" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Timeline
                        </TabsTrigger>
                        <TabsTrigger value="sites" className="flex items-center gap-2">
                            <Layers className="h-4 w-4" /> Multi-Site
                        </TabsTrigger>
                        <TabsTrigger value="capacity" className="flex items-center gap-2">
                            <Gauge className="h-4 w-4" /> Capacity
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <History className="h-4 w-4" /> History
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" /> Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Site Selector */}
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

                <TabsContent value="reports">
                    {activeSite ? (
                        <ReportTable projections={activeProjection} siteName={activeSite.name} />
                    ) : (
                        <Card><CardContent className="py-10">No site selected</CardContent></Card>
                    )}
                </TabsContent>

                <TabsContent value="projects">
                    <ProjectPortfolioView scenario={scenario} projections={projections} />
                </TabsContent>

                <TabsContent value="timeline">
                    {activeSite ? (
                        <TimelineView
                            lineItems={activeSite.lineItems}
                            horizonStart={scenario.horizonStart}
                            horizonEnd={scenario.horizonEnd}
                            siteName={activeSite.name}
                        />
                    ) : (
                        <Card><CardContent className="py-10">No site selected</CardContent></Card>
                    )}
                </TabsContent>

                <TabsContent value="sites">
                    <MultiSiteSummary sites={Object.fromEntries(
                        scenario.sites.map(site => [site.id, { name: site.name, projections: projections[site.id] || [] }])
                    )} />
                </TabsContent>

                <TabsContent value="capacity">
                    {activeSite ? (
                        <CapacityAlertPanel site={activeSite} projections={activeProjection} />
                    ) : (
                        <Card><CardContent className="py-10">No site selected</CardContent></Card>
                    )}
                </TabsContent>

                <TabsContent value="history">
                    {activeSite ? (
                        <HistoricalTrackingPanel 
                            lineItems={activeSite.lineItems} 
                            onUpdate={(lineItemId, data) => {
                                console.log('Update actuals for', lineItemId, data);
                            }}
                        />
                    ) : (
                        <Card><CardContent className="py-10">No site selected</CardContent></Card>
                    )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                    <ScenarioSettingsEditor scenarioId={scenario.id} assumptions={scenario.assumptions} />
                    {activeSite ? (
                        <SiteSettingsEditor site={activeSite} />
                    ) : (
                        <Card><CardContent className="py-10">No site selected</CardContent></Card>
                    )}
                </TabsContent>
            </Tabs>

            <WhatIfDialog
                scenario={scenario}
                catalogItems={catalogItems}
                open={whatIfOpen}
                onOpenChange={setWhatIfOpen}
                onApply={handleWhatIfApply}
            />
        </div>
    );
}
