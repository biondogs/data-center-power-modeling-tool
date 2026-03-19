import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportScenario, exportAllScenarios } from './actions';
import { prisma } from './db';

// Mock prisma
vi.mock('./db', () => ({
    prisma: {
        scenario: {
            findUnique: vi.fn(),
            findMany: vi.fn(),
        },
        lineItem: {
            findMany: vi.fn(),
        },
        catalogItem: {
            findMany: vi.fn(),
        },
    }
}));

describe('Export Functionality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('exportScenario', () => {
        const mockScenario = {
            id: 'scenario-1',
            name: 'Test Scenario',
            description: 'A test scenario',
            horizonStart: '2024-Q1',
            horizonEnd: '2024-Q4',
            isBase: false,
            sites: [
                {
                    id: 'site-1',
                    name: 'Test Site',
                    totalItCapacityMw: 10,
                    electricalCapacityMw: 12,
                    electricityRatePerKwh: 0.10,
                    inflationRate: 0.03,
                    baselineItPowerMw: 1,
                    baselineMechanicalMw: 0.5,
                    liquidCoolingCapacityKw: 100,
                    airCoolingCapacityKw: 200,
                    totalRackSpaceU: 42,
                    usedRackSpaceU: 20,
                    baselineLiquidCoolingKw: 10,
                    baselineAirCoolingKw: 20,
                    baselineElectricalKw: 100,
                }
            ],
            assumptions: [
                { key: 'cooling_overhead', value: 1.5 },
                { key: 'inflation_rate', value: 0.03 }
            ]
        };

        const mockLineItems = [
            {
                id: 'line-1',
                siteId: 'site-1',
                catalogItemId: 'catalog-1',
                projectTag: 'Project-A',
                startQuarter: '2024-Q1',
                endQuarter: '2024-Q2',
                quantity: 5,
                actualStartQuarter: null,
                actualEndQuarter: null,
                actualQuantity: null,
                varianceNotes: null,
            }
        ];

        const mockCatalogItems = [
            {
                id: 'catalog-1',
                name: 'H100-8',
                category: 'GPU',
                model: 'H100',
                vendor: 'NVIDIA',
                powerKw: 12.5,
                cost: 250000,
                capacityType: 'GPU',
                capacityVal: 8,
                liquidCoolingCapacityKw: 500,
                airCoolingCapacityKw: null,
                rackSpaceU: 2,
                electricalCapacityKw: 15,
            }
        ];

        it('should export a scenario with all related data', async () => {
            vi.mocked(prisma.scenario.findUnique).mockResolvedValue(mockScenario as any);
            vi.mocked(prisma.lineItem.findMany).mockResolvedValue(mockLineItems as any);
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue(mockCatalogItems as any);

            const result = await exportScenario('scenario-1');

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data?.scenario.id).toBe('scenario-1');
            expect(result.data?.scenario.name).toBe('Test Scenario');
            expect(result.data?.sites).toHaveLength(1);
            expect(result.data?.assumptions).toHaveLength(2);
            expect(result.data?.lineItems).toHaveLength(1);
            expect(result.data?.catalogItems).toHaveLength(1);
        });

        it('should return error for non-existent scenario', async () => {
            vi.mocked(prisma.scenario.findUnique).mockResolvedValue(null);

            const result = await exportScenario('non-existent');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Scenario not found');
        });

        it('should handle empty line items gracefully', async () => {
            const scenarioWithNoLineItems = { ...mockScenario };
            vi.mocked(prisma.scenario.findUnique).mockResolvedValue(scenarioWithNoLineItems as any);
            vi.mocked(prisma.lineItem.findMany).mockResolvedValue([]);
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue([]);

            const result = await exportScenario('scenario-1');

            expect(result.success).toBe(true);
            expect(result.data?.lineItems).toHaveLength(0);
            expect(result.data?.catalogItems).toHaveLength(0);
        });

        it('should handle database errors gracefully', async () => {
            vi.mocked(prisma.scenario.findUnique).mockRejectedValue(new Error('Database error'));

            const result = await exportScenario('scenario-1');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Failed to export scenario');
        });

        it('should include complete scenario metadata', async () => {
            vi.mocked(prisma.scenario.findUnique).mockResolvedValue(mockScenario as any);
            vi.mocked(prisma.lineItem.findMany).mockResolvedValue([]);
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue([]);

            const result = await exportScenario('scenario-1');

            expect(result.success).toBe(true);
            expect(result.data?.scenario).toMatchObject({
                id: 'scenario-1',
                name: 'Test Scenario',
                description: 'A test scenario',
                horizonStart: '2024-Q1',
                horizonEnd: '2024-Q4',
                isBase: false,
            });
        });

        it('should include complete site data', async () => {
            vi.mocked(prisma.scenario.findUnique).mockResolvedValue(mockScenario as any);
            vi.mocked(prisma.lineItem.findMany).mockResolvedValue([]);
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue([]);

            const result = await exportScenario('scenario-1');

            expect(result.success).toBe(true);
            expect(result.data?.sites[0]).toMatchObject({
                id: 'site-1',
                name: 'Test Site',
                totalItCapacityMw: 10,
                electricalCapacityMw: 12,
            });
        });

        it('should include complete line item data with actuals tracking', async () => {
            vi.mocked(prisma.scenario.findUnique).mockResolvedValue(mockScenario as any);
            vi.mocked(prisma.lineItem.findMany).mockResolvedValue(mockLineItems as any);
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue(mockCatalogItems as any);

            const result = await exportScenario('scenario-1');

            expect(result.success).toBe(true);
            expect(result.data?.lineItems[0]).toMatchObject({
                id: 'line-1',
                siteId: 'site-1',
                catalogItemId: 'catalog-1',
                projectTag: 'Project-A',
                quantity: 5,
                actualStartQuarter: null,
                actualEndQuarter: null,
                actualQuantity: null,
                varianceNotes: null,
            });
        });

        it('should include complete catalog item data', async () => {
            vi.mocked(prisma.scenario.findUnique).mockResolvedValue(mockScenario as any);
            vi.mocked(prisma.lineItem.findMany).mockResolvedValue(mockLineItems as any);
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue(mockCatalogItems as any);

            const result = await exportScenario('scenario-1');

            expect(result.success).toBe(true);
            expect(result.data?.catalogItems[0]).toMatchObject({
                id: 'catalog-1',
                name: 'H100-8',
                category: 'GPU',
                powerKw: 12.5,
                cost: 250000,
            });
        });
    });

    describe('exportAllScenarios', () => {
        const mockCatalogItems = [
            {
                id: 'catalog-1',
                name: 'H100-8',
                category: 'GPU',
                model: 'H100',
                vendor: 'NVIDIA',
                powerKw: 12.5,
                cost: 250000,
                capacityType: 'GPU',
                capacityVal: 8,
                liquidCoolingCapacityKw: 500,
                airCoolingCapacityKw: null,
                rackSpaceU: 2,
                electricalCapacityKw: 15,
            }
        ];

        const mockScenarios = [
            {
                id: 'scenario-1',
                name: 'Scenario One',
                description: 'First scenario',
                horizonStart: '2024-Q1',
                horizonEnd: '2024-Q4',
                isBase: true,
                sites: [
                    {
                        id: 'site-1',
                        name: 'Site One',
                        totalItCapacityMw: 10,
                        electricalCapacityMw: 12,
                        electricityRatePerKwh: 0.10,
                        inflationRate: 0.03,
                        baselineItPowerMw: 1,
                        baselineMechanicalMw: 0.5,
                        liquidCoolingCapacityKw: 100,
                        airCoolingCapacityKw: 200,
                        totalRackSpaceU: 42,
                        usedRackSpaceU: 20,
                        baselineLiquidCoolingKw: 10,
                        baselineAirCoolingKw: 20,
                        baselineElectricalKw: 100,
                        lineItems: [
                            {
                                id: 'line-1',
                                catalogItemId: 'catalog-1',
                                projectTag: 'Project-A',
                                startQuarter: '2024-Q1',
                                endQuarter: '2024-Q2',
                                quantity: 5,
                                actualStartQuarter: null,
                                actualEndQuarter: null,
                                actualQuantity: null,
                                varianceNotes: null,
                            }
                        ]
                    }
                ],
                assumptions: [
                    { key: 'cooling_overhead', value: 1.5 }
                ]
            }
        ];

        it('should export all catalog items and scenarios', async () => {
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue(mockCatalogItems as any);
            vi.mocked(prisma.scenario.findMany).mockResolvedValue(mockScenarios as any);

            const result = await exportAllScenarios();

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data?.catalogItems).toHaveLength(1);
            expect(result.data?.scenarios).toHaveLength(1);
        });

        it('should include export metadata', async () => {
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue(mockCatalogItems as any);
            vi.mocked(prisma.scenario.findMany).mockResolvedValue(mockScenarios as any);

            const result = await exportAllScenarios();

            expect(result.success).toBe(true);
            expect(result.data?.exportDate).toBeDefined();
            expect(result.data?.version).toBe('1.0');
            // Verify exportDate is a valid ISO string
            expect(() => new Date(result.data?.exportDate || '')).not.toThrow();
        });

        it('should include nested site data with line items', async () => {
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue(mockCatalogItems as any);
            vi.mocked(prisma.scenario.findMany).mockResolvedValue(mockScenarios as any);

            const result = await exportAllScenarios();

            expect(result.success).toBe(true);
            expect(result.data?.scenarios[0].sites).toHaveLength(1);
            expect(result.data?.scenarios[0].sites[0].lineItems).toHaveLength(1);
        });

        it('should include assumptions for each scenario', async () => {
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue(mockCatalogItems as any);
            vi.mocked(prisma.scenario.findMany).mockResolvedValue(mockScenarios as any);

            const result = await exportAllScenarios();

            expect(result.success).toBe(true);
            expect(result.data?.scenarios[0].assumptions).toHaveLength(1);
            expect(result.data?.scenarios[0].assumptions[0]).toMatchObject({
                key: 'cooling_overhead',
                value: 1.5
            });
        });

        it('should handle empty database gracefully', async () => {
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue([]);
            vi.mocked(prisma.scenario.findMany).mockResolvedValue([]);

            const result = await exportAllScenarios();

            expect(result.success).toBe(true);
            expect(result.data?.catalogItems).toHaveLength(0);
            expect(result.data?.scenarios).toHaveLength(0);
        });

        it('should handle database errors gracefully', async () => {
            vi.mocked(prisma.catalogItem.findMany).mockRejectedValue(new Error('Database error'));

            const result = await exportAllScenarios();

            expect(result.success).toBe(false);
            expect(result.error).toBe('Failed to export all scenarios');
        });

        it('should include complete catalog item specifications', async () => {
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue(mockCatalogItems as any);
            vi.mocked(prisma.scenario.findMany).mockResolvedValue([]);

            const result = await exportAllScenarios();

            expect(result.success).toBe(true);
            expect(result.data?.catalogItems[0]).toMatchObject({
                id: 'catalog-1',
                name: 'H100-8',
                category: 'GPU',
                model: 'H100',
                vendor: 'NVIDIA',
                powerKw: 12.5,
                cost: 250000,
                capacityType: 'GPU',
                capacityVal: 8,
                rackSpaceU: 2,
                electricalCapacityKw: 15,
            });
        });

        it('should include complete scenario with all nested data', async () => {
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue([]);
            vi.mocked(prisma.scenario.findMany).mockResolvedValue(mockScenarios as any);

            const result = await exportAllScenarios();

            expect(result.success).toBe(true);
            const scenario = result.data?.scenarios[0];
            expect(scenario).toMatchObject({
                id: 'scenario-1',
                name: 'Scenario One',
                description: 'First scenario',
                horizonStart: '2024-Q1',
                horizonEnd: '2024-Q4',
                isBase: true,
            });
            expect(scenario?.sites).toHaveLength(1);
            expect(scenario?.sites[0].lineItems).toHaveLength(1);
            expect(scenario?.assumptions).toHaveLength(1);
        });

        it('should handle multiple scenarios', async () => {
            const multipleScenarios = [
                ...mockScenarios,
                {
                    ...mockScenarios[0],
                    id: 'scenario-2',
                    name: 'Scenario Two',
                    isBase: false,
                }
            ];
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue(mockCatalogItems as any);
            vi.mocked(prisma.scenario.findMany).mockResolvedValue(multipleScenarios as any);

            const result = await exportAllScenarios();

            expect(result.success).toBe(true);
            expect(result.data?.scenarios).toHaveLength(2);
        });

        it('should handle scenarios with multiple sites', async () => {
            const scenarioWithMultipleSites = {
                ...mockScenarios[0],
                sites: [
                    ...mockScenarios[0].sites,
                    {
                        ...mockScenarios[0].sites[0],
                        id: 'site-2',
                        name: 'Site Two',
                    }
                ]
            };
            vi.mocked(prisma.catalogItem.findMany).mockResolvedValue(mockCatalogItems as any);
            vi.mocked(prisma.scenario.findMany).mockResolvedValue([scenarioWithMultipleSites] as any);

            const result = await exportAllScenarios();

            expect(result.success).toBe(true);
            expect(result.data?.scenarios[0].sites).toHaveLength(2);
        });
    });
});
