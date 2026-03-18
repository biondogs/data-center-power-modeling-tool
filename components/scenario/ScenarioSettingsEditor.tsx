"use client";

import { useState } from "react";
import { Assumption } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateScenarioAssumptions } from "@/lib/actions";
import { Save, Info } from "lucide-react";

interface ScenarioSettingsEditorProps {
    scenarioId: string;
    assumptions: Assumption[];
}

export function ScenarioSettingsEditor({ scenarioId, assumptions }: ScenarioSettingsEditorProps) {
    const [loading, setLoading] = useState(false);

    const coolingOverhead = assumptions.find(a => a.key === 'cooling_overhead')?.value ?? 1.35;
    const globalInflation = assumptions.find(a => a.key === 'inflation_rate')?.value ?? 0.10;

    const [formData, setFormData] = useState({
        coolingOverhead,
        globalInflation,
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await updateScenarioAssumptions(scenarioId, formData);
        } catch (err) {
            console.error(err);
            alert("Failed to save settings");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Global Scenario Assumptions</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Cooling Overhead (PUE) */}
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="coolingOverhead">Cooling Overhead (PUE Factor)</Label>
                                <Input
                                    id="coolingOverhead"
                                    type="number"
                                    step="0.01"
                                    value={formData.coolingOverhead}
                                    onChange={(e) => setFormData({ ...formData, coolingOverhead: parseFloat(e.target.value) })}
                                />
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Info className="h-3 w-3" />
                                    Total Power = IT Power × Cooling Overhead (1.35 = 35% overhead)
                                </p>
                            </div>
                        </div>

                        {/* Global Inflation */}
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="globalInflation">Default Rate Inflation (%/year)</Label>
                                <Input
                                    id="globalInflation"
                                    type="number"
                                    step="0.1"
                                    value={formData.globalInflation * 100}
                                    onChange={(e) => setFormData({ ...formData, globalInflation: parseFloat(e.target.value) / 100 })}
                                />
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Info className="h-3 w-3" />
                                    Default inflation for sites without specific rate (10% = 0.10)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted rounded-lg p-4 space-y-2">
                        <h4 className="font-medium">How These Settings Work</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• <strong>Cooling Overhead:</strong> Multiplier applied to IT power to get total facility power. 1.35 means 35% overhead for cooling.</li>
                            <li>• <strong>Rate Inflation:</strong> Annual increase in electricity rates. Applied yearly (starting Q1).</li>
                            <li>• Site-specific settings override global defaults where applicable.</li>
                        </ul>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            {loading ? "Saving..." : "Save Assumptions"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
