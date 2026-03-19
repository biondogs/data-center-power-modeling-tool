import { prisma } from "@/lib/db";
import { CatalogList } from "@/components/catalog/CatalogList";

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
            <CatalogList initialItems={items} />
        </div>
    );
}
