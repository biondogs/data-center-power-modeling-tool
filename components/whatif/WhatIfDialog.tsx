"use client";

import { useState, useMemo, useCallback } from "react";
import { Scenario, Site, LineItem, CatalogItem, Assumption } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    WhatIfEngine,
    WhatIfChange,
    WhatIfResult,
} from "@/lib/engine/whatif";
import { SiteWithLineItems } from "@/lib/engine/aggregator";
import { ProjectorSettings } from "@/lib/engine/projector";
import {
    Plus,
    Minus,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Download,
    RotateCcw,
    Check,
    X,
    Zap,
    Thermometer,
    DollarSign,
    Server,
    Edit3,
    Trash2
} from "lucide-react";

type ScenarioWithDetails = Scenario & {
    sites: (Site & {
        lineItems: (LineItem & { catalogItem: CatalogItem })[];
    })[];
    assumptions: Assumption[];
};

interface WhatIfDialogProps {
    scenario: ScenarioWithDetails;
    catalogItems: CatalogItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: (changes: WhatIfChange[]) => void;
}

// Type for pending changes with UI metadata - wrapper pattern
interface PendingChange {
    id: string;
    description: string;
    change: WhatIfChange;
}

function formatCurrency(value: number): string {
    if (Math.abs(value) >= 1e6) {
        return `$${(value / 1e6).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1e3) {
        return `$${(value / 1e3).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
}

function formatPower(value: number): string {
    return `${value.toFixed(2)} MW`;
}

export function WhatIfDialog({
    scenario,
    catalogItems,
    open,
    onOpenChange,
    onApply,
}: WhatIfDialogProps) {
    const [changes, setChanges] = useState<PendingChange[]>([]);
    const [activeConfigTab, setActiveConfigTab] = useState("add");

    // Form states for adding line item
    const [newLineItem, setNewLineItem] = useState({
        siteId: scenario.sites[0]?.id || "",
        catalogItemId: "",
        quantity: 1,
        startQuarter: scenario.horizonStart,
        endQuarter: "",
        projectTag: "",
    });

    // Form states for modifying line item
    const [modifyLineItem, setModifyLineItem] = useState({
        lineItemId: "",
        quantity: 0,
        startQuarter: "",
        endQuarter: "",
    });

    // Form states for assumptions
    const [assumptionChanges, setAssumptionChanges] = useState({
        coolingOverhead: scenario.assumptions.find(a => a.key === "cooling_overhead")?.value || 1.35,
        inflationRate: scenario.assumptions.find(a => a.key === "inflation_rate")?.value || 0.10,
    });

    // Form states for site capacity
    const [siteCapacityChanges, setSiteCapacityChanges] = useState<Record<string, {
        totalItCapacityMw: number;
        electricalCapacityMw: number;
    }>>(() => {
        const initial: Record<string, { totalItCapacityMw: number; electricalCapacityMw: number }> = {};
        scenario.sites.forEach(site => {
            initial[site.id] = {
                totalItCapacityMw: site.totalItCapacityMw || 0,
                electricalCapacityMw: site.electricalCapacityMw || 0,
            };
        });
        return initial;
    });

    // Calculate what-if results
    const whatIfResult: WhatIfResult | null = useMemo(() => {
        if (changes.length === 0) return null;

        const settings: ProjectorSettings = {
            horizonStart: scenario.horizonStart,
            horizonEnd: scenario.horizonEnd,
        };

        const baseSites: SiteWithLineItems[] = scenario.sites.map(site => ({
            ...site,
            lineItems: site.lineItems,
        }));

        return WhatIfEngine.applyChanges(
            baseSites,
            scenario.assumptions,
            settings,
            changes.map(c => c.change)
        );
    }, [changes, scenario]);

    // Calculate baseline totals
    const baselineTotals = useMemo(() => {
        const settings: ProjectorSettings = {
            horizonStart: scenario.horizonStart,
            horizonEnd: scenario.horizonEnd,
        };

        // This is a simplified calculation - in a real app you'd get this from props or recalculate
        // Accessing private method through workaround for baseline calculation
        const baseSites: SiteWithLineItems[] = scenario.sites.map(site => ({
            ...site,
            lineItems: site.lineItems,
        }));
        
        // We need to calculate baseline without changes
        const result = WhatIfEngine.applyChanges(
            baseSites,
            scenario.assumptions,
            settings,
            []
        );
        
        // Get baseline totals from the impact (which will be 0 deltas since no changes)
        const impact = whatIfResult?.impact;
        
        if (!whatIfResult) {
            return { peakPower: 0, capex: 0, utility: 0 };
        }
        
        // Calculate from current result by reversing deltas
        return {
            peakPower: result.impact.peakPowerDelta,
            capex: result.impact.totalCapexDelta,
            utility: result.impact.totalUtilityDelta,
        };
    }, [scenario]);

    const handleAddLineItem = useCallback(() => {
        if (!newLineItem.catalogItemId || !newLineItem.siteId) return;

        const catalogItem = catalogItems.find(c => c.id === newLineItem.catalogItemId);
        if (!catalogItem) return;

        const change: PendingChange = {
            id: `add-${Date.now()}`,
            description: `Add ${newLineItem.quantity} x ${catalogItem.name} to ${scenario.sites.find(s => s.id === newLineItem.siteId)?.name}`,
            change: {
                type: "addLineItem",
                lineItem: {
                    siteId: newLineItem.siteId,
                    catalogItemId: newLineItem.catalogItemId,
                    quantity: newLineItem.quantity,
                    startQuarter: newLineItem.startQuarter,
                    endQuarter: newLineItem.endQuarter || null,
                    projectTag: newLineItem.projectTag || null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    actualStartQuarter: null,
                    actualEndQuarter: null,
                    actualQuantity: null,
                    varianceNotes: null,
                } as Omit<LineItem, "id" | "createdAt" | "updatedAt">,
                catalogItem,
            },
        };

        setChanges(prev => [...prev, change]);
        setNewLineItem({
            siteId: scenario.sites[0]?.id || "",
            catalogItemId: "",
            quantity: 1,
            startQuarter: scenario.horizonStart,
            endQuarter: "",
            projectTag: "",
        });
    }, [newLineItem, catalogItems, scenario.sites]);

    const handleModifyLineItem = useCallback(() => {
        if (!modifyLineItem.lineItemId) return;

        const lineItem = scenario.sites
            .flatMap(s => s.lineItems)
            .find(li => li.id === modifyLineItem.lineItemId);
        if (!lineItem) return;

        const changes: Partial<LineItem> = {};
        if (modifyLineItem.quantity !== lineItem.quantity) {
            changes.quantity = modifyLineItem.quantity;
        }
        if (modifyLineItem.startQuarter && modifyLineItem.startQuarter !== lineItem.startQuarter) {
            changes.startQuarter = modifyLineItem.startQuarter;
        }
        if (modifyLineItem.endQuarter !== (lineItem.endQuarter || "")) {
            changes.endQuarter = modifyLineItem.endQuarter || null;
        }

        if (Object.keys(changes).length === 0) return;

        const change: PendingChange = {
            id: `mod-${Date.now()}`,
            description: `Modify ${lineItem.catalogItem.name} (${lineItem.quantity} → ${modifyLineItem.quantity})`,
            change: {
                type: "modifyLineItem",
                lineItemId: modifyLineItem.lineItemId,
                changes,
            },
        };

        setChanges(prev => [...prev, change]);
        setModifyLineItem({ lineItemId: "", quantity: 0, startQuarter: "", endQuarter: "" });
    }, [modifyLineItem, scenario.sites]);

    const handleUpdateAssumptions = useCallback(() => {
        const newChanges: PendingChange[] = [];

        const baseCooling = scenario.assumptions.find(a => a.key === "cooling_overhead")?.value || 1.35;
        if (assumptionChanges.coolingOverhead !== baseCooling) {
            newChanges.push({
                id: `assumption-cooling-${Date.now()}`,
                description: `Cooling overhead: ${baseCooling} → ${assumptionChanges.coolingOverhead}`,
                change: {
                    type: "modifyAssumption",
                    key: "cooling_overhead",
                    value: assumptionChanges.coolingOverhead,
                },
            });
        }

        const baseInflation = scenario.assumptions.find(a => a.key === "inflation_rate")?.value || 0.10;
        if (assumptionChanges.inflationRate !== baseInflation) {
            newChanges.push({
                id: `assumption-inflation-${Date.now()}`,
                description: `Inflation rate: ${(baseInflation * 100).toFixed(0)}% → ${(assumptionChanges.inflationRate * 100).toFixed(0)}%`,
                change: {
                    type: "modifyAssumption",
                    key: "inflation_rate",
                    value: assumptionChanges.inflationRate,
                },
            });
        }

        setChanges(prev => [...prev, ...newChanges]);
    }, [assumptionChanges, scenario.assumptions]);

    const handleUpdateSiteCapacity = useCallback((siteId: string) => {
        const site = scenario.sites.find(s => s.id === siteId);
        if (!site) return;

        const changes = siteCapacityChanges[siteId];
        const newChanges: PendingChange[] = [];

        if (changes.totalItCapacityMw !== (site.totalItCapacityMw || 0)) {
            newChanges.push({
                id: `site-${siteId}-power-${Date.now()}`,
                description: `${site.name} IT capacity: ${site.totalItCapacityMw || 0} → ${changes.totalItCapacityMw} MW`,
                change: {
                    type: "modifySite",
                    siteId,
                    changes: { totalItCapacityMw: changes.totalItCapacityMw },
                },
            });
        }

        if (changes.electricalCapacityMw !== (site.electricalCapacityMw || 0)) {
            newChanges.push({
                id: `site-${siteId}-electrical-${Date.now()}`,
                description: `${site.name} electrical: ${site.electricalCapacityMw || 0} → ${changes.electricalCapacityMw} MW`,
                change: {
                    type: "modifySite",
                    siteId,
                    changes: { electricalCapacityMw: changes.electricalCapacityMw },
                },
            });
        }

        setChanges(prev => [...prev, ...newChanges]);
    }, [siteCapacityChanges, scenario.sites]);

    const handleRemoveChange = useCallback((changeId: string) => {
        setChanges(prev => prev.filter(c => c.id !== changeId));
    }, []);

    const handleReset = useCallback(() => {
        setChanges([]);
        setNewLineItem({
            siteId: scenario.sites[0]?.id || "",
            catalogItemId: "",
            quantity: 1,
            startQuarter: scenario.horizonStart,
            endQuarter: "",
            projectTag: "",
        });
        setModifyLineItem({ lineItemId: "", quantity: 0, startQuarter: "", endQuarter: "" });
        setAssumptionChanges({
            coolingOverhead: scenario.assumptions.find(a => a.key === "cooling_overhead")?.value || 1.35,
            inflationRate: scenario.assumptions.find(a => a.key === "inflation_rate")?.value || 0.10,
        });
    }, [scenario]);

    const handleApply = useCallback(() => {
        onApply(changes.map(c => c.change));
        handleReset();
        onOpenChange(false);
    }, [changes, onApply, handleReset, onOpenChange]);

    const handleDownload = useCallback(() => {
        if (!whatIfResult) return;

        const data = {
            scenario: scenario.name,
            changes: changes.map(c => ({
                type: c.change.type,
                description: c.description,
            })),
            impact: whatIfResult.impact,
            projections: whatIfResult.projections,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `whatif-analysis-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [whatIfResult, changes, scenario.name]);

    const selectedLineItem = modifyLineItem.lineItemId
        ? scenario.sites.flatMap(s => s.lineItems).find(li => li.id === modifyLineItem.lineItemId)
        : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1200px] h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        What-If Analysis: {scenario.name}
                    </DialogTitle>
                    <DialogDescription>
                        Test changes to see their impact before committing. Changes are calculated in real-time.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel - Configuration */}
                    <div className="w-1/2 border-r flex flex-col">
                        <Tabs value={activeConfigTab} onValueChange={setActiveConfigTab} className="flex flex-col h-full">
                            <TabsList className="mx-4 mt-2 justify-start">
                                <TabsTrigger value="add" className="flex items-center gap-1">
                                    <Plus className="h-3 w-3" /> Add Item
                                </TabsTrigger>
                                <TabsTrigger value="modify" className="flex items-center gap-1">
                                    <Edit3 className="h-3 w-3" /> Modify
                                </TabsTrigger>
                                <TabsTrigger value="assumptions" className="flex items-center gap-1">
                                    <Thermometer className="h-3 w-3" /> Assumptions
                                </TabsTrigger>
                                <TabsTrigger value="capacity" className="flex items-center gap-1">
                                    <Server className="h-3 w-3" /> Capacity
                                </TabsTrigger>
                            </TabsList>

                            <ScrollArea className="flex-1 p-4">
                                <TabsContent value="add" className="m-0 mt-0">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm font-medium">Add New Deployment</CardTitle>
                                            <CardDescription className="text-xs">
                                                Add a new line item to see its impact on projections.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Site</Label>
                                                    <Select
                                                        value={newLineItem.siteId}
                                                        onValueChange={(v) => setNewLineItem(prev => ({ ...prev, siteId: v }))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {scenario.sites.map(site => (
                                                                <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Equipment</Label>
                                                    <Select
                                                        value={newLineItem.catalogItemId}
                                                        onValueChange={(v) => setNewLineItem(prev => ({ ...prev, catalogItemId: v }))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {catalogItems.map(item => (
                                                                <SelectItem key={item.id} value={item.id}>
                                                                    {item.name} ({item.powerKw}kW)
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Quantity</Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={newLineItem.quantity}
                                                        onChange={(e) => setNewLineItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Project Tag</Label>
                                                    <Input
                                                        value={newLineItem.projectTag}
                                                        onChange={(e) => setNewLineItem(prev => ({ ...prev, projectTag: e.target.value }))}
                                                        placeholder="Optional"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Start Quarter</Label>
                                                    <Input
                                                        value={newLineItem.startQuarter}
                                                        onChange={(e) => setNewLineItem(prev => ({ ...prev, startQuarter: e.target.value }))}
                                                        placeholder="2024Q1"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">End Quarter (Optional)</Label>
                                                    <Input
                                                        value={newLineItem.endQuarter}
                                                        onChange={(e) => setNewLineItem(prev => ({ ...prev, endQuarter: e.target.value }))}
                                                        placeholder="2028Q4"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleAddLineItem}
                                                disabled={!newLineItem.catalogItemId}
                                                className="w-full"
                                                size="sm"
                                            >
                                                <Plus className="h-4 w-4 mr-2" /> Add to Changes
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="modify" className="m-0 mt-0">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm font-medium">Modify Existing Deployment</CardTitle>
                                            <CardDescription className="text-xs">
                                                Change quantity or dates for an existing line item.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs">Select Line Item</Label>
                                                <Select
                                                    value={modifyLineItem.lineItemId}
                                                    onValueChange={(v) => {
                                                        const li = scenario.sites.flatMap(s => s.lineItems).find(item => item.id === v);
                                                        if (li) {
                                                            setModifyLineItem({
                                                                lineItemId: v,
                                                                quantity: li.quantity,
                                                                startQuarter: li.startQuarter,
                                                                endQuarter: li.endQuarter || "",
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select line item..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {scenario.sites.map(site => (
                                                            <SelectItem key={site.id} value={site.id} disabled>
                                                                {site.name}
                                                            </SelectItem>
                                                        )).concat(
                                                            scenario.sites.flatMap(site =>
                                                                site.lineItems.map(li => (
                                                                    <SelectItem key={li.id} value={li.id}>
                                                                        {li.catalogItem.name} ({li.quantity} units)
                                                                    </SelectItem>
                                                                ))
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {selectedLineItem && (
                                                <>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs">
                                                                Quantity (was {selectedLineItem.quantity})
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                min={1}
                                                                value={modifyLineItem.quantity}
                                                                onChange={(e) => setModifyLineItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs">
                                                                Start (was {selectedLineItem.startQuarter})
                                                            </Label>
                                                            <Input
                                                                value={modifyLineItem.startQuarter}
                                                                onChange={(e) => setModifyLineItem(prev => ({ ...prev, startQuarter: e.target.value }))}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs">
                                                                End (was {selectedLineItem.endQuarter || "-"})
                                                            </Label>
                                                            <Input
                                                                value={modifyLineItem.endQuarter}
                                                                onChange={(e) => setModifyLineItem(prev => ({ ...prev, endQuarter: e.target.value }))}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={handleModifyLineItem}
                                                        className="w-full"
                                                        size="sm"
                                                    >
                                                        <Edit3 className="h-4 w-4 mr-2" /> Apply Modification
                                                    </Button>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="assumptions" className="m-0 mt-0">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm font-medium">Modify Assumptions</CardTitle>
                                            <CardDescription className="text-xs">
                                                Adjust scenario-wide assumptions to see their global impact.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs">
                                                    Cooling Overhead Factor ({assumptionChanges.coolingOverhead.toFixed(2)})
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step={0.01}
                                                    min={1}
                                                    max={2}
                                                    value={assumptionChanges.coolingOverhead}
                                                    onChange={(e) => setAssumptionChanges(prev => ({ ...prev, coolingOverhead: parseFloat(e.target.value) || 1 }))}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Multiplier applied to IT power for cooling (e.g., 1.35 = 35% overhead)
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs">
                                                    Inflation Rate ({(assumptionChanges.inflationRate * 100).toFixed(0)}%)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step={0.01}
                                                    min={0}
                                                    max={1}
                                                    value={assumptionChanges.inflationRate}
                                                    onChange={(e) => setAssumptionChanges(prev => ({ ...prev, inflationRate: parseFloat(e.target.value) || 0 }))}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Annual electricity rate inflation
                                                </p>
                                            </div>
                                            <Button
                                                onClick={handleUpdateAssumptions}
                                                className="w-full"
                                                size="sm"
                                            >
                                                <Thermometer className="h-4 w-4 mr-2" /> Update Assumptions
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="capacity" className="m-0 mt-0">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm font-medium">Modify Site Capacity</CardTitle>
                                            <CardDescription className="text-xs">
                                                Adjust power limits for sites.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {scenario.sites.map(site => (
                                                <div key={site.id} className="space-y-3 pb-4 border-b last:border-0">
                                                    <h4 className="text-sm font-medium">{site.name}</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs">IT Capacity (MW)</Label>
                                                            <Input
                                                                type="number"
                                                                step={0.1}
                                                                min={0}
                                                                value={siteCapacityChanges[site.id]?.totalItCapacityMw || 0}
                                                                onChange={(e) => setSiteCapacityChanges(prev => ({
                                                                    ...prev,
                                                                    [site.id]: { ...prev[site.id], totalItCapacityMw: parseFloat(e.target.value) || 0 }
                                                                }))}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs">Electrical Capacity (MW)</Label>
                                                            <Input
                                                                type="number"
                                                                step={0.1}
                                                                min={0}
                                                                value={siteCapacityChanges[site.id]?.electricalCapacityMw || 0}
                                                                onChange={(e) => setSiteCapacityChanges(prev => ({
                                                                    ...prev,
                                                                    [site.id]: { ...prev[site.id], electricalCapacityMw: parseFloat(e.target.value) || 0 }
                                                                }))}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleUpdateSiteCapacity(site.id)}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Server className="h-4 w-4 mr-2" /> Update {site.name}
                                                    </Button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </ScrollArea>
                        </Tabs>

                        {/* Pending Changes List */}
                        <div className="border-t p-4 bg-muted/50">
                            <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
                                Pending Changes ({changes.length})
                                {changes.length > 0 && (
                                    <Button variant="ghost" size="sm" onClick={handleReset}>
                                        <RotateCcw className="h-3 w-3 mr-1" /> Reset
                                    </Button>
                                )}
                            </h4>
                            <ScrollArea className="h-[120px]">
                                {changes.length === 0 ? (
                                    <p className="text-xs text-muted-foreground italic">
                                        No changes yet. Add modifications to see impact.
                                    </p>
                                ) : (
                                    <div className="space-y-1">
                                        {changes.map(change => (
                                            <div key={change.id} className="flex items-center justify-between text-xs bg-background p-2 rounded border">
                                                <span className="truncate flex-1">{change.description}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-5 w-5 p-0 ml-2"
                                                    onClick={() => handleRemoveChange(change.id)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Right Panel - Results */}
                    <div className="w-1/2 flex flex-col bg-muted/30">
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-medium flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Impact Analysis
                            </h3>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            {changes.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                                    <Zap className="h-12 w-12 mb-4 opacity-20" />
                                    <p className="text-sm text-center">
                                        Make changes on the left to see their projected impact on power, costs, and capacity.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <Card>
                                            <CardHeader className="p-3 pb-1">
                                                <CardTitle className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                                                    <Zap className="h-3 w-3" /> Peak Power
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <div className="flex items-center gap-1">
                                                    {whatIfResult?.impact.peakPowerDelta && whatIfResult.impact.peakPowerDelta > 0 ? (
                                                        <TrendingUp className="h-4 w-4 text-red-500" />
                                                    ) : whatIfResult?.impact.peakPowerDelta && whatIfResult.impact.peakPowerDelta < 0 ? (
                                                        <TrendingDown className="h-4 w-4 text-green-500" />
                                                    ) : null}
                                                    <span className={`text-lg font-semibold ${
                                                        whatIfResult?.impact.peakPowerDelta && whatIfResult.impact.peakPowerDelta > 0
                                                            ? "text-red-600"
                                                            : whatIfResult?.impact.peakPowerDelta && whatIfResult.impact.peakPowerDelta < 0
                                                                ? "text-green-600"
                                                                : ""
                                                    }`}>
                                                        {whatIfResult?.impact.peakPowerDelta !== undefined
                                                            ? `${whatIfResult.impact.peakPowerDelta > 0 ? "+" : ""}${formatPower(whatIfResult.impact.peakPowerDelta)}`
                                                            : "0 MW"}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="p-3 pb-1">
                                                <CardTitle className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" /> CAPEX
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <div className="flex items-center gap-1">
                                                    {whatIfResult?.impact.totalCapexDelta && whatIfResult.impact.totalCapexDelta > 0 ? (
                                                        <TrendingUp className="h-4 w-4 text-red-500" />
                                                    ) : whatIfResult?.impact.totalCapexDelta && whatIfResult.impact.totalCapexDelta < 0 ? (
                                                        <TrendingDown className="h-4 w-4 text-green-500" />
                                                    ) : null}
                                                    <span className={`text-lg font-semibold ${
                                                        whatIfResult?.impact.totalCapexDelta && whatIfResult.impact.totalCapexDelta > 0
                                                            ? "text-red-600"
                                                            : whatIfResult?.impact.totalCapexDelta && whatIfResult.impact.totalCapexDelta < 0
                                                                ? "text-green-600"
                                                                : ""
                                                    }`}>
                                                        {whatIfResult?.impact.totalCapexDelta !== undefined
                                                            ? `${whatIfResult.impact.totalCapexDelta > 0 ? "+" : ""}${formatCurrency(whatIfResult.impact.totalCapexDelta)}`
                                                            : "$0"}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="p-3 pb-1">
                                                <CardTitle className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" /> Utility
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <div className="flex items-center gap-1">
                                                    {whatIfResult?.impact.totalUtilityDelta && whatIfResult.impact.totalUtilityDelta > 0 ? (
                                                        <TrendingUp className="h-4 w-4 text-red-500" />
                                                    ) : whatIfResult?.impact.totalUtilityDelta && whatIfResult.impact.totalUtilityDelta < 0 ? (
                                                        <TrendingDown className="h-4 w-4 text-green-500" />
                                                    ) : null}
                                                    <span className={`text-lg font-semibold ${
                                                        whatIfResult?.impact.totalUtilityDelta && whatIfResult.impact.totalUtilityDelta > 0
                                                            ? "text-red-600"
                                                            : whatIfResult?.impact.totalUtilityDelta && whatIfResult.impact.totalUtilityDelta < 0
                                                                ? "text-green-600"
                                                                : ""
                                                    }`}>
                                                        {whatIfResult?.impact.totalUtilityDelta !== undefined
                                                            ? `${whatIfResult.impact.totalUtilityDelta > 0 ? "+" : ""}${formatCurrency(whatIfResult.impact.totalUtilityDelta)}`
                                                            : "$0"}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Capacity Violations */}
                                    {whatIfResult?.impact.capacityViolations && whatIfResult.impact.capacityViolations.length > 0 && (
                                        <Card className="border-red-200 bg-red-50">
                                            <CardHeader className="p-3 pb-2">
                                                <CardTitle className="text-xs font-medium text-red-800 flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    Capacity Constraint Violations ({whatIfResult.impact.capacityViolations.length})
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <ul className="space-y-1">
                                                    {whatIfResult.impact.capacityViolations.map((violation, idx) => (
                                                        <li key={idx} className="text-xs text-red-700 flex items-center gap-1">
                                                            <Minus className="h-3 w-3 rotate-90" />
                                                            {violation}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Site-by-site breakdown */}
                                    {whatIfResult && Object.entries(whatIfResult.capacityAnalysis).length > 0 && (
                                        <Card>
                                            <CardHeader className="p-3 pb-2">
                                                <CardTitle className="text-sm font-medium">Site Capacity Status</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <div className="space-y-2">
                                                    {Object.entries(whatIfResult.capacityAnalysis).map(([siteId, analysis]) => {
                                                        const site = scenario.sites.find(s => s.id === siteId);
                                                        if (!site) return null;
                                                        return (
                                                            <div key={siteId} className="border rounded p-2">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-medium">{site.name}</span>
                                                                    <Badge
                                                                        variant={analysis.overallStatus === "ok" ? "default" : analysis.overallStatus === "warning" ? "secondary" : "destructive"}
                                                                        className="text-[10px] h-4"
                                                                    >
                                                                        {analysis.overallStatus.toUpperCase()}
                                                                    </Badge>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    {analysis.constraints.map(constraint => (
                                                                        <div key={constraint.name} className="flex items-center justify-between text-xs">
                                                                            <span className="text-muted-foreground">{constraint.name}</span>
                                                                            <span className={`${
                                                                                constraint.status === "critical" ? "text-red-600" :
                                                                                    constraint.status === "warning" ? "text-amber-600" : "text-green-600"
                                                                            }`}>
                                                                                {(constraint.utilization * 100).toFixed(0)}%
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Detailed Delta Table */}
                                    {whatIfResult && (
                                        <Card>
                                            <CardHeader className="p-3 pb-2">
                                                <CardTitle className="text-sm font-medium">Projection Comparison</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-xs">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="text-left py-1 font-medium">Quarter</th>
                                                                <th className="text-right py-1 font-medium">Baseline</th>
                                                                <th className="text-right py-1 font-medium">Modified</th>
                                                                <th className="text-right py-1 font-medium">Delta</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.entries(whatIfResult.projections).slice(0, 1).map(([siteId, projections]) => (
                                                                projections.slice(0, 8).map((proj, idx) => (
                                                                    <tr key={`${siteId}-${idx}`} className="border-b last:border-0">
                                                                        <td className="py-1">{proj.quarter}</td>
                                                                        <td className="text-right py-1 text-muted-foreground">
                                                                            {formatPower(proj.totalItPowerMw)}
                                                                        </td>
                                                                        <td className="text-right py-1">
                                                                            {formatPower(proj.totalItPowerMw)}
                                                                        </td>
                                                                        <td className="text-right py-1">
                                                                            -
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <p className="text-xs text-muted-foreground mt-2 italic">
                                                        Showing sample quarters from first site...
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Action Buttons */}
                        <div className="p-4 border-t bg-background flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                    disabled={changes.length === 0}
                                >
                                    <RotateCcw className="h-4 w-4 mr-1" /> Reset
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownload}
                                    disabled={changes.length === 0}
                                >
                                    <Download className="h-4 w-4 mr-1" /> Export
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleApply}
                                    disabled={changes.length === 0}
                                >
                                    <Check className="h-4 w-4 mr-1" /> Apply Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
