"use client";

import { CatalogItem } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteCatalogItem } from "@/lib/actions";
import { CatalogDialog } from "./CatalogDialog";
import { useState } from "react";

interface CatalogTableProps {
    items: CatalogItem[];
}

export function CatalogTable({ items }: CatalogTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function onDelete(id: string) {
        if (!confirm("Are you sure? This will fail if the item is used in any scenario.")) return;

        setDeletingId(id);
        try {
            await deleteCatalogItem(id);
        } catch (e) {
            alert("Could not delete item. It might be in use.");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead className="text-right">Power (kW)</TableHead>
                        <TableHead className="text-right">Cost ($)</TableHead>
                        <TableHead className="text-right">Capacity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.vendor || "-"}</TableCell>
                            <TableCell className="text-right">{item.powerKw}</TableCell>
                            <TableCell className="text-right">${item.cost.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                                {item.capacityVal} {item.capacityType}
                            </TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                <CatalogDialog item={item} />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    disabled={deletingId === item.id}
                                    onClick={() => onDelete(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
