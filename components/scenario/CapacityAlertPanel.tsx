"use client";

import { useMemo } from "react";
import { Site } from "@prisma/client";
import { SiteProjection } from "@/lib/engine/aggregator";
import { CapacityAnalyzer, SiteCapacityStatus, CapacityConstraint } from "@/lib/engine/capacity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface CapacityAlertPanelProps {
    site: Site;
    projections: SiteProjection[];
}

const statusConfig = {
    ok: {
        variant: "default" as const,
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-50",
        label: "OK",
    },
    warning: {
        variant: "secondary" as const,
        icon: AlertTriangle,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        label: "Warning",
    },
    critical: {
        variant: "destructive" as const,
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        label: "Critical",
    },
};

function ConstraintGauge({ constraint }: { constraint: CapacityConstraint }) {
    const config = statusConfig[constraint.status];
    const Icon = config.icon;
    const percentage = Math.min(constraint.utilization * 100, 100);

    let progressColor = "bg-green-500";
    if (constraint.status === "warning") progressColor = "bg-amber-500";
    if (constraint.status === "critical") progressColor = "bg-red-500";

    const formatValue = (value: number, type: string) => {
        if (type === "rack") return `${value.toFixed(0)} U`;
        if (type === "cooling") return `${value.toFixed(2)} MW`;
        return `${value.toFixed(2)} MW`;
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <span className="font-medium text-sm">{constraint.name}</span>
                </div>
                <Badge variant={config.variant} className="text-xs">
                    {config.label}
                </Badge>
            </div>
            <div className="space-y-1">
                <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                        {formatValue(constraint.used, constraint.type)} /{" "}
                        {formatValue(constraint.limit, constraint.type)}
                    </span>
                    <span>{percentage.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
}

export function CapacityAlertPanel({ site, projections }: CapacityAlertPanelProps) {
    const analysis = useMemo<SiteCapacityStatus | null>(() => {
        if (!projections || projections.length === 0) return null;
        return CapacityAnalyzer.analyzeSiteCapacity(site, projections);
    }, [site, projections]);

    if (!analysis) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Capacity Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No projection data available.</p>
                </CardContent>
            </Card>
        );
    }

    const overallConfig = statusConfig[analysis.overallStatus];
    const OverallIcon = overallConfig.icon;

    // Collect all violations
    const violations = analysis.constraints.filter(
        (c) => c.quartersOverLimit.length > 0
    );

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Capacity Status</CardTitle>
                    <div className="flex items-center gap-2">
                        <OverallIcon className={`h-5 w-5 ${overallConfig.color}`} />
                        <Badge variant={overallConfig.variant} className="text-sm">
                            {overallConfig.label}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Overall Status Summary */}
                <div className={`p-3 rounded-lg ${overallConfig.bgColor}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <OverallIcon className={`h-4 w-4 ${overallConfig.color}`} />
                        <span className={`font-medium ${overallConfig.color}`}>
                            {analysis.overallStatus === "ok"
                                ? "All capacity constraints within limits"
                                : analysis.overallStatus === "warning"
                                ? "Some constraints approaching limits"
                                : "Critical capacity constraints exceeded"}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Peak utilization: {(analysis.peakUtilization * 100).toFixed(1)}% in{" "}
                        {analysis.peakQuarter}
                    </p>
                </div>

                {/* Constraint Gauges */}
                <div className="space-y-4">
                    {analysis.constraints.map((constraint) => (
                        <ConstraintGauge key={constraint.type} constraint={constraint} />
                    ))}
                </div>

                {/* Violations List */}
                {violations.length > 0 && (
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            Constraint Violations
                        </h4>
                        <div className="space-y-2">
                            {violations.map((constraint) => (
                                <div
                                    key={constraint.type}
                                    className="text-sm bg-red-50 p-2 rounded border border-red-100"
                                >
                                    <span className="font-medium text-red-800">
                                        {constraint.name}
                                    </span>
                                    <span className="text-red-600">
                                        {" "}
                                        exceeded in {constraint.quartersOverLimit.length}{" "}
                                        {constraint.quartersOverLimit.length === 1 ? "quarter" : "quarters"}:{" "}
                                    </span>
                                    <span className="text-red-700 font-mono text-xs">
                                        {constraint.quartersOverLimit.join(", ")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
