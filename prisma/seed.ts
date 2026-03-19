
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // 1. Create Catalog Items based on Excel "Power Blocks" sheet
  const items = [
    {
      name: 'A100-8',
      category: 'GPU',
      vendor: 'SMC',
      model: 'A100',
      powerKw: 10,
      cost: 112000,
      capacityType: 'GPU',
      capacityVal: 8
    },
    {
      name: 'H100-4',
      category: 'GPU',
      vendor: 'Lenovo',
      model: 'H100',
      powerKw: 6.25,
      cost: 107000,
      capacityType: 'GPU',
      capacityVal: 4
    },
    {
      name: 'H100-8',
      category: 'GPU',
      vendor: 'SMC',
      model: 'H100',
      powerKw: 12.5,
      cost: 250000,
      capacityType: 'GPU',
      capacityVal: 8
    },
    {
      name: 'H200-8',
      category: 'GPU',
      vendor: 'Dell',
      model: 'H200',
      powerKw: 10,
      cost: 275000,
      capacityType: 'GPU',
      capacityVal: 8
    },
    {
      name: 'L40-8',
      category: 'GPU',
      vendor: 'Lenovo',
      model: 'L40',
      powerKw: 5,
      cost: 61300,
      capacityType: 'GPU',
      capacityVal: 8
    },
    {
      name: 'NVL72',
      category: 'GPU',
      vendor: 'Nvidia',
      model: 'NVL72',
      powerKw: 135,
      cost: 7000000,
      capacityType: 'GPU',
      capacityVal: 72
    },
    {
      name: 'HPC1-CPU',
      category: 'CPU',
      vendor: 'Intel',
      powerKw: 1.2,
      cost: 15000,
      capacityType: 'Cores',
      capacityVal: 64
    },
    {
      name: 'Storage-SSD',
      category: 'Storage',
      vendor: 'Generic',
      powerKw: 0.5,
      cost: 50000,
      capacityType: 'TB',
      capacityVal: 500
    }
  ]

  for (const item of items) {
    const exists = await prisma.catalogItem.findUnique({ where: { name: item.name } })
    if (!exists) {
      await prisma.catalogItem.create({ data: item })
      console.log(`Created catalog item: ${item.name}`)
    }
  }

  // 2. Create Base Scenario with realistic site data from Excel
  const scenarioName = 'Baseline Plan'
  let scenario = await prisma.scenario.findFirst({ where: { name: scenarioName } })

  if (!scenario) {
    scenario = await prisma.scenario.create({
      data: {
        name: scenarioName,
        description: 'Initial import from Excel V15',
        isBase: true,
        horizonStart: '2024Q1',
        horizonEnd: '2026Q4',
        assumptions: {
          create: [
            { key: 'inflation_rate', value: 0.10 },
            { key: 'cooling_overhead', value: 1.35 }
          ]
        },
        sites: {
          create: [
            {
              name: 'BayView',
              totalItCapacityMw: 12,      // Total data hall capacity
              electricalCapacityMw: 12,   // Electrical capacity
              electricityRatePerKwh: 0.10, // $/kW.h
              inflationRate: 0.10,
              baselineItPowerMw: 0,       // Will be populated from Baseline Power sheet
              baselineMechanicalMw: 0.8   // 0.8 MW as seen in Excel
            },
            {
              name: 'Mt.Wash',
              totalItCapacityMw: 1.05,
              electricalCapacityMw: 1.05,
              electricityRatePerKwh: 0.0755, // MTW rate
              inflationRate: 0.0,         // No specific inflation mentioned
              baselineItPowerMw: 0,
              baselineMechanicalMw: 0.4
            },
            {
              name: 'Bloomberg',
              totalItCapacityMw: 1.2,
              electricalCapacityMw: 1.2,
              electricityRatePerKwh: 0.10, // Same as Bayview initially
              inflationRate: 0.10,
              baselineItPowerMw: 0,
              baselineMechanicalMw: 0.4
            }
          ]
        }
      }
    })
    console.log(`Created scenario: ${scenarioName}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
