"use client";

import { useState } from "react";
import { Site } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSiteSettings } from "@/lib/actions";
import { Save } from "lucide-react";

interface SiteSettingsEditorProps {
    site: Site;
}

export function SiteSettingsEditor({ site }: SiteSettingsEditorProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        totalItCapacityMw: site.totalItCapacityMw,
        electricalCapacityMw: site.electricalCapacityMw || 0,
        electricityRatePerKwh: site.electricityRatePerKwh,
        inflationRate: site.inflationRate,
        baselineItPowerMw: site.baselineItPowerMw,
        baselineMechanicalMw: site.baselineMechanicalMw || 0,
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await updateSiteSettings(site.id, formData);
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
                <CardTitle>{site.name} Site Configuration</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Capacity Settings */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Capacity Limits</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="totalItCapacityMw">Total IT Capacity (MW)</Label>
                                    <Input
                                        id="totalItCapacityMw"
                                        type="number"
                                        step="0.01"
                                        value={formData.totalItCapacityMw}
                                        onChange={(e) => setFormData({ ...formData, totalItCapacityMw: parseFloat(e.target.value) })}
                                    />
                                    <p className="text-xs text-muted-foreground">Maximum IT power capacity for this site</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="electricalCapacityMw">Electrical Capacity (MW)</Label>
                                    <Input
                                        id="electricalCapacityMw"
                                        type="number"
                                        step="0.01"
                                        value={formData.electricalCapacityMw}
                                        onChange={(e) => setFormData({ ...formData, electricalCapacityMw: parseFloat(e.target.value) })}
                                    />
                                    <p className="text-xs text-muted-foreground">Maximum electrical infrastructure capacity</p>
                                </div>
                            </div>
                        </div>

                        {/* Baseline Power */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Baseline Loads</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="baselineItPowerMw">Baseline IT Power (MW)</Label>
                                    <Input
                                        id="baselineItPowerMw"
                                        type="number"
                                        step="0.01"
                                        value={formData.baselineItPowerMw}
                                        onChange={(e) => setFormData({ ...formData, baselineItPowerMw: parseFloat(e.target.value) })}
                                    />
                                    <p className="text-xs text-muted-foreground">Existing IT equipment load (excluded from projections)</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="baselineMechanicalMw">Baseline Mechanical (MW)</Label>
                                    <Input
                                        id="baselineMechanicalMw"
                                        type="number"
                                        step="0.01"
                                        value={formData.baselineMechanicalMw}
                                        onChange={(e) => setFormData({ ...formData, baselineMechanicalMw: parseFloat(e.target.value) })}
                                    />
                                    <p className="text-xs text-muted-foreground">Existing mechanical/cooling load</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Electricity Rates */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Electricity Rates</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="electricityRatePerKwh">Rate ($/kWh)</Label>
                                    <Input
                                        id="electricityRatePerKwh"
                                        type="number"
                                        step="0.0001"
                                        value={formData.electricityRatePerKwh}
                                        onChange={(e) => setFormData({ ...formData, electricityRatePerKwh: parseFloat(e.target.value) })}
                                    />
                                    <p className="text-xs text-muted-foreground">Base electricity rate (e.g., 0.10 = $0.10/kWh)</p>
                                </div>
                            </div>
                        </div>

                        {/* Inflation */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Cost Assumptions</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="inflationRate">Rate Inflation (%/year)</Label>
                                    <Input
                                        id="inflationRate"
                                        type="number"
                                        step="0.01"
                                        value={formData.inflationRate * 100}
                                        onChange={(e) => setFormData({ ...formData, inflationRate: parseFloat(e.target.value) / 100 })}
                                    />
                                    <p className="text-xs text-muted-foreground">Annual electricity rate inflation (e.g., 10 = 10%)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            {loading ? "Saving..." : "Save Settings"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
