"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteScenario } from "@/lib/actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeleteScenarioButtonProps {
    scenarioId: string;
    scenarioName: string;
    isBase?: boolean;
    onDelete?: () => void;
}

export function DeleteScenarioButton({ 
    scenarioId, 
    scenarioName, 
    isBase = false,
    onDelete 
}: DeleteScenarioButtonProps) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDelete() {
        setError(null);
        setIsDeleting(true);
        const result = await deleteScenario(scenarioId);
        setIsDeleting(false);

        if (!result?.success) setError(result?.error || 'Failed');

        if (result.success) {
            setOpen(false);
            onDelete?.();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon"
                    aria-label={`Delete ${scenarioName}`}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Scenario</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete &quot;{scenarioName}&quot;? 
                        {isBase && (
                            <span className="block mt-2 text-amber-600 font-medium">
                                This is a baseline scenario. Deleting it will remove it permanently.
                            </span>
                        )}
                        <span className="block mt-2">
                            This action cannot be undone. All associated sites, line items, and data will be permanently deleted.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
