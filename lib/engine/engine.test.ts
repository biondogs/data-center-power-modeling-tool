import { describe, it, expect } from 'vitest';
import { TimeUtils } from './time';
import { Projector } from './projector';
import { Aggregator, SiteWithLineItems } from './aggregator';
import type { CatalogItem, LineItem, Assumption } from '@prisma/client';

function createMockCatalogItem(overrides: Partial<CatalogItem> = {}): CatalogItem {
    return {
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
    };
}

function createMockLineItem(catalogItem: CatalogItem, overrides: Partial<LineItem> = {}): LineItem & { catalogItem: CatalogItem } {
    return {
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
    } as LineItem & { catalogItem: CatalogItem };
}

function createMockSite(overrides: Partial<SiteWithLineItems> = {}): SiteWithLineItems {
    return {
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
        lineItems: [] as (LineItem & { catalogItem: CatalogItem })[],
        ...overrides
    } as SiteWithLineItems;
}

describe('TimeUtils', () => {
    describe('parse', () => {
        it('should parse "2024-Q1" format', () => {
            const result = TimeUtils.parse('2024-Q1');
            expect(result).toEqual({ year: 2024, q: 1 });
        });

        it('should parse "2024Q1" format', () => {
            const result = TimeUtils.parse('2024Q1');
            expect(result).toEqual({ year: 2024, q: 1 });
        });

        it('should handle all quarters', () => {
            expect(TimeUtils.parse('2024Q1')).toEqual({ year: 2024, q: 1 });
            expect(TimeUtils.parse('2024Q2')).toEqual({ year: 2024, q: 2 });
            expect(TimeUtils.parse('2024Q3')).toEqual({ year: 2024, q: 3 });
            expect(TimeUtils.parse('2024Q4')).toEqual({ year: 2024, q: 4 });
        });

        it('should throw on invalid format', () => {
            expect(() => TimeUtils.parse('invalid')).toThrow('Invalid quarter format');
            expect(() => TimeUtils.parse('2024')).toThrow('Invalid quarter format');
            expect(() => TimeUtils.parse('Q1-2024')).toThrow('Invalid quarter format');
        });
    });

    describe('format', () => {
        it('should format quarter object', () => {
            expect(TimeUtils.format({ year: 2024, q: 1 })).toBe('2024Q1');
            expect(TimeUtils.format({ year: 2025, q: 4 })).toBe('2025Q4');
        });
    });

    describe('toIndex', () => {
        it('should convert quarter to index', () => {
            expect(TimeUtils.toIndex('2024Q1')).toBe(2024 * 4 + 0);
            expect(TimeUtils.toIndex('2024Q2')).toBe(2024 * 4 + 1);
            expect(TimeUtils.toIndex('2024Q4')).toBe(2024 * 4 + 3);
        });

        it('should handle Quarter object', () => {
            expect(TimeUtils.toIndex({ year: 2024, q: 1 })).toBe(2024 * 4 + 0);
        });
    });

    describe('fromIndex', () => {
        it('should convert index to quarter string', () => {
            expect(TimeUtils.fromIndex(2024 * 4 + 0)).toBe('2024Q1');
            expect(TimeUtils.fromIndex(2024 * 4 + 3)).toBe('2024Q4');
        });
    });

    describe('diff', () => {
        it('should calculate difference in quarters', () => {
            expect(TimeUtils.diff('2024Q1', '2024Q2')).toBe(1);
            expect(TimeUtils.diff('2024Q1', '2024Q4')).toBe(3);
            expect(TimeUtils.diff('2024Q1', '2025Q1')).toBe(4);
        });
    });

    describe('add', () => {
        it('should add quarters', () => {
            expect(TimeUtils.add('2024Q1', 1)).toBe('2024Q2');
            expect(TimeUtils.add('2024Q1', 4)).toBe('2025Q1');
            expect(TimeUtils.add('2024Q4', 1)).toBe('2025Q1');
        });
    });

    describe('generateRange', () => {
        it('should generate range of quarters', () => {
            const range = TimeUtils.generateRange('2024Q1', '2024Q3');
            expect(range).toEqual(['2024Q1', '2024Q2', '2024Q3']);
        });

        it('should handle year boundaries', () => {
            const range = TimeUtils.generateRange('2024Q3', '2025Q2');
            expect(range).toEqual(['2024Q3', '2024Q4', '2025Q1', '2025Q2']);
        });

        it('should handle single quarter', () => {
            const range = TimeUtils.generateRange('2024Q1', '2024Q1');
            expect(range).toEqual(['2024Q1']);
        });
    });
});

describe('Projector', () => {
    const settings = {
        horizonStart: '2024Q1',
        horizonEnd: '2025Q4'
    };

    describe('projectLineItem', () => {
        it('should project a line item correctly', () => {
            const catalogItem = createMockCatalogItem();
            const lineItem = createMockLineItem(catalogItem);
            const result = Projector.projectLineItem(lineItem, settings);

            expect(result).toHaveLength(8);

            expect(result[0]).toMatchObject({
                quarter: '2024Q1',
                activeUnits: 10,
                powerMw: 0.125,
                capex: 2500000,
                projectTag: 'AI-Training'
            });

            expect(result[0].powerMw).toBe(0.125);
            expect(result[2].powerMw).toBe(0.125);
            expect(result[3].powerMw).toBe(0);

            expect(result[4].activeUnits).toBe(0);
            expect(result[4].powerMw).toBe(0);
        });

        it('should calculate capacity correctly', () => {
            const catalogItem = createMockCatalogItem();
            const lineItem = createMockLineItem(catalogItem);
            const result = Projector.projectLineItem(lineItem, settings);

            expect(result[0].capacity).toEqual({
                type: 'GPU',
                value: 80
            });
        });

        it('should handle indefinite end (no endQuarter)', () => {
            const catalogItem = createMockCatalogItem();
            const lineItem = createMockLineItem(catalogItem, { endQuarter: null });
            const result = Projector.projectLineItem(lineItem, settings);

            expect(result.every(r => r.activeUnits === 10)).toBe(true);
        });

        it('should handle different power calculations', () => {
            const highPowerItem = createMockCatalogItem({
                powerKw: 100,
                cost: 100000
            });
            const lineItem = createMockLineItem(highPowerItem, { quantity: 5 });
            const result = Projector.projectLineItem(lineItem, settings);

            expect(result[0].powerMw).toBe(0.5);
        });
    });
});

describe('Aggregator', () => {
    const assumptions: Assumption[] = [
        { id: '1', scenarioId: 'scenario1', key: 'cooling_overhead', value: 1.35 },
        { id: '2', scenarioId: 'scenario1', key: 'inflation_rate', value: 0.10 }
    ];

    const settings = {
        horizonStart: '2024Q1',
        horizonEnd: '2024Q4'
    };

    describe('aggregateSite', () => {
        it('should aggregate site data correctly', () => {
            const catalogItem = createMockCatalogItem();
            const site = createMockSite({
                lineItems: [createMockLineItem(catalogItem)]
            });
            const result = Aggregator.aggregateSite(site, assumptions, settings);

            expect(result).toHaveLength(4);

            const q1 = result[0];
            expect(q1.quarter).toBe('2024Q1');
            expect(q1.itPowerMw).toBe(0.125);
            expect(q1.baselineItPowerMw).toBe(2);
            expect(q1.totalItPowerMw).toBe(2.125);
            expect(q1.adjustedPowerMw).toBeCloseTo(2.86875);
            expect(q1.mechanicalLoadMw).toBeCloseTo(0.74375);

            expect(q1.availablePowerMw).toBe(10);
            expect(q1.usedPowerMw).toBe(0.125);
            expect(q1.remainingPowerMw).toBeCloseTo(9.875);

            expect(q1.capex).toBe(2500000);
            expect(result[1].capex).toBe(0);
        });

        it('should apply inflation to electricity rates', () => {
            const catalogItem = createMockCatalogItem();
            const site = createMockSite({
                lineItems: [createMockLineItem(catalogItem)]
            });
            const result = Aggregator.aggregateSite(site, assumptions, {
                ...settings,
                horizonEnd: '2025Q1'
            });

            expect(result[0].electricityRatePerKwh).toBe(0.10);
            const q1_2025 = result.find(r => r.quarter === '2025Q1');
            expect(q1_2025?.electricityRatePerKwh).toBeCloseTo(0.11);
        });

        it('should calculate utility costs', () => {
            const catalogItem = createMockCatalogItem();
            const site = createMockSite({
                lineItems: [createMockLineItem(catalogItem)]
            });
            const result = Aggregator.aggregateSite(site, assumptions, settings);
            const q1 = result[0];

            expect(q1.utilityCost).toBeGreaterThan(0);
            expect(q1.utilityCost).toBeCloseTo(628687, 0);
        });

        it('should track capacity by type', () => {
            const catalogItem = createMockCatalogItem();
            const site = createMockSite({
                lineItems: [createMockLineItem(catalogItem)]
            });
            const result = Aggregator.aggregateSite(site, assumptions, settings);

            expect(result[0].capacity['GPU']).toBe(80);
        });

        it('should include project breakdown', () => {
            const catalogItem = createMockCatalogItem();
            const site = createMockSite({
                lineItems: [createMockLineItem(catalogItem)]
            });
            const result = Aggregator.aggregateSite(site, assumptions, settings);

            expect(result[0].projectBreakdown).toBeDefined();
            expect(result[0].projectBreakdown?.['AI-Training']).toMatchObject({
                powerMw: 0.125,
                capex: 2500000,
                quantity: 10
            });
        });

        it('should handle empty line items', () => {
            const site = createMockSite({ lineItems: [] });
            const result = Aggregator.aggregateSite(site, assumptions, settings);

            expect(result[0].itPowerMw).toBe(0);
            expect(result[0].capex).toBe(0);
            expect(result[0].totalItPowerMw).toBe(2);
        });

        it('should handle missing assumptions with defaults', () => {
            const catalogItem = createMockCatalogItem();
            const site = createMockSite({
                lineItems: [createMockLineItem(catalogItem)]
            });
            const result = Aggregator.aggregateSite(site, [], settings);

            expect(result[0].adjustedPowerMw).toBeGreaterThan(result[0].totalItPowerMw);
        });
    });

    describe('calculateSummary', () => {
        it('should calculate summary statistics', () => {
            const catalogItem = createMockCatalogItem();
            const site = createMockSite({
                lineItems: [createMockLineItem(catalogItem)]
            });
            const projections = Aggregator.aggregateSite(site, assumptions, settings);
            const summary = Aggregator.calculateSummary(projections);

            expect(summary.peakPowerMw).toBe(2.125);
            expect(summary.peakAdjustedPowerMw).toBeGreaterThan(2.125);
            expect(summary.totalCapex).toBe(2500000);
            expect(summary.totalUtilityCost).toBeGreaterThan(0);
            expect(summary.maxGpuCount).toBe(80);
        });

        it('should handle empty projections', () => {
            const summary = Aggregator.calculateSummary([]);

            expect(summary.peakPowerMw).toBe(0);
            expect(summary.totalCapex).toBe(0);
            expect(summary.maxGpuCount).toBe(0);
        });
    });
});
