"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Database } from "lucide-react";
import { exportAllScenarios } from "@/lib/actions";

export function ExportAllButton() {
    const [loading, setLoading] = useState(false);

    async function handleExport() {
        setLoading(true);
        try {
            const result = await exportAllScenarios();
            
            if (result.success && result.data) {
                const jsonStr = JSON.stringify(result.data, null, 2);
                const blob = new Blob([jsonStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement("a");
                a.href = url;
                a.download = `data_center_tool_backup_${new Date().toISOString().split("T")[0]}.json`;
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleExport}
            disabled={loading}
        >
            <Database className="h-4 w-4 mr-2" />
            {loading ? "Exporting..." : "Export All"}
        </Button>
    );
}
