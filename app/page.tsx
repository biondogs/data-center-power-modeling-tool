import Link from "next/link";
import { getScenarios } from "@/lib/services/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowRight, FileSpreadsheet } from "lucide-react";
import { CreateScenarioDialog } from "@/components/scenario/CreateScenarioDialog";

export const dynamic = "force-dynamic"; // Ensure fresh data

export default async function DashboardPage() {
  const scenarios = await getScenarios();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-2">
            Manage your power and capacity planning scenarios.
          </p>
        </div>
        <CreateScenarioDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create Card (Visual Shortcut) */}
        <Card className="flex flex-col justify-center items-center border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer bg-muted/50 hover:bg-muted">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-background p-3 mb-4 shadow-sm">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">Create Scenario</h3>
            <p className="text-sm text-muted-foreground mt-1">Start a new plan from scratch or clone existing</p>
          </CardContent>
        </Card>

        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="flex flex-col">
            <CardHeader>
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
                  <span>Last Updated:</span>
                  <span className="font-medium text-foreground">
                    {new Date(scenario.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link href={`/scenarios/${scenario.id}`}>
                  Open Scenario <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
