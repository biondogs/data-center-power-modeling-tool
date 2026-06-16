"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CapacityAlertPanel } from "./CapacityAlertPanel";
import { HistoricalTrackingPanel } from "./HistoricalTrackingPanel";
import { SiteSettingsEditor } from "./SiteSettingsEditor";
import { ScenarioSettingsEditor } from "./ScenarioSettingsEditor";
import { Site, Scenario, LineItem, Assumption } from "@prisma/client";
import { SiteProjection } from "@/lib/engine/aggregator";

interface CapacityHistorySettingsTabsProps {
    value: string;
    scenario: Scenario & { assumptions: Assumption[] };
    activeSite: (Site & { lineItems: (LineItem & { catalogItem: any })[] }) | undefined;
    activeProjection: SiteProjection[];
}

export function CapacityHistorySettingsTabs({
    value,
    scenario,
    activeSite,
    activeProjection,
}: CapacityHistorySettingsTabsProps) {
    return (
        <>
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
        </>
    );
}