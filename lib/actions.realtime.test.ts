import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addLineItem, updateLineItem, deleteLineItem, createCatalogItem, updateCatalogItem, deleteCatalogItem } from './actions';
import { prisma } from './db';
import { revalidatePath } from 'next/cache';

vi.mock('./db', () => ({
    prisma: {
        lineItem: {
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            findUnique: vi.fn(),
        },
        site: {
            findUnique: vi.fn(),
        },
        catalogItem: {
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    }
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}));

describe('Real-time Updates', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Line Item CRUD operations', () => {
        it('should revalidate scenario path after adding line item', async () => {
            const mockSite = { id: 'site-1', scenarioId: 'scenario-1' };
            vi.mocked(prisma.lineItem.create).mockResolvedValue({ id: 'line-1' } as any);
            vi.mocked(prisma.site.findUnique).mockResolvedValue(mockSite as any);

            await addLineItem('site-1', {
                catalogItemId: 'catalog-1',
                quantity: 5,
                startQuarter: '2024-Q1',
                endQuarter: '2024-Q4',
                projectTag: 'Test-Project'
            });

            expect(revalidatePath).toHaveBeenCalledWith('/scenarios/scenario-1');
        });

        it('should revalidate scenario path after updating line item', async () => {
            const mockItem = { id: 'line-1', siteId: 'site-1' };
            const mockSite = { id: 'site-1', scenarioId: 'scenario-1' };
            vi.mocked(prisma.lineItem.findUnique).mockResolvedValue(mockItem as any);
            vi.mocked(prisma.lineItem.update).mockResolvedValue({ id: 'line-1' } as any);
            vi.mocked(prisma.site.findUnique).mockResolvedValue(mockSite as any);

            await updateLineItem('line-1', { quantity: 10 });

            expect(revalidatePath).toHaveBeenCalledWith('/scenarios/scenario-1');
        });

        it('should revalidate scenario path after deleting line item', async () => {
            const mockItem = { id: 'line-1', siteId: 'site-1' };
            const mockSite = { id: 'site-1', scenarioId: 'scenario-1' };
            vi.mocked(prisma.lineItem.findUnique).mockResolvedValue(mockItem as any);
            vi.mocked(prisma.site.findUnique).mockResolvedValue(mockSite as any);
            vi.mocked(prisma.lineItem.delete).mockResolvedValue({} as any);

            await deleteLineItem('line-1');

            expect(revalidatePath).toHaveBeenCalledWith('/scenarios/scenario-1');
        });

        it('should not revalidate if site not found after adding line item', async () => {
            vi.mocked(prisma.lineItem.create).mockResolvedValue({ id: 'line-1' } as any);
            vi.mocked(prisma.site.findUnique).mockResolvedValue(null);

            await addLineItem('site-1', {
                catalogItemId: 'catalog-1',
                quantity: 5,
                startQuarter: '2024-Q1',
            });

            expect(revalidatePath).not.toHaveBeenCalled();
        });

        it('should throw error when updating non-existent line item', async () => {
            vi.mocked(prisma.lineItem.findUnique).mockResolvedValue(null);

            await expect(updateLineItem('non-existent', { quantity: 10 }))
                .rejects.toThrow('Line item not found');
        });
    });

    describe('Catalog CRUD operations', () => {
        it('should revalidate catalog and dashboard paths after creating catalog item', async () => {
            vi.mocked(prisma.catalogItem.create).mockResolvedValue({ id: 'catalog-1' } as any);

            await createCatalogItem({
                name: 'Test GPU',
                category: 'GPU',
                powerKw: 10,
                cost: 100000
            });

            expect(revalidatePath).toHaveBeenCalledWith('/catalog');
            expect(revalidatePath).toHaveBeenCalledWith('/');
        });

        it('should revalidate catalog path after updating catalog item', async () => {
            vi.mocked(prisma.catalogItem.update).mockResolvedValue({ id: 'catalog-1' } as any);

            await updateCatalogItem('catalog-1', {
                name: 'Updated Name',
                category: 'GPU',
                powerKw: 10,
                cost: 100000
            });

            expect(revalidatePath).toHaveBeenCalledWith('/catalog');
        });

        it('should revalidate catalog path after deleting catalog item', async () => {
            vi.mocked(prisma.catalogItem.delete).mockResolvedValue({ id: 'catalog-1' } as any);

            await deleteCatalogItem('catalog-1');

            expect(revalidatePath).toHaveBeenCalledWith('/catalog');
        });
    });
});
