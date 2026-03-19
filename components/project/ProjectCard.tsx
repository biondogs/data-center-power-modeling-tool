"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
    Zap,
    DollarSign,
    Calendar,
    Building2,
    AlertTriangle,
    Clock,
    List,
    CheckCircle2,
    XCircle
} from "lucide-react";

// Project status types
export type ProjectStatus = "planning" | "active" | "completed" | "on_hold";
export type RiskLevel = "low" | "medium" | "high";
export type TimelineStatus = "on_track" | "delayed";

// Project summary data
export interface ProjectSummary {
    id: string;
    name: string;
    description?: string | null;
    status: ProjectStatus;
}

// Computed metrics for the project
export interface ProjectMetrics {
    totalCapex: number;
    peakPowerMw: number;
    lineItemCount: number;
    startQuarter: string;
    endQuarter: string;
    siteCount: number;
    riskLevel: RiskLevel;
    timelineStatus: TimelineStatus;
}

interface ProjectCardProps {
    project: ProjectSummary;
    metrics: ProjectMetrics;
    targetCapex?: number;
    onClick?: () => void;
}

// Format currency to $X.XM or $XXXK
function formatCurrency(value: number): string {
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `$${Math.round(value / 1_000)}K`;
    }
    return `$${value}`;
}

// Format quarter for display (e.g., "2024Q1" to "2024 Q1")
function formatQuarter(quarter: string): string {
    // Handle both "2024Q1" and "2024-Q1" formats
    const match = quarter.match(/(\d{4})[Q-]?(\d)/);
    if (match) {
        return `${match[1]}Q${match[2]}`;
    }
    return quarter;
}

// Get status badge styling
function getStatusBadge(status: ProjectStatus): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
    const statusMap: Record<ProjectStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
        planning: { label: "Planning", variant: "secondary" },
        active: { label: "Active", variant: "default" },
        completed: { label: "Completed", variant: "outline" },
        on_hold: { label: "On Hold", variant: "destructive" },
    };
    return statusMap[status];
}

// Get risk badge styling
function getRiskBadge(risk: RiskLevel): { label: string; className: string } {
    const riskMap: Record<RiskLevel, { label: string; className: string }> = {
        low: {
            label: "Low Risk",
            className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        },
        medium: {
            label: "Medium Risk",
            className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
        },
        high: {
            label: "High Risk",
            className: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
        },
    };
    return riskMap[risk];
}

// Get timeline status indicator
function getTimelineIndicator(status: TimelineStatus): { icon: React.ReactNode; label: string; className: string } {
    if (status === "on_track") {
        return {
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            label: "On Track",
            className: "text-emerald-600 dark:text-emerald-400",
        };
    }
    return {
        icon: <XCircle className="h-3.5 w-3.5" />,
        label: "Delayed",
        className: "text-rose-600 dark:text-rose-400",
    };
}

export function ProjectCard({
    project,
    metrics,
    targetCapex,
    onClick,
}: ProjectCardProps) {
    const statusBadge = getStatusBadge(project.status);
    const riskBadge = getRiskBadge(metrics.riskLevel);
    const timelineIndicator = getTimelineIndicator(metrics.timelineStatus);
    const budgetUtilization = targetCapex && targetCapex > 0
        ? Math.min(Math.round((metrics.totalCapex / targetCapex) * 100), 100)
        : null;

    const isOverBudget = targetCapex && metrics.totalCapex > targetCapex;

    return (
        <Card
            className={cn(
                "transition-all duration-200",
                onClick && "cursor-pointer hover:shadow-md hover:border-primary/50"
            )}
            onClick={onClick}
        >
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold leading-tight">
                            {project.name}
                        </CardTitle>
                        {project.description && (
                            <CardDescription className="mt-1.5 line-clamp-2">
                                {project.description}
                            </CardDescription>
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                        </Badge>
                        <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full border", riskBadge.className)}>
                            {riskBadge.label}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Total CAPEX</span>
                        </div>
                        <div className="text-lg font-semibold">
                            {formatCurrency(metrics.totalCapex)}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Zap className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Peak Power</span>
                        </div>
                        <div className="text-lg font-semibold">
                            {metrics.peakPowerMw.toFixed(1)} MW
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <List className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Deployments</span>
                        </div>
                        <div className="text-lg font-semibold">
                            {metrics.lineItemCount}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {formatQuarter(metrics.startQuarter)} - {formatQuarter(metrics.endQuarter)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{metrics.siteCount} {metrics.siteCount === 1 ? "site" : "sites"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className={cn("flex items-center gap-1.5", timelineIndicator.className)}>
                        {timelineIndicator.icon}
                        <span className="text-sm font-medium">{timelineIndicator.label}</span>
                    </div>
                </div>

                {targetCapex !== undefined && targetCapex > 0 && (
                    <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Budget</span>
                                {isOverBudget && (
                                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        <span className="text-xs font-medium">Over Budget</span>
                                    </span>
                                )}
                            </div>
                            <span className={cn("font-medium", isOverBudget && "text-rose-600 dark:text-rose-400")}>
                                {budgetUtilization}%
                            </span>
                        </div>
                        <Progress
                            value={budgetUtilization ?? 0}
                            className={cn(
                                "h-2",
                                isOverBudget && "[&>div]:bg-rose-500"
                            )}
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatCurrency(metrics.totalCapex)} spent</span>
                            <span>Target: {formatCurrency(targetCapex)}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ProjectCard;
