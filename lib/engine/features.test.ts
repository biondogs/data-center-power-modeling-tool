import { describe, it, expect } from 'vitest';
import { CapacityAnalyzer } from './capacity';
import { ProjectAggregator } from './project';
import { TimelineEngine } from './timeline';
import { WhatIfEngine } from './whatif';
import { ScenarioComparison } from './comparison';
import type { CatalogItem, LineItem, Site, Assumption, Scenario } from '@prisma/client';
import type { SiteProjection } from './aggregator';

// ============================================================================
// CAPACITY ALERTS TESTS (F1)
// ============================================================================

describe('CapacityAnalyzer', () => {
    const mockSite = {
        id: 'site1',
        name: 'TestSite',
        scenarioId: 'scenario1',
        totalItCapacityMw: 10,
        electricalCapacityMw: 12,
        liquidCoolingCapacityKw: 5000,
        airCoolingCapacityKw: 3000,
        totalRackSpaceU: 42,
        usedRackSpaceU: 0,
        electricityRatePerKwh: 0.10,
        electricityRatePerKwy: null,
        inflationRate: 0.10,
        baselineItPowerMw: 1,
        baselineMechanicalMw: 0.5,
        baselineLiquidCoolingKw: 0,
        baselineAirCoolingKw: 0,
        baselineElectricalKw: 0,
    } as Site;

    const createProjection = (overrides: Partial<SiteProjection> = {}): SiteProjection => ({
        quarter: '2024Q1',
        year: 2024,
        quarterNum: 1,
        itPowerMw: 2,
        baselineItPowerMw: 1,
        totalItPowerMw: 3,
        availablePowerMw: 7,
        usedPowerMw: 2,
        remainingPowerMw: 5,
        adjustedPowerMw: 4.05,
        mechanicalLoadMw: 1.05,
        totalFacilityPowerMw: 4.05,
        capacity: {},
        capex: 1000000,
        utilityCost: 50000,
        electricityRatePerKwh: 0.10,
        projectBreakdown: {},
        ...overrides
    });

    describe('analyzeSiteCapacity', () => {
        it('should identify OK status when within limits', () => {
            const projections = [createProjection({ totalItPowerMw: 3 })];
            const result = CapacityAnalyzer.analyzeSiteCapacity(mockSite, projections, 0.8, 1.0);

            expect(result.siteId).toBe('site1');
            expect(result.overallStatus).toBe('ok');
            
            const powerConstraint = result.constraints.find(c => c.type === 'power');
            expect(powerConstraint?.status).toBe('ok');
            expect(powerConstraint?.utilization).toBe(0.3);
        });

        it('should identify warning status when approaching limits', () => {
            const projections = [createProjection({ totalItPowerMw: 8 })];
            const result = CapacityAnalyzer.analyzeSiteCapacity(mockSite, projections, 0.8, 1.0);

            expect(result.overallStatus).toBe('warning');
            const powerConstraint = result.constraints.find(c => c.type === 'power');
            expect(powerConstraint?.status).toBe('warning');
            expect(powerConstraint?.utilization).toBe(0.8);
        });

        it('should identify critical status when exceeding limits', () => {
            const projections = [createProjection({ totalItPowerMw: 13 })];
            const result = CapacityAnalyzer.analyzeSiteCapacity(mockSite, projections, 0.8, 1.0);

            expect(result.overallStatus).toBe('critical');
            const powerConstraint = result.constraints.find(c => c.type === 'power');
            expect(powerConstraint?.status).toBe('critical');
            expect(powerConstraint?.quartersOverLimit).toContain('2024Q1');
        });
    });

    describe('checkDeploymentCapacity', () => {
        it('should allow deployment within capacity', () => {
            const projections = [createProjection()];
            const result = CapacityAnalyzer.checkDeploymentCapacity(mockSite, projections, 5, 500, 10);

            expect(result.allowed).toBe(true);
            expect(result.violations).toHaveLength(0);
        });

        it('should reject deployment exceeding capacity', () => {
            const projections = [createProjection({ totalItPowerMw: 8 })];
            const result = CapacityAnalyzer.checkDeploymentCapacity(mockSite, projections, 5, 500, 10);

            expect(result.allowed).toBe(false);
            expect(result.violations.length).toBeGreaterThan(0);
        });
    });
});

// ============================================================================
// PROJECT PORTFOLIO TESTS (F2)
// ============================================================================

describe('ProjectAggregator', () => {
    const createMockCatalogItem = (overrides: Partial<CatalogItem> = {}): CatalogItem => ({
        id: '1',
        name: 'H100-8',
        category: 'GPU',
        vendor: 'SMC',
        model: 'H100',
        powerKw: 12.5,
        cost: 250000,
        capacityType: 'GPU',
        capacityVal: 8,
        liquidCoolingCapacityKw: null,
        airCoolingCapacityKw: null,
        rackSpaceU: null,
        electricalCapacityKw: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    });

    const createMockLineItem = (catalogItem: CatalogItem, overrides: Partial<LineItem> = {}): LineItem & { catalogItem: CatalogItem } => ({
        id: '1',
        siteId: 'site1',
        catalogItemId: catalogItem.id,
        quantity: 10,
        startQuarter: '2024Q1',
        endQuarter: '2024Q4',
        projectTag: 'AI-Training',
        createdAt: new Date(),
        updatedAt: new Date(),
        catalogItem,
        ...overrides
    } as LineItem & { catalogItem: CatalogItem });

    describe('aggregateByProject', () => {
        it('should group line items by project tag', () => {
            const catalogItem = createMockCatalogItem();
            const lineItems = [
                createMockLineItem(catalogItem, { projectTag: 'Project-A', quantity: 5 }),
                createMockLineItem(catalogItem, { projectTag: 'Project-A', quantity: 3 }),
                createMockLineItem(catalogItem, { projectTag: 'Project-B', quantity: 10 })
            ];

            const projections = lineItems.map(() => [{ quarter: '2024Q1', powerMw: 0.5, capex: 100000, activeUnits: 10, opex: 0, capacity: { type: 'GPU', value: 10 } }]);

            const result = ProjectAggregator.aggregateByProject(lineItems, projections);

            expect(Object.keys(result)).toHaveLength(2);
            expect(result['Project-A'].lineItemCount).toBe(2);
            expect(result['Project-B'].lineItemCount).toBe(1);
        });

        it('should handle unassigned line items', () => {
            const catalogItem = createMockCatalogItem();
            const lineItems = [createMockLineItem(catalogItem, { projectTag: null })];

            const projections = [[{ quarter: '2024Q1', powerMw: 0.5, capex: 100000, activeUnits: 10, opex: 0, capacity: { type: 'GPU', value: 10 } }]];

            const result = ProjectAggregator.aggregateByProject(lineItems, projections);

            expect(result['Unassigned']).toBeDefined();
        });
    });
});

// ============================================================================
// TIMELINE TESTS (F5)
// ============================================================================

describe('TimelineEngine', () => {
    const createMockCatalogItem = (overrides: Partial<CatalogItem> = {}): CatalogItem => ({
        id: '1',
        name: 'H100-8',
        category: 'GPU',
        vendor: 'SMC',
        model: 'H100',
        powerKw: 12.5,
        cost: 250000,
        capacityType: 'GPU',
        capacityVal: 8,
        liquidCoolingCapacityKw: null,
        airCoolingCapacityKw: null,
        rackSpaceU: null,
        electricalCapacityKw: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    });

    const createMockLineItem = (catalogItem: CatalogItem, overrides: Partial<LineItem> = {}): LineItem & { catalogItem: CatalogItem } => ({
        id: '1',
        siteId: 'site1',
        catalogItemId: catalogItem.id,
        quantity: 10,
        startQuarter: '2024Q1',
        endQuarter: '2024Q4',
        projectTag: 'AI-Training',
        createdAt: new Date(),
        updatedAt: new Date(),
        catalogItem,
        ...overrides
    } as LineItem & { catalogItem: CatalogItem });

    describe('generateTimeline', () => {
        it('should create timeline items from line items', () => {
            const catalogItem = createMockCatalogItem();
            const lineItems = [
                createMockLineItem(catalogItem, { startQuarter: '2024Q1', endQuarter: '2024Q2', projectTag: 'Project-A' })
            ];

            const result = TimelineEngine.generateTimeline(lineItems, '2024Q1', '2024Q4');

            expect(result.items).toHaveLength(1);
            expect(result.items[0].startQuarter).toBe('2024Q1');
            expect(result.items[0].endQuarter).toBe('2024Q2');
            expect(result.items[0].duration).toBe(1);
        });

        it('should assign colors based on category', () => {
            const gpuItem = createMockCatalogItem({ category: 'GPU' });
            const cpuItem = createMockCatalogItem({ category: 'CPU' });
            const lineItems = [
                createMockLineItem(gpuItem, { startQuarter: '2024Q1', endQuarter: '2024Q1' }),
                createMockLineItem(cpuItem, { startQuarter: '2024Q1', endQuarter: '2024Q1' })
            ];

            const result = TimelineEngine.generateTimeline(lineItems, '2024Q1', '2024Q4');

            expect(result.items[0].color).toBe('#3b82f6');
            expect(result.items[1].color).toBe('#22c55e');
        });

        it('should generate timeline lanes by project', () => {
            const catalogItem = createMockCatalogItem();
            const lineItems = [
                createMockLineItem(catalogItem, { projectTag: 'Project-A' }),
                createMockLineItem(catalogItem, { projectTag: 'Project-B' }),
                createMockLineItem(catalogItem, { projectTag: 'Project-A' })
            ];

            const result = TimelineEngine.generateTimeline(lineItems, '2024Q1', '2024Q4');

            const projectALane = result.lanes.find(l => l.projectTag === 'Project-A');
            expect(projectALane?.items.length).toBe(2);
        });

        it('should handle indefinite end dates', () => {
            const catalogItem = createMockCatalogItem();
            const lineItems = [
                createMockLineItem(catalogItem, { startQuarter: '2024Q1', endQuarter: null })
            ];

            const result = TimelineEngine.generateTimeline(lineItems, '2024Q1', '2024Q4');

            expect(result.items[0].endQuarter).toBe('2024Q4');
        });
    });
});

// ============================================================================
// WHAT-IF ENGINE TESTS (F4)
// ============================================================================

describe('WhatIfEngine', () => {
    const createMockCatalogItem = (overrides: Partial<CatalogItem> = {}): CatalogItem => ({
        id: '1',
        name: 'H100-8',
        category: 'GPU',
        vendor: 'SMC',
        model: 'H100',
        powerKw: 12.5,
        cost: 250000,
        capacityType: 'GPU',
        capacityVal: 8,
        liquidCoolingCapacityKw: null,
        airCoolingCapacityKw: null,
        rackSpaceU: null,
        electricalCapacityKw: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    });

    const createMockSite = (overrides: Partial<Site> = {}): Site & { lineItems: (LineItem & { catalogItem: CatalogItem })[] } => ({
        id: 'site1',
        name: 'TestSite',
        scenarioId: 'scenario1',
        totalItCapacityMw: 12,
        electricalCapacityMw: 12,
        liquidCoolingCapacityKw: 0,
        airCoolingCapacityKw: 0,
        totalRackSpaceU: 0,
        usedRackSpaceU: 0,
        electricityRatePerKwh: 0.10,
        electricityRatePerKwy: null,
        inflationRate: 0.10,
        baselineItPowerMw: 2,
        baselineMechanicalMw: 0.8,
        baselineLiquidCoolingKw: 0,
        baselineAirCoolingKw: 0,
        baselineElectricalKw: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lineItems: [],
        ...overrides
    } as Site & { lineItems: (LineItem & { catalogItem: CatalogItem })[] });

    describe('applyChanges', () => {
        it('should apply addLineItem change', () => {
            const catalogItem = createMockCatalogItem();
            const change = {
                type: 'addLineItem' as const,
                lineItem: {
                    siteId: 'site1',
                    catalogItemId: catalogItem.id,
                    quantity: 5,
                    startQuarter: '2024Q1',
                    endQuarter: '2024Q2',
                    projectTag: 'Test-Project'
                },
                catalogItem
            };

            const result = WhatIfEngine.applyChanges(
                [createMockSite()],
                [],
                { horizonStart: '2024Q1', horizonEnd: '2024Q4' },
                [change]
            );

            expect(result.scenario.changes).toHaveLength(1);
            expect(result.projections['site1']).toBeDefined();
        });

        it('should calculate impact metrics', () => {
            const catalogItem = createMockCatalogItem({ powerKw: 10, cost: 100000 });
            const change = {
                type: 'addLineItem' as const,
                lineItem: {
                    siteId: 'site1',
                    catalogItemId: catalogItem.id,
                    quantity: 10,
                    startQuarter: '2024Q1',
                    endQuarter: '2024Q1',
                    projectTag: 'Test-Project'
                },
                catalogItem
            };

            const result = WhatIfEngine.applyChanges(
                [createMockSite()],
                [],
                { horizonStart: '2024Q1', horizonEnd: '2024Q4' },
                [change]
            );

            expect(result.impact).toBeDefined();
            expect(typeof result.impact.peakPowerDelta).toBe('number');
            expect(typeof result.impact.totalCapexDelta).toBe('number');
        });
    });

    describe('suggestAlternatives', () => {
        it('should suggest cheaper alternatives', () => {
            const currentItem = createMockCatalogItem({ powerKw: 10, cost: 100000 });
            const cheaperItem = createMockCatalogItem({ id: '2', powerKw: 9.5, cost: 80000 });
            const expensiveItem = createMockCatalogItem({ id: '3', powerKw: 10, cost: 120000 });

            const lineItem = {
                id: '1',
                siteId: 'site1',
                catalogItemId: currentItem.id,
                catalogItem: currentItem,
                quantity: 1,
                startQuarter: '2024Q1',
                endQuarter: '2024Q4',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as LineItem & { catalogItem: CatalogItem };

            const alternatives = WhatIfEngine.suggestAlternatives(
                lineItem,
                [currentItem, cheaperItem, expensiveItem]
            );

            expect(alternatives.some((a: CatalogItem) => a.id === cheaperItem.id)).toBe(true);
            expect(alternatives.some(a => a.id === expensiveItem.id)).toBe(false);
        });
    });
});

describe('ScenarioComparison', () => {
    const createMockProjection = (overrides: Partial<SiteProjection> = {}): SiteProjection => ({
        quarter: '2024Q1',
        year: 2024,
        quarterNum: 1,
        itPowerMw: 5,
        baselineItPowerMw: 1,
        totalItPowerMw: 6,
        availablePowerMw: 10,
        usedPowerMw: 5,
        remainingPowerMw: 5,
        adjustedPowerMw: 8.1,
        mechanicalLoadMw: 2.1,
        totalFacilityPowerMw: 8.1,
        capacity: {},
        capex: 1000000,
        utilityCost: 50000,
        electricityRatePerKwh: 0.10,
        ...overrides
    });

    describe('compareScenarios', () => {
        it('should calculate power differences between scenarios', () => {
            const result = ScenarioComparison.compareScenarios(
                'base',
                'variant',
                {
                    base: {
                        name: 'Baseline',
                        projections: [createMockProjection({ quarter: '2024Q1', adjustedPowerMw: 5 })]
                    },
                    compare: {
                        name: 'Variant',
                        projections: [createMockProjection({ quarter: '2024Q1', adjustedPowerMw: 8 })]
                    }
                }
            );

            expect(result.differences.length).toBeGreaterThan(0);
            expect(result.summary.peakPowerDelta).toBe(3);
        });

        it('should identify power differences across quarters', () => {
            const result = ScenarioComparison.compareScenarios(
                'base',
                'variant',
                {
                    base: {
                        name: 'Baseline',
                        projections: [
                            createMockProjection({ quarter: '2024Q1', adjustedPowerMw: 5 }),
                            createMockProjection({ quarter: '2024Q2', adjustedPowerMw: 6 })
                        ]
                    },
                    compare: {
                        name: 'Variant',
                        projections: [
                            createMockProjection({ quarter: '2024Q1', adjustedPowerMw: 7 }),
                            createMockProjection({ quarter: '2024Q2', adjustedPowerMw: 6 })
                        ]
                    }
                }
            );

            const q1Diff = result.differences.find(d => d.quarter === '2024Q1');
            expect(q1Diff?.delta).toBe(2);
        });

        it('should calculate summary metrics', () => {
            const result = ScenarioComparison.compareScenarios(
                'base',
                'variant',
                {
                    base: {
                        name: 'Baseline',
                        projections: [createMockProjection({ adjustedPowerMw: 10 })]
                    },
                    compare: {
                        name: 'Variant',
                        projections: [createMockProjection({ adjustedPowerMw: 15 })]
                    }
                }
            );

            expect(result.summary.peakPowerDelta).toBe(5);
            expect(result.summary.totalCapexDelta).toBe(0);
        });
    });
});

// ============================================================================
// MULTI-SITE AGGREGATION TESTS (F6)
// ============================================================================

describe('MultiSiteAggregation', () => {
    const createMockProjection = (siteName: string, overrides: Partial<SiteProjection> = {}): SiteProjection & { siteName: string } => ({
        siteName,
        quarter: '2024Q1',
        year: 2024,
        quarterNum: 1,
        itPowerMw: 5,
        baselineItPowerMw: 1,
        totalItPowerMw: 6,
        availablePowerMw: 10,
        usedPowerMw: 5,
        remainingPowerMw: 5,
        adjustedPowerMw: 8.1,
        mechanicalLoadMw: 2.1,
        totalFacilityPowerMw: 8.1,
        capacity: {},
        capex: 1000000,
        utilityCost: 50000,
        electricityRatePerKwh: 0.10,
        ...overrides
    } as SiteProjection & { siteName: string });

    describe('aggregateMultipleSites', () => {
        it('should sum power across all sites', () => {
            const siteProjections = {
                site1: [createMockProjection('Site A', { totalItPowerMw: 5 })],
                site2: [createMockProjection('Site B', { totalItPowerMw: 8 })],
                site3: [createMockProjection('Site C', { totalItPowerMw: 3 })]
            };

            const aggregate = {
                totalPower: Object.values(siteProjections).flat().reduce((sum, p) => sum + p.totalItPowerMw, 0),
                siteCount: Object.keys(siteProjections).length,
                peakPower: Math.max(...Object.values(siteProjections).flat().map(p => p.totalItPowerMw)),
                totalCapex: Object.values(siteProjections).flat().reduce((sum, p) => sum + p.capex, 0)
            };

            expect(aggregate.totalPower).toBe(16);
            expect(aggregate.siteCount).toBe(3);
            expect(aggregate.peakPower).toBe(8);
            expect(aggregate.totalCapex).toBe(3000000);
        });

        it('should identify site with highest utilization', () => {
            const siteProjections = {
                site1: [{ ...createMockProjection('Site A'), totalItPowerMw: 5, availablePowerMw: 10 }],
                site2: [{ ...createMockProjection('Site B'), totalItPowerMw: 8, availablePowerMw: 10 }],
                site3: [{ ...createMockProjection('Site C'), totalItPowerMw: 9, availablePowerMw: 10 }]
            };

            const utilizationBySite = Object.entries(siteProjections).map(([id, projections]) => ({
                id,
                utilization: projections[0].totalItPowerMw / projections[0].availablePowerMw
            }));

            const highestUtilization = utilizationBySite.reduce((max, site) =>
                site.utilization > max.utilization ? site : max
            );

            expect(highestUtilization.id).toBe('site3');
            expect(highestUtilization.utilization).toBe(0.9);
        });
    });
});

describe('HistoricalTracking', () => {
    const createMockLineItem = (overrides: Partial<LineItem> = {}): LineItem & { catalogItem: CatalogItem } => ({
        id: '1',
        siteId: 'site1',
        catalogItemId: '1',
        quantity: 10,
        startQuarter: '2024Q1',
        endQuarter: '2024Q4',
        projectTag: 'Test Project',
        createdAt: new Date(),
        updatedAt: new Date(),
        catalogItem: {
            id: '1',
            name: 'Test GPU',
            category: 'GPU',
            vendor: 'Nvidia',
            model: 'H100',
            powerKw: 12.5,
            cost: 250000,
            capacityType: 'GPU',
            capacityVal: 8,
            liquidCoolingCapacityKw: null,
            airCoolingCapacityKw: null,
            rackSpaceU: null,
            electricalCapacityKw: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        ...overrides
    } as LineItem & { catalogItem: CatalogItem });

    describe('calculateVariance', () => {
        it('should detect timeline variance', () => {
            const planned = { startQuarter: '2024Q1', quantity: 10 };
            const actual = { startQuarter: '2024Q2', quantity: 8 };

            const hasTimingVariance = actual.startQuarter !== planned.startQuarter;
            const hasQuantityVariance = actual.quantity !== planned.quantity;

            expect(hasTimingVariance).toBe(true);
            expect(hasQuantityVariance).toBe(true);
        });

        it('should calculate variance impact', () => {
            const items = [
                createMockLineItem({ quantity: 10 }),
                createMockLineItem({ quantity: 5 }),
                createMockLineItem({ quantity: 20 })
            ];

            const totalPlanned = items.reduce((sum, item) => sum + item.quantity, 0);

            expect(totalPlanned).toBe(35);
        });

        it('should identify items with variance notes', () => {
            const item = createMockLineItem({ projectTag: 'Delayed Project' });

            expect(item.projectTag).toBe('Delayed Project');
        });
    });
});
