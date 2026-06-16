"use client";

import { useState } from "react";
import { Scenario, Site, LineItem, CatalogItem, Assumption } from "@prisma/client";
import { SiteProjection } from "@/lib/engine/aggregator";
import { Tabs } from "@/components/ui/tabs";
import { ScenarioHeader } from "./ScenarioHeader";
import { ScenarioTabBar } from "./ScenarioTabBar";
import { PlanAnalysisReportsTabs } from "./PlanAnalysisReportsTabs";
import { ProjectTimelineSitesTabs } from "./ProjectTimelineSitesTabs";
import { CapacityHistorySettingsTabs } from "./CapacityHistorySettingsTabs";
import { WhatIfWrapper } from "./WhatIfWrapper";
import { ExportScenarioButton } from "./ExportScenarioButton";

type ScenarioWithDetails = Scenario & {
    sites: (Site & {
        lineItems: (LineItem & { catalogItem: CatalogItem })[]
    })[];
    assumptions: Assumption[];
};

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
    const [activeTab, setActiveTab] = useState<string>("plan");
    const [whatIfOpen, setWhatIfOpen] = useState(false);

    const activeSite = scenario.sites.find((s) => s.id === activeSiteId);
    const activeProjection = activeSite ? projections[activeSite.id] : [];

    const handleWhatIfApply = async (changes: any[]) => {
        console.log("Applying what-if changes:", changes);
        window.location.reload();
    };

    return (
        <div className="space-y-6">
            <ScenarioHeader
                scenario={scenario}
                projections={projections}
                siteNames={siteNames}
                onWhatIfOpen={() => setWhatIfOpen(true)}
            />

            <ScenarioTabBar
                value={activeTab}
                onValueChange={setActiveTab}
                activeSiteId={activeSiteId}
                onSiteChange={setActiveSiteId}
                sites={scenario.sites.map(s => ({ id: s.id, name: s.name }))}
            />

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <PlanAnalysisReportsTabs
                    value={activeTab}
                    activeSite={activeSite}
                    activeProjection={activeProjection}
                    catalogItems={catalogItems}
                />
                <ProjectTimelineSitesTabs
                    value={activeTab}
                    scenario={scenario}
                    activeSite={activeSite}
                    activeProjection={activeProjection}
                    projections={projections}
                    siteNames={siteNames}
                />
                <CapacityHistorySettingsTabs
                    value={activeTab}
                    scenario={scenario}
                    activeSite={activeSite}
                    activeProjection={activeProjection}
                />
            </Tabs>

            <WhatIfWrapper
                scenario={scenario}
                catalogItems={catalogItems}
                open={whatIfOpen}
                onOpenChange={setWhatIfOpen}
                onApply={handleWhatIfApply}
            />
        </div>
    );
}