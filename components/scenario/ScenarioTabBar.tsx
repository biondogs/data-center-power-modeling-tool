"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, BarChart2, Table as TableIcon, FileText, FolderOpen, Calendar, Layers, Gauge, History } from "lucide-react";

interface ScenarioTabBarProps {
    value: string;
    onValueChange: (value: string) => void;
    activeSiteId: string;
    onSiteChange: (siteId: string) => void;
    sites: { id: string; name: string }[];
}

const TABS = [
    { value: "plan", label: "Plan", icon: TableIcon },
    { value: "analysis", label: "Analysis", icon: BarChart2 },
    { value: "reports", label: "Reports", icon: FileText },
    { value: "projects", label: "Projects", icon: FolderOpen },
    { value: "timeline", label: "Timeline", icon: Calendar },
    { value: "sites", label: "Multi-Site", icon: Layers },
    { value: "capacity", label: "Capacity", icon: Gauge },
    { value: "history", label: "History", icon: History },
    { value: "settings", label: "Settings", icon: Settings },
] as const;

export function ScenarioTabBar({
    value,
    onValueChange,
    activeSiteId,
    onSiteChange,
    sites,
}: ScenarioTabBarProps) {
    return (
        <Tabs value={value} onValueChange={onValueChange} className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
                <TabsList>
                    {TABS.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Site Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Active Site:</span>
                    <Select value={activeSiteId} onValueChange={onSiteChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Site" />
                        </SelectTrigger>
                        <SelectContent>
                            {sites.map((site) => (
                                <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Tabs>
    );
}