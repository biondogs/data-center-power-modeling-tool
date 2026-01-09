import { notFound } from "next/navigation";
import { getScenarioById, getCatalogItems } from "@/lib/services/data";
import { ScenarioView } from "@/components/scenario/ScenarioView";
import { Aggregator, SiteProjection } from "@/lib/engine/aggregator";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ScenarioPage({ params }: PageProps) {
    const { id } = await params;
    const scenario = await getScenarioById(id);
    const catalogItems = await getCatalogItems();

    if (!scenario) {
        notFound();
    }

    // Calculate Projections Server-Side
    // Horizon hardcoded for now or fetch from scenario settings?
    const horizon = { horizonStart: "2024Q1", horizonEnd: "2026Q4" };

    const projections: Record<string, SiteProjection[]> = {};
    const siteNames: Record<string, string> = {};

    for (const site of scenario.sites) {
        siteNames[site.id] = site.name;
        // Need to cast site.lineItems because of deep types from Prisma includes
        // The Aggregator expects LineItem & { catalogItem }. 
        // getScenarioById includes it, so we are safe at runtime.
        // @ts-ignore
        projections[site.id] = Aggregator.aggregateSite(site, scenario.assumptions, horizon);
    }

    return <ScenarioView scenario={scenario} catalogItems={catalogItems} projections={projections} siteNames={siteNames} />;
}
