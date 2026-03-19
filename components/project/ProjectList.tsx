"use client";

import { useState, useMemo } from "react";
import { ProjectSummary, ProjectPortfolio, calculateProjectMetrics } from "@/lib/engine/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Search, Package, DollarSign, AlertTriangle } from "lucide-react";

interface ProjectListProps {
  projects: ProjectPortfolio;
  showMetrics?: boolean;
  targetBudgets?: Record<string, number>;
}

type SortOption = "name" | "startDate" | "totalCapex" | "riskLevel";
type GroupOption = "none" | "status" | "site";

export function ProjectList({
  projects,
  showMetrics = true,
  targetBudgets = {},
}: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [groupBy, setGroupBy] = useState<GroupOption>("none");

  const projectEntries = useMemo(() => {
    return Object.values(projects);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projectEntries.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projectEntries, searchQuery]);

  const sortedProjects = useMemo(() => {
    const projectsWithMetrics = filteredProjects.map((project) => ({
      ...project,
      metrics: calculateProjectMetrics(project, targetBudgets[project.name]),
    }));

    return [...projectsWithMetrics].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "startDate":
          if (!a.startQuarter && !b.startQuarter) return 0;
          if (!a.startQuarter) return 1;
          if (!b.startQuarter) return -1;
          return a.startQuarter.localeCompare(b.startQuarter);
        case "totalCapex":
          return b.totalCapex - a.totalCapex;
        case "riskLevel":
          const riskOrder = { high: 0, medium: 1, low: 2 };
          return riskOrder[a.metrics.riskLevel] - riskOrder[b.metrics.riskLevel];
        default:
          return 0;
      }
    });
  }, [filteredProjects, sortBy, targetBudgets]);

  const groupedProjects = useMemo(() => {
    if (groupBy === "none") {
      return { "All Projects": sortedProjects };
    }

    const groups: Record<string, typeof sortedProjects> = {};

    sortedProjects.forEach((project) => {
      let key: string;
      if (groupBy === "status") {
        key = project.status || "No Status";
      } else {
        key = project.sites.length > 0 ? project.sites[0] : "No Site";
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(project);
    });

    return groups;
  }, [sortedProjects, groupBy]);

  const stats = useMemo(() => {
    if (projectEntries.length === 0) {
      return {
        totalProjects: 0,
        totalCapex: 0,
        avgRisk: "N/A" as const,
        totalPower: 0,
      };
    }

    const totalCapex = projectEntries.reduce((sum, p) => sum + p.totalCapex, 0);
    const totalPower = projectEntries.reduce((sum, p) => sum + p.totalPowerMw, 0);

    let riskScore = 0;
    projectEntries.forEach((project) => {
      const metrics = calculateProjectMetrics(project, targetBudgets[project.name]);
      if (metrics.riskLevel === "high") riskScore += 2;
      else if (metrics.riskLevel === "medium") riskScore += 1;
    });
    const avgRiskScore = riskScore / projectEntries.length;
    const avgRisk = avgRiskScore > 1.3 ? "High" : avgRiskScore > 0.6 ? "Medium" : "Low";

    return {
      totalProjects: projectEntries.length,
      totalCapex,
      avgRisk,
      totalPower,
    };
  }, [projectEntries, targetBudgets]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getRiskBadgeVariant = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
      default:
        return "default";
    }
  };

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "in progress":
        return "default";
      case "completed":
      case "done":
        return "secondary";
      case "delayed":
      case "at risk":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (projectEntries.length === 0) {
    return (
      <Card className="p-6">
        <CardContent className="py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-muted rounded-full">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Get started by creating your first project to track deployments,
            capacity, and costs across your data center sites.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {showMetrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.totalCapex)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total CAPEX</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.avgRisk}</div>
                  <div className="text-sm text-muted-foreground">Avg Risk Level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats.totalPower.toFixed(1)} MW
                  </div>
                  <div className="text-sm text-muted-foreground">Total Power</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="startDate">Start Date</SelectItem>
                <SelectItem value="totalCapex">Total CAPEX</SelectItem>
                <SelectItem value="riskLevel">Risk Level</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={groupBy}
              onValueChange={(value) => setGroupBy(value as GroupOption)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Grouping</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="site">Site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground">
        Showing {filteredProjects.length} of {projectEntries.length} projects
      </div>

      <div className="space-y-6">
        {Object.entries(groupedProjects).map(([groupName, groupProjects]) => (
          <div key={groupName} className="space-y-3">
            {groupBy !== "none" && (
              <h3 className="text-lg font-semibold text-muted-foreground">
                {groupName}
                <Badge variant="outline" className="ml-2">
                  {groupProjects.length}
                </Badge>
              </h3>
            )}

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {groupProjects.map((project) => {
                const metrics = calculateProjectMetrics(
                  project,
                  targetBudgets[project.name]
                );

                return (
                  <Card
                    key={project.name}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base font-semibold line-clamp-1">
                          {project.name}
                        </CardTitle>
                        <Badge variant={getRiskBadgeVariant(metrics.riskLevel)}>
                          {metrics.riskLevel}
                        </Badge>
                      </div>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.status && (
                          <Badge variant={getStatusBadgeVariant(project.status)}>
                            {project.status}
                          </Badge>
                        )}
                        {project.sites.slice(0, 2).map((site) => (
                          <Badge key={site} variant="outline">
                            {site}
                          </Badge>
                        ))}
                        {project.sites.length > 2 && (
                          <Badge variant="outline">
                            +{project.sites.length - 2} more
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Total CAPEX
                          </div>
                          <div className="text-sm font-semibold">
                            {formatCurrency(project.totalCapex)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Peak Power
                          </div>
                          <div className="text-sm font-semibold">
                            {project.totalPowerMw.toFixed(2)} MW
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Timeline
                          </div>
                          <div className="text-sm font-semibold">
                            {project.startQuarter || "—"} → {project.endQuarter || "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Deployments
                          </div>
                          <div className="text-sm font-semibold">
                            {project.lineItemCount} items
                          </div>
                        </div>
                      </div>

                      {metrics.budgetUtilization !== null && (
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">
                              Budget Utilization
                            </span>
                            <span
                              className={
                                metrics.budgetUtilization > 100
                                  ? "text-destructive font-medium"
                                  : ""
                              }
                            >
                              {metrics.budgetUtilization.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                metrics.budgetUtilization > 100
                                  ? "bg-destructive"
                                  : metrics.budgetUtilization > 80
                                  ? "bg-yellow-500"
                                  : "bg-primary"
                              }`}
                              style={{
                                width: `${Math.min(
                                  metrics.budgetUtilization,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && searchQuery && (
        <Card className="p-6">
          <CardContent className="py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-muted rounded-full">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              No projects match your search for &quot;{searchQuery}&quot;. Try a different
              search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
