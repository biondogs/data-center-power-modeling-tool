"use client";

import { Button } from "@/components/ui/button";
import { Download, Printer, Database } from "lucide-react";
import { SiteProjection } from "@/lib/engine/aggregator";
import { exportScenario } from "@/lib/actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportScenarioButtonProps {
    scenarioId: string;
    scenarioName: string;
    projections: Record<string, SiteProjection[]>;
    siteNames: Record<string, string>;
}

export function ExportScenarioButton({ scenarioId, scenarioName, projections, siteNames }: ExportScenarioButtonProps) {

    const handleCsvExport = () => {
        // 1. Flatten Data
        // Format: Site, Quarter, IT_MW, Adj_MW, Cost, Capex, GPU_Count
        const rows = [["Site", "Quarter", "IT Power (MW)", "Adj Power (MW)", "Utility Cost ($)", "Capex ($)", "GPU Count"]];

        for (const [siteId, points] of Object.entries(projections)) {
            const siteName = siteNames[siteId] || siteId;

            points.forEach(p => {
                rows.push([
                    siteName,
                    p.quarter,
                    p.totalItPowerMw.toFixed(4),
                    p.adjustedPowerMw.toFixed(4),
                    p.utilityCost.toFixed(2),
                    p.capex.toFixed(2),
                    (p.capacity['GPU'] || 0).toString()
                ]);
            });
        }

        // 2. Convert to CSV
        const csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");

        // 3. Download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${scenarioName.replace(/\s+/g, '_')}_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleJsonExport = async () => {
        try {
            const result = await exportScenario(scenarioId);
            
            if (result.success && result.data) {
                const jsonStr = JSON.stringify(result.data, null, 2);
                const blob = new Blob([jsonStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement("a");
                a.href = url;
                a.download = `${scenarioName.replace(/[^a-zA-Z0-9-_]/g, "_")}_config_${new Date().toISOString().split("T")[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert(`Export failed: ${result.error || "Unknown error"}`);
            }
        } catch (e) {
            console.error("Export failed", e);
            alert("Export failed. See console for details.");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleCsvExport}>
                    Download CSV (Report)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleJsonExport}>
                    <Database className="mr-2 h-4 w-4" /> Export Config (JSON)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print / PDF
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
