"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ArrowRight, FileSpreadsheet, Trash2, Settings, X } from "lucide-react";
import { DeleteScenarioButton } from "@/components/scenario/DeleteScenarioButton";
import { deleteScenarios } from "@/lib/actions";
import { CreateScenarioDialog } from "./CreateScenarioDialog";

interface Scenario {
  id: string;
  name: string;
  description: string | null;
  isBase: boolean;
  horizonStart: string;
  horizonEnd: string;
  updatedAt: Date;
  _count: { sites: number };
}

interface ScenariosListProps {
  initialScenarios: Scenario[];
}

export function ScenariosList({ initialScenarios }: ScenariosListProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleManage = () => {
    setIsManageMode(!isManageMode);
    setSelectedIds(new Set());
  };

  const handleSelectAll = () => {
    if (selectedIds.size === scenarios.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(scenarios.map(s => s.id)));
    }
  };

  const handleSelectScenario = (id: string) => {
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
    const result = await deleteScenarios(idsToDelete);
    setIsDeleting(false);

    if (result.success) {
      setScenarios(scenarios.filter(s => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
      setIsDeleteDialogOpen(false);
      setIsManageMode(false);
    } else {
      console.error("Failed to delete scenarios:", result.error);
    }
  };

  const handleIndividualDelete = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const selectedScenarios = scenarios.filter(s => selectedIds.has(s.id));
  const allSelected = selectedIds.size === scenarios.length && scenarios.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scenarios</h2>
          <p className="text-muted-foreground mt-2">
            Manage, edit, and delete your power and capacity planning scenarios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isManageMode ? (
            <>
              <Button variant="outline" onClick={handleToggleManage}>
                <Settings className="mr-2 h-4 w-4" /> Manage
              </Button>
              <CreateScenarioDialog />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-4">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total Scenarios</div>
            <div className="text-3xl font-bold mt-1">{scenarios.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Baseline Scenarios</div>
            <div className="text-3xl font-bold mt-1">{scenarios.filter(s => s.isBase).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Custom Scenarios</div>
            <div className="text-3xl font-bold mt-1">{scenarios.filter(s => !s.isBase).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total Sites</div>
            <div className="text-3xl font-bold mt-1">
              {scenarios.reduce((sum, s) => sum + s._count.sites, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!isManageMode && (
          <Card className="flex flex-col justify-center items-center border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer bg-muted/50 hover:bg-muted">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-background p-3 mb-4 shadow-sm">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">Create Scenario</h3>
              <p className="text-sm text-muted-foreground mt-1">Start a new plan from scratch or clone existing</p>
            </CardContent>
          </Card>
        )}

        {scenarios.map((scenario) => (
          <Card key={scenario.id} className={`flex flex-col relative ${isManageMode ? 'border-2' : ''}`}>
            {isManageMode && (
              <div className="absolute top-4 left-4 z-10">
                <Checkbox
                  id={`checkbox-${scenario.id}`}
                  checked={selectedIds.has(scenario.id)}
                  onCheckedChange={() => handleSelectScenario(scenario.id)}
                />
              </div>
            )}
            <CardHeader className={isManageMode ? 'pt-12' : ''}>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-primary/10 rounded-md">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                </div>
                {scenario.isBase && (
                  <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    Baseline
                  </span>
                )}
              </div>
              <CardTitle className="text-xl">{scenario.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                {scenario.description || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Sites Configured:</span>
                  <span className="font-medium text-foreground">{scenario._count.sites}</span>
                </div>
                <div className="flex justify-between">
                  <span>Horizon:</span>
                  <span className="font-medium text-foreground">
                    {scenario.horizonStart} - {scenario.horizonEnd}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-medium text-foreground">
                    {new Date(scenario.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
            {!isManageMode && (
              <CardFooter className="flex gap-2">
                <Button asChild className="flex-1" variant="outline">
                  <Link href={`/scenarios/${scenario.id}`}>
                    Open <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!scenario.isBase && (
                  <DeleteScenarioButton
                    scenarioId={scenario.id}
                    scenarioName={scenario.name}
                    onDelete={() => handleIndividualDelete(scenario.id)}
                  />
                )}
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      {isManageMode && selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Card className="shadow-lg border-2">
            <CardContent className="flex items-center gap-4 py-4 px-6">
              <div className="text-sm font-medium">
                {selectedIds.size} selected
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancelManage}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={selectedIds.size === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete {selectedIds.size} Scenario{selectedIds.size !== 1 ? 's' : ''}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scenarios</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the following {selectedIds.size} scenario{selectedIds.size !== 1 ? 's' : ''}?
              <ul className="mt-4 space-y-1 max-h-40 overflow-y-auto border rounded-md p-3">
                {selectedScenarios.map(s => (
                  <li key={s.id} className="text-sm font-medium">
                    • {s.name}
                  </li>
                ))}
              </ul>
              <span className="block mt-4">
                This action cannot be undone. All associated sites, line items, and data will be permanently deleted.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : `Delete ${selectedIds.size} Scenario${selectedIds.size !== 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
