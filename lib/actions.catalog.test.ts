import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteCatalogItems } from './actions';
import { prisma } from './db';

// Mock prisma
vi.mock('./db', () => ({
    prisma: {
        catalogItem: {
            findUnique: vi.fn(),
            delete: vi.fn(),
        },
        lineItem: {
            findMany: vi.fn(),
        },
    }
}));

// Mock next/cache
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}));

describe('Catalog Bulk Delete Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('deleteCatalogItems', () => {
        it('should delete multiple catalog items successfully', async () => {
            const item1 = { id: '1', name: 'H100-8', lineItems: [] };
            const item2 = { id: '2', name: 'H200-8', lineItems: [] };

            vi.mocked(prisma.catalogItem.findUnique)
                .mockResolvedValueOnce(item1 as any)
                .mockResolvedValueOnce(item2 as any);

            vi.mocked(prisma.catalogItem.delete).mockResolvedValue({} as any);

            const result = await deleteCatalogItems(['1', '2']);

            expect(result.success).toBe(true);
            expect(result.deletedCount).toBe(2);
            expect(result.failedCount).toBe(0);
            expect(result.errors).toHaveLength(0);
            expect(prisma.catalogItem.delete).toHaveBeenCalledTimes(2);
        });

        it('should skip items that are in use by line items', async () => {
            const itemInUse = { id: '1', name: 'H100-8', lineItems: [{ id: 'li1' }] };
            const itemNotInUse = { id: '2', name: 'H200-8', lineItems: [] };

            vi.mocked(prisma.catalogItem.findUnique)
                .mockResolvedValueOnce(itemInUse as any)
                .mockResolvedValueOnce(itemNotInUse as any);

            vi.mocked(prisma.catalogItem.delete).mockResolvedValue({} as any);

            const result = await deleteCatalogItems(['1', '2']);

            expect(result.success).toBe(true);
            expect(result.deletedCount).toBe(1);
            expect(result.failedCount).toBe(1);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0]).toContain('H100-8');
            expect(result.errors[0]).toContain('in use');
            expect(prisma.catalogItem.delete).toHaveBeenCalledTimes(1);
            expect(prisma.catalogItem.delete).toHaveBeenCalledWith({ where: { id: '2' } });
        });

        it('should handle non-existent items', async () => {
            vi.mocked(prisma.catalogItem.findUnique).mockResolvedValue(null);

            const result = await deleteCatalogItems(['non-existent-id']);

            expect(result.success).toBe(false);
            expect(result.deletedCount).toBe(0);
            expect(result.failedCount).toBe(1);
            expect(result.errors[0]).toContain('not found');
            expect(prisma.catalogItem.delete).not.toHaveBeenCalled();
        });

        it('should handle mixed success and failure scenarios', async () => {
            const itemNotFound = null;
            const itemInUse = { id: '2', name: 'GPU-A100', lineItems: [{ id: 'li1' }, { id: 'li2' }] };
            const itemValid = { id: '3', name: 'CPU-Xeon', lineItems: [] };

            vi.mocked(prisma.catalogItem.findUnique)
                .mockResolvedValueOnce(itemNotFound as any)
                .mockResolvedValueOnce(itemInUse as any)
                .mockResolvedValueOnce(itemValid as any);

            vi.mocked(prisma.catalogItem.delete).mockResolvedValue({} as any);

            const result = await deleteCatalogItems(['1', '2', '3']);

            expect(result.success).toBe(true);
            expect(result.deletedCount).toBe(1);
            expect(result.failedCount).toBe(2);
            expect(result.errors).toHaveLength(2);
            expect(result.errors[0]).toContain('not found');
            expect(result.errors[1]).toContain('GPU-A100');
            expect(result.errors[1]).toContain('2 line item(s)');
        });

        it('should handle database errors gracefully', async () => {
            const item = { id: '1', name: 'Test GPU', lineItems: [] };

            vi.mocked(prisma.catalogItem.findUnique).mockResolvedValue(item as any);
            vi.mocked(prisma.catalogItem.delete).mockRejectedValue(new Error('Database error'));

            const result = await deleteCatalogItems(['1']);

            expect(result.success).toBe(false);
            expect(result.deletedCount).toBe(0);
            expect(result.failedCount).toBe(1);
            expect(result.errors[0]).toContain('Failed to delete');
        });

        it('should handle empty array', async () => {
            const result = await deleteCatalogItems([]);

            expect(result.success).toBe(false);
            expect(result.deletedCount).toBe(0);
            expect(result.failedCount).toBe(0);
            expect(result.errors).toHaveLength(0);
            expect(prisma.catalogItem.findUnique).not.toHaveBeenCalled();
        });

        it('should revalidate catalog path after deletion', async () => {
            const item = { id: '1', name: 'H100-8', lineItems: [] };
            const { revalidatePath } = await import('next/cache');

            vi.mocked(prisma.catalogItem.findUnique).mockResolvedValue(item as any);
            vi.mocked(prisma.catalogItem.delete).mockResolvedValue({} as any);

            await deleteCatalogItems(['1']);

            expect(revalidatePath).toHaveBeenCalledWith('/catalog');
        });

        it('should process items sequentially to avoid race conditions', async () => {
            const items = [
                { id: '1', name: 'Item 1', lineItems: [] },
                { id: '2', name: 'Item 2', lineItems: [] },
                { id: '3', name: 'Item 3', lineItems: [] }
            ];

            vi.mocked(prisma.catalogItem.findUnique)
                .mockResolvedValueOnce(items[0] as any)
                .mockResolvedValueOnce(items[1] as any)
                .mockResolvedValueOnce(items[2] as any);

            vi.mocked(prisma.catalogItem.delete).mockResolvedValue({} as any);

            await deleteCatalogItems(['1', '2', '3']);

            // Verify each findUnique was called with correct ID in sequence
            expect(prisma.catalogItem.findUnique).toHaveBeenNthCalledWith(1, {
                where: { id: '1' },
                include: { lineItems: true }
            });
            expect(prisma.catalogItem.findUnique).toHaveBeenNthCalledWith(2, {
                where: { id: '2' },
                include: { lineItems: true }
            });
            expect(prisma.catalogItem.findUnique).toHaveBeenNthCalledWith(3, {
                where: { id: '3' },
                include: { lineItems: true }
            });
        });

        it('should return correct error message with multiple line item references', async () => {
            const item = {
                id: '1',
                name: 'H100 Cluster',
                lineItems: [{ id: 'li1' }, { id: 'li2' }, { id: 'li3' }]
            };

            vi.mocked(prisma.catalogItem.findUnique).mockResolvedValue(item as any);

            const result = await deleteCatalogItems(['1']);

            expect(result.errors[0]).toContain('3 line item(s)');
        });
    });
});
