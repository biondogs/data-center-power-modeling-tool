"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteScenario } from "@/lib/actions";

interface DeleteScenarioButtonProps {
    scenarioId: string;
    scenarioName: string;
}

export function DeleteScenarioButton({ scenarioId, scenarioName }: DeleteScenarioButtonProps) {
    return (
        <form action={() => deleteScenario(scenarioId)}>
            <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                aria-label={`Delete ${scenarioName}`}
                onClick={(e) => {
                    if (!confirm(`Delete scenario "${scenarioName}"? This cannot be undone.`)) {
                        e.preventDefault();
                    }
                }}
            >
                <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
        </form>
    );
}
