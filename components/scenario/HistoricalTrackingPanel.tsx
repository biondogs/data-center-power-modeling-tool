"use client";

import { useState } from "react";
import { LineItem, CatalogItem } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { History, Edit2, AlertCircle, CheckCircle2 } from "lucide-react";

type LineItemWithCatalog = LineItem & { catalogItem: CatalogItem };

interface HistoricalTrackingPanelProps {
  lineItems: LineItemWithCatalog[];
  onUpdate: (lineItemId: string, data: {
    actualStartQuarter?: string;
    actualEndQuarter?: string;
    actualQuantity?: number;
    varianceNotes?: string;
  }) => void;
}

interface VarianceStatus {
  status: "on-track" | "variance" | "unknown";
  message: string;
}

function calculateVarianceStatus(item: LineItemWithCatalog): VarianceStatus {
  if (!item.actualStartQuarter && !item.actualQuantity) {
    return { status: "unknown", message: "No actuals recorded" };
  }

  const hasStartVariance = item.actualStartQuarter && item.actualStartQuarter !== item.startQuarter;
  const hasQuantityVariance = item.actualQuantity && item.actualQuantity !== item.quantity;

  if (hasStartVariance || hasQuantityVariance) {
    const parts: string[] = [];
    if (hasStartVariance) parts.push("start date");
    if (hasQuantityVariance) parts.push("quantity");
    return { status: "variance", message: `Variance in: ${parts.join(", ")}` };
  }

  return { status: "on-track", message: "On track with plan" };
}

export function HistoricalTrackingPanel({ lineItems, onUpdate }: HistoricalTrackingPanelProps) {
  const [editingItem, setEditingItem] = useState<LineItemWithCatalog | null>(null);

  const itemsWithVariance = lineItems.filter((item) => {
    const status = calculateVarianceStatus(item);
    return status.status === "variance";
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lineItems.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              With Actuals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lineItems.filter((i) => i.actualStartQuarter || i.actualQuantity).length}
            </div>
          </CardContent>
        </Card>

        <Card className={`${itemsWithVariance.length > 0 ? "bg-red-50" : "bg-green-50"}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {itemsWithVariance.length > 0 ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              Variances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${itemsWithVariance.length > 0 ? "text-red-600" : "text-green-600"}`}>
              {itemsWithVariance.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Deployment Actuals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Planned</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item) => {
                const variance = calculateVarianceStatus(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.catalogItem.name}
                    </TableCell>
                    <TableCell>
                      {item.projectTag ? (
                        <Badge variant="secondary">{item.projectTag}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <div>Qty: {item.quantity}</div>
                      <div className="text-muted-foreground">{item.startQuarter}</div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <div>{item.actualQuantity ?? "-"}</div>
                      <div className="text-muted-foreground">
                        {item.actualStartQuarter ?? "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          variance.status === "on-track"
                            ? "default"
                            : variance.status === "variance"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {variance.status === "on-track" ? "On Track" : variance.status === "variance" ? "Variance" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {item.varianceNotes || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Update Actuals</DialogTitle>
                          </DialogHeader>
                          {editingItem?.id === item.id && (
                            <EditActualsForm
                              item={item}
                              onSave={(data) => {
                                onUpdate(item.id, data);
                                setEditingItem(null);
                              }}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
              {lineItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No line items to track
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function EditActualsForm({
  item,
  onSave,
}: {
  item: LineItemWithCatalog;
  onSave: (data: {
    actualStartQuarter?: string;
    actualEndQuarter?: string;
    actualQuantity?: number;
    varianceNotes?: string;
  }) => void;
}) {
  const [formData, setFormData] = useState({
    actualStartQuarter: item.actualStartQuarter || "",
    actualEndQuarter: item.actualEndQuarter || "",
    actualQuantity: item.actualQuantity?.toString() || "",
    varianceNotes: item.varianceNotes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      actualStartQuarter: formData.actualStartQuarter || undefined,
      actualEndQuarter: formData.actualEndQuarter || undefined,
      actualQuantity: formData.actualQuantity ? parseInt(formData.actualQuantity) : undefined,
      varianceNotes: formData.varianceNotes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="actualStart">Actual Start Quarter</Label>
          <Input
            id="actualStart"
            placeholder="2024Q1"
            value={formData.actualStartQuarter}
            onChange={(e) =>
              setFormData({ ...formData, actualStartQuarter: e.target.value })
            }
          />
          <p className="text-xs text-muted-foreground">
            Planned: {item.startQuarter}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="actualEnd">Actual End Quarter</Label>
          <Input
            id="actualEnd"
            placeholder="2024Q4"
            value={formData.actualEndQuarter}
            onChange={(e) =>
              setFormData({ ...formData, actualEndQuarter: e.target.value })
            }
          />
          <p className="text-xs text-muted-foreground">
            Planned: {item.endQuarter || "Indefinite"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="actualQuantity">Actual Quantity Deployed</Label>
        <Input
          id="actualQuantity"
          type="number"
          placeholder={item.quantity.toString()}
          value={formData.actualQuantity}
          onChange={(e) =>
            setFormData({ ...formData, actualQuantity: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground">
          Planned: {item.quantity} {item.catalogItem.name}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Variance Notes</Label>
        <Textarea
          id="notes"
          placeholder="Explain any variances from the planned deployment..."
          value={formData.varianceNotes}
          onChange={(e) =>
            setFormData({ ...formData, varianceNotes: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit">Save Actuals</Button>
      </div>
    </form>
  );
}
