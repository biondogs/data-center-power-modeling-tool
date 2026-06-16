"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Site, LineItem, CatalogItem } from "@prisma/client";
import { SiteProjection } from "@/lib/engine/aggregator";
import { SitePlanEditor } from "./SitePlanEditor";
import { PowerChart } from "./PowerChart";
import { ReportTable } from "./ReportTable";

interface PlanAnalysisReportsTabsProps {
    value: string;
    activeSite: (Site & { lineItems: (LineItem & { catalogItem: CatalogItem })[] }) | undefined;
    activeProjection: SiteProjection[];
    catalogItems: CatalogItem[];
}

export function PlanAnalysisReportsTabs({
    value,
    activeSite,
    activeProjection,
    catalogItems,
}: PlanAnalysisReportsTabsProps) {
    const showPlan = value === "plan";
    const showAnalysis = value === "analysis";
    const showReports = value === "reports";

    return (
        <>
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
        </>
    );
}