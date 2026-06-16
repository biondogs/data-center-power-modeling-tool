"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCatalogItem, updateCatalogItem } from "@/lib/actions";
import { Plus, Pencil } from "lucide-react";
import { CatalogItem } from "@prisma/client";

interface CatalogDialogProps {
    item?: CatalogItem; // If provided, Edit mode
    triggerLabel?: string;
}

export function CatalogDialog({ item, triggerLabel }: CatalogDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isEdit = !!item;

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            vendor: formData.get("vendor") as string,
            model: formData.get("model") as string,
            powerKw: parseFloat(formData.get("powerKw") as string),
            cost: parseFloat(formData.get("cost") as string),
            capacityType: formData.get("capacityType") as string,
            capacityVal: parseFloat(formData.get("capacityVal") as string) || 0
        };

        if (isEdit && item) {
            const result = await updateCatalogItem(item.id, data);
            if (!result?.success) {
                setError(result?.error || 'Failed to update item.');
                setLoading(false);
                return;
            }
        } else {
            const result = await createCatalogItem(data);
            if (!result?.success) {
                setError(result?.error || 'Failed to create item.');
                setLoading(false);
                return;
            }
        }
        setOpen(false);
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEdit ? (
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> {triggerLabel || "New Item"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Edit Item" : "New Catalog Item"}</DialogTitle>
                        <DialogDescription>
                            Define equipment specifications.
                        </DialogDescription>
                    </DialogHeader>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" className="col-span-3" defaultValue={item?.name} required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Category</Label>
                            <Select name="category" defaultValue={item?.category || "GPU"}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GPU">GPU</SelectItem>
                                    <SelectItem value="CPU">CPU</SelectItem>
                                    <SelectItem value="Storage">Storage</SelectItem>
                                    <SelectItem value="Network">Network</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="vendor" className="text-right">Vendor</Label>
                            <Input id="vendor" name="vendor" className="col-span-3" defaultValue={item?.vendor || ""} placeholder="e.g. SMC, Lenovo, Dell" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="model" className="text-right">Model</Label>
                            <Input id="model" name="model" className="col-span-3" defaultValue={item?.model || ""} placeholder="e.g. H100, A100, NVL72" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="powerKw" className="text-right">Power (kW)</Label>
                            <Input id="powerKw" name="powerKw" type="number" step="0.1" className="col-span-3" defaultValue={item?.powerKw} required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cost" className="text-right">Cost ($)</Label>
                            <Input id="cost" name="cost" type="number" className="col-span-3" defaultValue={item?.cost} required />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Capacity</Label>
                            <div className="col-span-3 flex gap-2">
                                <Input name="capacityType" placeholder="Type (e.g. GPU)" defaultValue={item?.capacityType || ""} className="w-1/2" />
                                <Input name="capacityVal" type="number" placeholder="Value" defaultValue={item?.capacityVal || ""} className="w-1/2" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
