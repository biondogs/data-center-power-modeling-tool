"use client";

import { useState } from "react";
import Link from "next/link";
import { CatalogItem } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Settings, X, AlertTriangle } from "lucide-react";
import { deleteCatalogItems } from "@/lib/actions";
import { CatalogDialog } from "./CatalogDialog";

interface CatalogListProps {
  initialItems: CatalogItem[];
}

export function CatalogList({ initialItems }: CatalogListProps) {
  const [items, setItems] = useState<CatalogItem[]>(initialItems);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{
    success: boolean;
    deletedCount: number;
    failedCount: number;
    errors: string[];
  } | null>(null);

  const handleToggleManage = () => {
    setIsManageMode(!isManageMode);
    setSelectedIds(new Set());
  };

  const handleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleCancelManage = () => {
    setIsManageMode(false);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    const idsToDelete = Array.from(selectedIds);
    const result = await deleteCatalogItems(idsToDelete);
    setIsDeleting(false);
    setDeleteResult(result);

    if (result.success) {
      setItems(items.filter((i) => !selectedIds.has(i.id)));
      setSelectedIds(new Set());
    }
  };

  const handleCloseResultDialog = () => {
    setDeleteResult(null);
    if (deleteResult?.success) {
      setIsDeleteDialogOpen(false);
      setIsManageMode(false);
    }
  };

  const allSelected = selectedIds.size === items.length && items.length > 0;
  const selectedItems = items.filter((i) => selectedIds.has(i.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Equipment Catalog</h2>
          <p className="text-muted-foreground mt-2">
            Manage the hardware library used in your scenarios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isManageMode ? (
            <>
              <Button variant="outline" onClick={handleToggleManage}>
                <Settings className="mr-2 h-4 w-4" /> Manage
              </Button>
              <CatalogDialog />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-4">
                <Checkbox
                  id="select-all-catalog"
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
                <label
                  htmlFor="select-all-catalog"
                  className="text-sm font-medium cursor-pointer"
                >
                  Select All
                </label>
              </div>
              <Button variant="outline" onClick={handleCancelManage}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {isManageMode && (
                <TableHead className="w-12">
                  <span className="sr-only">Select</span>
                </TableHead>
              )}
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Power (kW)</TableHead>
              <TableHead className="text-right">Cost ($)</TableHead>
              <TableHead className="text-right">Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {isManageMode && (
                  <TableCell>
                    <Checkbox
                      id={`checkbox-${item.id}`}
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => handleSelectItem(item.id)}
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.vendor || "-"}</TableCell>
                <TableCell>{item.model || "-"}</TableCell>
                <TableCell className="text-right">{item.powerKw}</TableCell>
                <TableCell className="text-right">
                  ${item.cost.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {item.capacityVal} {item.capacityType}
                </TableCell>
                <TableCell className="text-right">
                  {!isManageMode && (
                    <div className="flex justify-end gap-2">
                      <CatalogDialog item={item} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        asChild
                      >
                        <Link href={`/catalog/${item.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isManageMode && selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-card border rounded-lg shadow-lg px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">
                {selectedIds.size} selected
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCancelManage}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={selectedIds.size === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete {selectedIds.size} Item
                  {selectedIds.size !== 1 ? "s" : ""}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Catalog Items</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the following{" "}
              {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""}?
              <ul className="mt-4 space-y-1 max-h-40 overflow-y-auto border rounded-md p-3">
                {selectedItems.map((item) => (
                  <li key={item.id} className="text-sm font-medium">
                    • {item.name}
                  </li>
                ))}
              </ul>
              <span className="block mt-4 text-amber-600">
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                Items that are in use by scenarios cannot be deleted.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : `Delete ${selectedIds.size} Item${selectedIds.size !== 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteResult} onOpenChange={handleCloseResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteResult?.success ? "Delete Complete" : "Delete Partial"}
            </DialogTitle>
            <DialogDescription>
              {deleteResult && (
                <>
                  <div className="mb-4">
                    <span className="font-medium">
                      {deleteResult.deletedCount} item
                      {deleteResult.deletedCount !== 1 ? "s" : ""} deleted
                    </span>
                    {deleteResult.failedCount > 0 && (
                      <span className="text-destructive ml-2">
                        ({deleteResult.failedCount} failed)
                      </span>
                    )}
                  </div>
                  {deleteResult.errors.length > 0 && (
                    <div className="mt-4 border rounded-md p-3 bg-muted">
                      <p className="text-sm font-medium mb-2">Errors:</p>
                      <ul className="text-sm text-destructive space-y-1 max-h-32 overflow-y-auto">
                          {deleteResult.errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseResultDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
