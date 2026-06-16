"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectPortfolioView } from "@/components/project/ProjectPortfolioView";
import { TimelineView } from "@/components/timeline/TimelineView";
import { MultiSiteSummary } from "./MultiSiteSummary";
import { Site, LineItem, CatalogItem, Assumption, Scenario } from "@prisma/client";
import { SiteProjection } from "@/lib/engine/aggregator";

type ScenarioWithDetails = Scenario & {
    sites: (Site & {
        lineItems: (LineItem & { catalogItem: CatalogItem })[]
    })[];
    assumptions: Assumption[];
};

interface ProjectTimelineSitesTabsProps {
    value: string;
    scenario: ScenarioWithDetails;
    activeSite: (Site & { lineItems: (LineItem & { catalogItem: CatalogItem })[] }) | undefined;
    activeProjection: SiteProjection[];
    projections: Record<string, SiteProjection[]>;
    siteNames: Record<string, string>;
}

export function ProjectTimelineSitesTabs({
    value,
    scenario,
    activeSite,
    activeProjection,
    projections,
    siteNames,
}: ProjectTimelineSitesTabsProps) {
    return (
        <>
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
        </>
    );
}