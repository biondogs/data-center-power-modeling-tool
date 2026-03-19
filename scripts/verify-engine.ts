
import { PrismaClient } from '@prisma/client'
import { Aggregator } from '../lib/engine/aggregator'
import { TimeUtils } from '../lib/engine/time'

const prisma = new PrismaClient()

async function main() {
    console.log('Verifying Engine Logic...')

    // 1. Get Baseline Scenario
    const scenario = await prisma.scenario.findFirst({
        where: { name: 'Baseline Plan' },
        include: {
            assumptions: true,
            sites: {
                include: {
                    lineItems: {
                        include: { catalogItem: true }
                    }
                }
            }
        }
    })

    if (!scenario) throw new Error('Root scenario not found. Did you seed?')

    const bayView = scenario.sites.find(s => s.name === 'BayView')
    if (!bayView) throw new Error('BayView site not found')

    console.log(`Found Site: ${bayView.name}, Baseline Load: ${bayView.baselineItPowerMw} MW`)

    // 2. Simulate a Deployment (if none exists, or just use what's there)
    // Let's create a temporary LineItem in memory (not DB) for testing projection
    const catalogItem = await prisma.catalogItem.findFirst({ where: { name: 'H100-4' } })
    if (!catalogItem) throw new Error('H100-4 not found')

    // Create a fake line item
    const testLineItem = {
        id: 'temp-1',
        siteId: bayView.id,
        catalogItemId: catalogItem.id,
        catalogItem: catalogItem,
        projectTag: 'Test Project',
        startQuarter: '2024Q2',
        endQuarter: '2025Q2',
        quantity: 100,
        actualStartQuarter: null as string | null,
        actualEndQuarter: null as string | null,
        actualQuantity: null as number | null,
        varianceNotes: null as string | null,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    // Inject into site
    const siteWithTest = {
        ...bayView,
        lineItems: [...bayView.lineItems, testLineItem]
    }

    // 3. Run Aggregation
    const horizon = { horizonStart: '2024Q1', horizonEnd: '2025Q4' }
    console.log(`Projecting Horizon: ${horizon.horizonStart} -> ${horizon.horizonEnd}`)

    const results = Aggregator.aggregateSite(siteWithTest, scenario.assumptions, horizon)

    // 4. Print Results
    console.table(results.map(r => ({
        Quarter: r.quarter,
        'IT MW': r.totalItPowerMw.toFixed(2),
        'Adj MW': r.adjustedPowerMw.toFixed(2),
        'Util $': '$' + Math.round(r.utilityCost).toLocaleString(),
        'Capex': '$' + Math.round(r.capex).toLocaleString(),
        'GPUs': r.capacity['GPU'] || 0
    })))

    // Validation

    // Q1 should be Baseline only (10 MW)
    const q1 = results.find(r => r.quarter === '2024Q1')
    if (Math.abs(q1!.totalItPowerMw - 10.0) > 0.01) console.error('FAIL: Q1 Power incorrect')
    else console.log('PASS: Q1 Power is Baseline (10MW)')

    // Q2 should be Baseline + New Load
    // Load = 100 units * 10.5 kW = 1050 kW = 1.05 MW.
    // Total = 11.05 MW
    const q2 = results.find(r => r.quarter === '2024Q2')
    if (Math.abs(q2!.totalItPowerMw - 11.05) > 0.01) console.error(`FAIL: Q2 Power incorrect. Expected 11.05, got ${q2!.totalItPowerMw}`)
    else console.log('PASS: Q2 Power is Baseline + Deployment (11.05MW)')

    // Capex in Q2
    // 100 * $250,000 = $25,000,000
    if (Math.abs(q2!.capex - 25000000) > 1) console.error(`FAIL: Q2 Capex incorrect. Expected 25M, got ${q2!.capex}`)
    else console.log('PASS: Q2 Capex is correct ($25M)')

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
