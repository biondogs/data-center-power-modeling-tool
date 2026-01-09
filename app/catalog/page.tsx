import { prisma } from "@/lib/db";
import { CatalogTable } from "@/components/catalog/CatalogTable";
import { CatalogDialog } from "@/components/catalog/CatalogDialog";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
    const items = await prisma.catalogItem.findMany({
        orderBy: [
            { category: 'asc' },
            { name: 'asc' }
        ]
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Equipment Catalog</h2>
                    <p className="text-muted-foreground mt-2">
                        Manage the hardware library used in your scenarios.
                    </p>
                </div>
                <CatalogDialog />
            </div>

            <CatalogTable items={items} />
        </div>
    );
}
