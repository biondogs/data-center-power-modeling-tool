"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, DollarSign, Zap, Building2, List } from "lucide-react";
import { ProjectList } from "./ProjectList";
import { ProjectAggregator, calculateProjectMetrics } from "@/lib/engine/project";
import { Projector, ProjectedPoint } from "@/lib/engine/projector";
import type { Scenario, Site, LineItem, CatalogItem, Assumption } from "@prisma/client";
import type { SiteProjection } from "@/lib/engine/aggregator";

type ScenarioWithDetails = Scenario & {
  sites: (Site & {
    lineItems: (LineItem & { catalogItem: CatalogItem })[];
  })[];
  assumptions: Assumption[];
};

interface ProjectPortfolioViewProps {
  scenario: ScenarioWithDetails;
  projections: Record<string, SiteProjection[]>;
}

export function ProjectPortfolioView({ scenario, projections }: ProjectPortfolioViewProps) {
  const horizon = { horizonStart: scenario.horizonStart, horizonEnd: scenario.horizonEnd };
  
  const { projects, portfolioMetrics } = useMemo(() => {
    const allLineItems: (LineItem & { catalogItem: CatalogItem })[] = [];
    const allProjections: ProjectedPoint[][] = [];
    
    for (const site of scenario.sites) {
      for (const item of site.lineItems) {
        allLineItems.push(item);
        const itemProjections = Projector.projectLineItem(item, horizon);
        allProjections.push(itemProjections);
      }
    }
    
    const projectPortfolio = ProjectAggregator.aggregateByProject(
      allLineItems,
      allProjections
    );
    
    const metrics = {
      totalProjects: Object.keys(projectPortfolio).length,
      totalCapex: Object.values(projectPortfolio).reduce((sum, p) => sum + p.totalCapex, 0),
      avgPower: Object.values(projectPortfolio).length > 0 
        ? Object.values(projectPortfolio).reduce((sum, p) => sum + p.totalPowerMw, 0) / Object.values(projectPortfolio).length
        : 0,
      totalSites: new Set(Object.values(projectPortfolio).flatMap(p => p.sites)).size,
      highRiskCount: Object.values(projectPortfolio).filter(p => {
        const m = calculateProjectMetrics(p);
        return m.riskLevel === "high";
      }).length
    };
    
    return { projects: projectPortfolio, portfolioMetrics: metrics };
  }, [scenario, projections]);

  const hasProjects = Object.keys(projects).length > 0;

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold">Project Portfolio</h2>
          <p className="text-muted-foreground mt-2">
            View and manage all projects across {scenario.sites.length} site{scenario.sites.length !== 1 ? 's' : ''}.
          </p>
        </div>
        {portfolioMetrics.highRiskCount > 0 && (
          <Badge variant="destructive" className="mt-2">
            {portfolioMetrics.highRiskCount} High Risk
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.totalProjects}</div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total CAPEX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioMetrics.totalCapex)}</div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Avg Peak Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.avgPower.toFixed(1)} MW</div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Sites Involved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.totalSites}</div>
          </CardContent>
        </Card>
      </div>

      {hasProjects ? (
        <ProjectList projects={projects} showMetrics={true} />
      ) : (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <List className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground max-w-md">
              This scenario doesn&apos;t have any projects yet. Projects are created by assigning a
              project tag to line items in the deployment plan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
