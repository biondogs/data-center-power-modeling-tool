"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLineItem } from "@/lib/actions";
import { CatalogItem, LineItem } from "@prisma/client";
import { Pencil } from "lucide-react";

interface EditLineItemDialogProps {
    lineItem: LineItem & { catalogItem: CatalogItem };
    catalogItems: CatalogItem[];
}

export function EditLineItemDialog({ lineItem, catalogItems }: EditLineItemDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        
        const catalogItemId = formData.get("catalogItemId") as string;
        const quantity = parseInt(formData.get("quantity") as string);
        const startQuarter = formData.get("startQuarter") as string;
        const endQuarter = formData.get("endQuarter") as string;
        const projectTag = formData.get("projectTag") as string;

        try {
            await updateLineItem(lineItem.id, {
                catalogItemId,
                quantity,
                startQuarter,
                endQuarter: endQuarter || null,
                projectTag
            });
            router.refresh();
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update line item");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setOpen(true)}
                aria-label={`Edit ${lineItem.catalogItem.name}`}
            >
                <Pencil className="h-4 w-4" />
            </Button>
            <DialogContent className="sm:max-w-[500px]">
                <form action={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Deployment</DialogTitle>
                        <DialogDescription>
                            Update deployment details for {lineItem.catalogItem.name}.
                        </DialogDescription>
                    </DialogHeader>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4" role="alert">
                            {error}
                        </div>
                    )}
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Equipment</Label>
                            <Select name="catalogItemId" defaultValue={lineItem.catalogItemId} required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {catalogItems.map(c => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name} ({c.powerKw} kW)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-quantity" className="text-right">Units</Label>
                            <Input 
                                id="edit-quantity" 
                                name="quantity" 
                                type="number" 
                                className="col-span-3" 
                                defaultValue={lineItem.quantity} 
                                required 
                                min={1} 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-startQuarter" className="text-right">Start Q</Label>
                            <Input 
                                id="edit-startQuarter" 
                                name="startQuarter" 
                                className="col-span-3" 
                                defaultValue={lineItem.startQuarter}
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-endQuarter" className="text-right">End Q</Label>
                            <Input 
                                id="edit-endQuarter" 
                                name="endQuarter" 
                                className="col-span-3" 
                                defaultValue={lineItem.endQuarter || ""}
                                placeholder="Optional (e.g. 2028Q2)" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-projectTag" className="text-right">Tag</Label>
                            <Input 
                                id="edit-projectTag" 
                                name="projectTag" 
                                className="col-span-3" 
                                defaultValue={lineItem.projectTag || ""}
                                placeholder="Project Name" 
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
