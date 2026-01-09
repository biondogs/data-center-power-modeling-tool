"use client";

import { useState } from "react";
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
import { addLineItem } from "@/lib/actions";
import { Plus } from "lucide-react";
import { CatalogItem } from "@prisma/client";

interface AddLineItemDialogProps {
    siteId: string;
    catalogItems: CatalogItem[];
}

export function AddLineItemDialog({ siteId, catalogItems }: AddLineItemDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function onSubmit(formData: FormData) {
        setLoading(true);
        const catalogItemId = formData.get("catalogItemId") as string;
        const quantity = parseInt(formData.get("quantity") as string);
        const startQuarter = formData.get("startQuarter") as string;
        const endQuarter = formData.get("endQuarter") as string || undefined;
        const projectTag = formData.get("projectTag") as string || "";

        await addLineItem(siteId, {
            catalogItemId,
            quantity,
            startQuarter,
            endQuarter,
            projectTag
        });
        setLoading(false);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Line Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form action={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Deployment</DialogTitle>
                        <DialogDescription>
                            Schedule equipment deployment for this site.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Equipment</Label>
                            <Select name="catalogItemId" required>
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
                            <Label htmlFor="quantity" className="text-right">Units</Label>
                            <Input id="quantity" name="quantity" type="number" className="col-span-3" defaultValue={1} required min={1} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startQuarter" className="text-right">Start Q</Label>
                            <Input id="startQuarter" name="startQuarter" className="col-span-3" placeholder="2024Q2" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endQuarter" className="text-right">End Q</Label>
                            <Input id="endQuarter" name="endQuarter" className="col-span-3" placeholder="Optional (e.g. 2028Q2)" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="projectTag" className="text-right">Tag</Label>
                            <Input id="projectTag" name="projectTag" className="col-span-3" placeholder="Project Name" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Item"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
