"use client";

import { Site, LineItem, CatalogItem } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddLineItemDialog } from "./AddLineItemDialog";

interface SitePlanEditorProps {
    site: Site & {
        lineItems: (LineItem & { catalogItem: CatalogItem })[];
    };
    catalogItems: CatalogItem[];
}

export function SitePlanEditor({ site, catalogItems }: SitePlanEditorProps) {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg">Deployment Plan: {site.name}</CardTitle>
                <AddLineItemDialog siteId={site.id} catalogItems={catalogItems} />
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="h-10 px-4 text-left font-medium">Equipment</th>
                                <th className="h-10 px-4 text-left font-medium">Tag</th>
                                <th className="h-10 px-4 text-left font-medium">Start</th>
                                <th className="h-10 px-4 text-left font-medium">End/Life</th>
                                <th className="h-10 px-4 text-right font-medium">Qty</th>
                                <th className="h-10 px-4 text-right font-medium">MW</th>
                            </tr>
                        </thead>
                        <tbody>
                            {site.lineItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No deployment items yet.
                                    </td>
                                </tr>
                            ) : (
                                site.lineItems.map(item => (
                                    <tr key={item.id} className="border-t hover:bg-muted/50">
                                        <td className="p-4 font-medium">{item.catalogItem.name}</td>
                                        <td className="p-4 text-muted-foreground">{item.projectTag || "-"}</td>
                                        <td className="p-4">{item.startQuarter}</td>
                                        <td className="p-4">{item.endQuarter || "Indefinite"}</td>
                                        <td className="p-4 text-right">{item.quantity}</td>
                                        <td className="p-4 text-right transform-gpu">
                                            {((item.quantity * item.catalogItem.powerKw) / 1000).toFixed(2)} MW
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
