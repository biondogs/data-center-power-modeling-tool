import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Idempotent: Delete existing data to allow re-seeding
    console.log('  Clearing existing data...')
    await prisma.lineItem.deleteMany()
    await prisma.catalogItem.deleteMany()
    await prisma.site.deleteMany()
    await prisma.scenario.deleteMany()
    await prisma.assumption.deleteMany()

    // --- 1. Create Catalog Items (based on Excel "Power Blocks" sheet) ---
    console.log('  Creating catalog items...')
    const catalogItems = await Promise.all([
        prisma.catalogItem.create({ data: {
            name: 'A100-8',
            category: 'GPU',
            vendor: 'SMC',
            model: 'A100',
            powerKw: 10,
            cost: 112000,
            capacityType: 'GPU',
            capacityVal: 8,
            rackSpaceU: 4,
            liquidCoolingCapacityKw: 0,
            airCoolingCapacityKw: 10,
        }}),
        prisma.catalogItem.create({ data: {
            name: 'H100-8',
            category: 'GPU',
            vendor: 'SMC',
            model: 'H100',
            powerKw: 12.5,
            cost: 250000,
            capacityType: 'GPU',
            capacityVal: 8,
            rackSpaceU: 4,
            liquidCoolingCapacityKw: 0,
            airCoolingCapacityKw: 12.5,
        }}),
        prisma.catalogItem.create({ data: {
            name: 'CPU-Scale-Out',
            category: 'CPU',
            vendor: 'HPE',
            model: 'ProLiant DL380',
            powerKw: 1.5,
            cost: 25000,
            capacityType: 'CPU',
            capacityVal: 1,
            rackSpaceU: 2,
            liquidCoolingCapacityKw: 0,
            airCoolingCapacityKw: 1.5,
        }}),
        prisma.catalogItem.create({ data: {
            name: 'GPU-Training-Node',
            category: 'GPU',
            vendor: 'Dell',
            model: 'PowerEdge XE9680',
            powerKw: 100,
            cost: 375000,
            capacityType: 'GPU',
            capacityVal: 8,
            rackSpaceU: 16,
            liquidCoolingCapacityKw: 80,
            airCoolingCapacityKw: 20,
        }}),
        prisma.catalogItem.create({ data: {
            name: 'GPU-Inference',
            category: 'GPU',
            vendor: 'Dell',
            model: 'PowerEdge XE7640',
            powerKw: 50,
            cost: 180000,
            capacityType: 'GPU',
            capacityVal: 4,
            rackSpaceU: 8,
            liquidCoolingCapacityKw: 0,
            airCoolingCapacityKw: 50,
        }}),
        prisma.catalogItem.create({ data: {
            name: 'HPC-Compute',
            category: 'CPU',
            vendor: 'Dell',
            model: 'PowerEdge XE7640',
            powerKw: 4.5,
            cost: 50000,
            capacityType: 'CPU',
            capacityVal: 1,
            rackSpaceU: 4,
            liquidCoolingCapacityKw: 0,
            airCoolingCapacityKw: 4.5,
        }}),
        prisma.catalogItem.create({ data: {
            name: 'All-Flash-Storage',
            category: 'Storage',
            vendor: 'Pure',
            model: 'FlashBlade//S',
            powerKw: 5,
            cost: 150000,
            capacityType: 'Storage',
            capacityVal: 20,
            rackSpaceU: 4,
            liquidCoolingCapacityKw: 0,
            airCoolingCapacityKw: 5,
        }}),
        prisma.catalogItem.create({ data: {
            name: 'Object-Storage',
            category: 'Storage',
            vendor: 'Scality',
            model: 'Ring',
            powerKw: 2.5,
            cost: 75000,
            capacityType: 'Storage',
            capacityVal: 20,
            rackSpaceU: 2,
            liquidCoolingCapacityKw: 0,
            airCoolingCapacityKw: 2.5,
        }}),
    ])

    console.log(`    Created ${catalogItems.length} catalog items.`)

    // Validate catalog items
    if (catalogItems.length !== 8) {
        throw new Error(`Expected 8 catalog items, created ${catalogItems.length}`)
    }
    catalogItems.forEach((item, i) => {
        if (!item.name) {
            throw new Error(`Catalog item ${i} missing name`)
        }
        if (item.powerKw <= 0) {
            throw new Error(`Catalog item "${item.name}" has invalid powerKw: ${item.powerKw}`)
        }
        if (item.cost < 0) {
            throw new Error(`Catalog item "${item.name}" has negative cost`)
        }
    })

    // --- 2. Create Scenarios ---
    console.log('  Creating scenarios...')
    const scenario = await prisma.scenario.create({
        data: {
            name: 'Scenario 1: Caxa',
            description: 'Based on Modeling-infrastructure-costs-V15.xlsx',
            horizonStart: '2024Q1',
            horizonEnd: '2032Q4',
        },
    })
    console.log(`    Created scenario: ${scenario.name}`)

    // --- 3. Create Assumptions ---
    console.log('  Creating assumptions...')
    const assumptions = await Promise.all([
        prisma.assumption.create({ data: {
            scenarioId: scenario.id,
            key: 'cooling_overhead',
            value: 0.35,
        }}),
        prisma.assumption.create({ data: {
            scenarioId: scenario.id,
            key: 'inflation_rate',
            value: 0.02,
        }}),
    ])
    console.log(`    Created ${assumptions.length} assumptions.`)

    // --- 4. Create Sites ---
    console.log('  Creating sites...')
    const siteA = await prisma.site.create({
        data: {
            scenarioId: scenario.id,
            name: 'Site A: Virginia',
            totalItCapacityMw: 24.0,
            electricalCapacityMw: 30.0,
            liquidCoolingCapacityKw: 12000,
            airCoolingCapacityKw: 18000,
            electricityRatePerKwh: 0.12,
            inflationRate: 0.02,
            totalRackSpaceU: 1000,
            usedRackSpaceU: 0,
            baselineItPowerMw: 0.0,
            baselineMechanicalMw: 0.0,
            baselineLiquidCoolingKw: 0,
            baselineAirCoolingKw: 0,
            baselineElectricalKw: 0,
        },
    })

    const siteB = await prisma.site.create({
        data: {
            scenarioId: scenario.id,
            name: 'Site B: Oregon',
            totalItCapacityMw: 24.0,
            electricalCapacityMw: 30.0,
            liquidCoolingCapacityKw: 12000,
            airCoolingCapacityKw: 18000,
            electricityRatePerKwh: 0.10,
            inflationRate: 0.02,
            totalRackSpaceU: 1000,
            usedRackSpaceU: 0,
            baselineItPowerMw: 0.0,
            baselineMechanicalMw: 0.0,
            baselineLiquidCoolingKw: 0,
            baselineAirCoolingKw: 0,
            baselineElectricalKw: 0,
        },
    })

    const siteC = await prisma.site.create({
        data: {
            scenarioId: scenario.id,
            name: 'Site C: Nevada',
            totalItCapacityMw: 18.0,
            electricalCapacityMw: 22.0,
            liquidCoolingCapacityKw: 8000,
            airCoolingCapacityKw: 12000,
            electricityRatePerKwh: 0.08,
            inflationRate: 0.02,
            totalRackSpaceU: 750,
            usedRackSpaceU: 0,
            baselineItPowerMw: 0.0,
            baselineMechanicalMw: 0.0,
            baselineLiquidCoolingKw: 0,
            baselineAirCoolingKw: 0,
            baselineElectricalKw: 0,
        },
    })
    console.log('    Created 3 sites: Virginia, Oregon, Nevada')

    // --- 5. Create Line Items (from Excel deployment schedule) ---
    console.log('  Creating line items...')
    const lineItems = await Promise.all([
        // Site A - GPU Scale-Up
        prisma.lineItem.create({ data: {
            siteId: siteA.id,
            catalogItemId: catalogItems[0].id, // A100-8
            quantity: 40,
            startQuarter: '2024Q2',
            projectTag: 'GPU-Scale-Up',
        }}),
        prisma.lineItem.create({ data: {
            siteId: siteA.id,
            catalogItemId: catalogItems[1].id, // H100-8
            quantity: 40,
            startQuarter: '2024Q4',
            projectTag: 'GPU-Scale-Up',
        }}),
        // Site A - CPU Scale-Out
        prisma.lineItem.create({ data: {
            siteId: siteA.id,
            catalogItemId: catalogItems[2].id, // CPU-Scale-Out
            quantity: 30,
            startQuarter: '2024Q1',
            projectTag: 'CPU-Scale-Out',
        }}),
        // Site A - HPC Scale-Up
        prisma.lineItem.create({ data: {
            siteId: siteA.id,
            catalogItemId: catalogItems[5].id, // HPC-Compute
            quantity: 16,
            startQuarter: '2024Q3',
            projectTag: 'HPC-Scale-Up',
        }}),
        // Site A - Storage
        prisma.lineItem.create({ data: {
            siteId: siteA.id,
            catalogItemId: catalogItems[6].id, // All-Flash-Storage
            quantity: 8,
            startQuarter: '2024Q2',
            projectTag: 'Storage-Scale',
        }}),
        // Site B - GPU Scale-Up
        prisma.lineItem.create({ data: {
            siteId: siteB.id,
            catalogItemId: catalogItems[1].id, // H100-8
            quantity: 20,
            startQuarter: '2025Q1',
            projectTag: 'GPU-Scale-Up',
        }}),
        // Site B - Training Nodes
        prisma.lineItem.create({ data: {
            siteId: siteB.id,
            catalogItemId: catalogItems[3].id, // GPU-Training-Node
            quantity: 2,
            startQuarter: '2026Q1',
            projectTag: 'Training-Cluster',
        }}),
        // Site B - Inference
        prisma.lineItem.create({ data: {
            siteId: siteB.id,
            catalogItemId: catalogItems[4].id, // GPU-Inference
            quantity: 50,
            startQuarter: '2025Q1',
            projectTag: 'Inference-Fleet',
        }}),
        // Site C - GPU Scale-Up
        prisma.lineItem.create({ data: {
            siteId: siteC.id,
            catalogItemId: catalogItems[1].id, // H100-8
            quantity: 20,
            startQuarter: '2025Q1',
            projectTag: 'GPU-Scale-Up',
        }}),
        // Site C - CPU
        prisma.lineItem.create({ data: {
            siteId: siteC.id,
            catalogItemId: catalogItems[2].id, // CPU-Scale-Out
            quantity: 100,
            startQuarter: '2024Q1',
            projectTag: 'CPU-Scale-Out',
        }}),
    ])
    console.log(`    Created ${lineItems.length} line items.`)

    // --- Summary ---
    console.log('\n✅ Seed complete!')
    console.log(`   Catalog items:  ${catalogItems.length}`)
    console.log(`   Scenarios:      1`)
    console.log(`   Sites:          3`)
    console.log(`   Line items:     ${lineItems.length}`)
    console.log(`   Assumptions:    ${assumptions.length}`)
}

main()
    .catch((e) => {
        console.error('\n❌ Seed failed:', e.message)
        console.error(e.stack)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
