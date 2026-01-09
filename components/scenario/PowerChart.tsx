"use client";

import { SiteProjection } from "@/lib/engine/aggregator";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PowerChartProps {
    data: SiteProjection[];
    siteName: string;
}

export function PowerChart({ data, siteName }: PowerChartProps) {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Power & Cost Projection: {siteName}</CardTitle>
                <CardDescription>
                    Quarterly IT Power (MW) and Utility Spend ($)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMw" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="quarter" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'MW', position: 'insideLeft', angle: -90, offset: 10 }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Cost ($)', position: 'insideRight', angle: -90, offset: 10 }} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip
                                formatter={(value: any, name: any) => {
                                    const val = Number(value) || 0;
                                    if (name === 'utilityCost') return [`$${Math.round(val).toLocaleString()}`, 'Utility Cost'];
                                    return [`${val.toFixed(2)} MW`, name === 'adjustedPowerMw' ? 'Adj Power' : 'IT Power'];
                                }}
                            />
                            <Legend />
                            <Area type="step" yAxisId="left" dataKey="totalItPowerMw" stroke="#8884d8" fillOpacity={1} fill="url(#colorMw)" name="IT Power" />
                            <Area type="step" yAxisId="left" dataKey="adjustedPowerMw" stroke="#6b66b8" strokeDasharray="5 5" fillOpacity={0} name="Adj Power" />
                            <Area type="monotone" yAxisId="right" dataKey="utilityCost" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCost)" name="Utility Cost" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
