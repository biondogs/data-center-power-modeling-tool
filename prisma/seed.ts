
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // 1. Create Catalog Items
  // "Power Blocks" from prompt
  const items = [
    {
      name: 'H100-4',
      category: 'GPU',
      vendor: 'NVIDIA',
      powerKw: 10.5, // Made up realistic value for a block/server
      cost: 250000, 
      capacityType: 'GPU',
      capacityVal: 4,
      unitsPerBlock: 1
    },
    {
      name: 'H100-8',
      category: 'GPU',
      vendor: 'NVIDIA',
      powerKw: 18.0, 
      cost: 400000, 
      capacityType: 'GPU',
      capacityVal: 8,
      unitsPerBlock: 1
    },
    {
      name: 'HPC1-CPU',
      category: 'CPU',
      vendor: 'Intel',
      powerKw: 1.2, 
      cost: 15000, 
      capacityType: 'Cores',
      capacityVal: 64,
      unitsPerBlock: 1
    },
    {
      name: 'Storage-SSD',
      category: 'Storage',
      vendor: 'Generic',
      powerKw: 0.5, 
      cost: 50000, 
      capacityType: 'TB',
      capacityVal: 500,
      unitsPerBlock: 1
    }
  ]

  for (const item of items) {
    const exists = await prisma.catalogItem.findUnique({ where: { name: item.name } })
    if (!exists) {
      await prisma.catalogItem.create({ data: item })
      console.log(`Created catalog item: ${item.name}`)
    }
  }

  // 2. Create Base Scenario
  const scenarioName = 'Baseline Plan'
  let scenario = await prisma.scenario.findFirst({ where: { name: scenarioName } })
  
  if (!scenario) {
    scenario = await prisma.scenario.create({
      data: {
        name: scenarioName,
        description: 'Initial import from Excel',
        isBase: true,
        assumptions: {
          create: [
            { key: 'inflation_rate', value: 0.03 },
            { key: 'cooling_overhead', value: 1.35 }
          ]
        },
        sites: {
          create: [
            { name: 'BayView', powerLimitMw: 50, baselinePowerMw: 10 },
            { name: 'Mt. Wash', powerLimitMw: 30, baselinePowerMw: 5 },
            { name: 'Bloomberg', powerLimitMw: 20, baselinePowerMw: 2 }
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
