"use client";

import { SiteProjection } from "@/lib/engine/aggregator";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AggregateData {
  quarter: string;
  [scenarioName: string]: number | string;
}

interface ScenarioAggregateChartProps {
  scenarioProjections: Record<string, {
    name: string;
    projections: SiteProjection[];
  }>;
}

export function ScenarioAggregateChart({ scenarioProjections }: ScenarioAggregateChartProps) {
  const scenarios = Object.values(scenarioProjections);
  
  if (scenarios.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No scenarios available for comparison
        </CardContent>
      </Card>
    );
  }

  const allQuarters = new Set<string>();
  scenarios.forEach(s => {
    s.projections.forEach(p => allQuarters.add(p.quarter));
  });
  
  const sortedQuarters = Array.from(allQuarters).sort();
  
  const data: AggregateData[] = sortedQuarters.map(quarter => {
    const point: AggregateData = { quarter };
    
    scenarios.forEach(scenario => {
      const proj = scenario.projections.find(p => p.quarter === quarter);
      point[scenario.name] = proj ? proj.adjustedPowerMw : 0;
    });
    
    return point;
  });

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F", "#FFBB28"];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Power Comparison Across Scenarios</CardTitle>
        <CardDescription>
          Total adjusted power (MW) by quarter for all scenarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis label={{ value: 'MW', position: 'insideLeft', angle: -90, offset: 10 }} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} MW`, 'Power']} />
              <Legend />
              {scenarios.map((scenario, idx) => (
                <Area
                  key={scenario.name}
                  type="step"
                  dataKey={scenario.name}
                  stroke={colors[idx % colors.length]}
                  fill={colors[idx % colors.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
