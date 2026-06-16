"use client";

import { Scenario } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Settings, BarChart2, Table as TableIcon, FileText, FolderOpen, Calendar, Layers, Gauge, Zap, History } from "lucide-react";
import { ExportScenarioButton } from "./ExportScenarioButton";

interface ScenarioHeaderProps {
    scenario: Scenario;
    projections: Record<string, any>;
    siteNames: Record<string, string>;
    onWhatIfOpen: () => void;
}

export function ScenarioHeader({ scenario, projections, siteNames, onWhatIfOpen }: ScenarioHeaderProps) {
    return (
        <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">{scenario.name}</h1>
                <p className="text-muted-foreground">{scenario.description}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={onWhatIfOpen}
                    className="flex items-center gap-2"
                >
                    <Zap className="h-4 w-4" />
                    What-If
                </Button>
                <ExportScenarioButton
                    scenarioId={scenario.id}
                    scenarioName={scenario.name}
                    projections={projections}
                    siteNames={siteNames}
                />
            </div>
        </div>
    );
}