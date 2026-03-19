-- CreateTable
CREATE TABLE "CatalogItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "model" TEXT,
    "vendor" TEXT,
    "powerKw" REAL NOT NULL,
    "cost" REAL NOT NULL,
    "capacityType" TEXT,
    "capacityVal" REAL,
    "liquidCoolingCapacityKw" REAL,
    "airCoolingCapacityKw" REAL,
    "rackSpaceU" INTEGER,
    "electricalCapacityKw" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isBase" BOOLEAN NOT NULL DEFAULT false,
    "horizonStart" TEXT NOT NULL DEFAULT '2024Q1',
    "horizonEnd" TEXT NOT NULL DEFAULT '2026Q4',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalItCapacityMw" REAL NOT NULL DEFAULT 0,
    "electricalCapacityMw" REAL NOT NULL DEFAULT 0,
    "liquidCoolingCapacityKw" REAL NOT NULL DEFAULT 0,
    "airCoolingCapacityKw" REAL NOT NULL DEFAULT 0,
    "totalRackSpaceU" INTEGER NOT NULL DEFAULT 0,
    "usedRackSpaceU" INTEGER NOT NULL DEFAULT 0,
    "electricityRatePerKwh" REAL NOT NULL DEFAULT 0.10,
    "electricityRatePerKwy" REAL,
    "inflationRate" REAL NOT NULL DEFAULT 0.10,
    "baselineItPowerMw" REAL NOT NULL DEFAULT 0,
    "baselineMechanicalMw" REAL NOT NULL DEFAULT 0,
    "baselineLiquidCoolingKw" REAL NOT NULL DEFAULT 0,
    "baselineAirCoolingKw" REAL NOT NULL DEFAULT 0,
    "baselineElectricalKw" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "Site_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LineItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "projectTag" TEXT,
    "startQuarter" TEXT NOT NULL,
    "endQuarter" TEXT,
    "quantity" INTEGER NOT NULL,
    "actualStartQuarter" TEXT,
    "actualEndQuarter" TEXT,
    "actualQuantity" INTEGER,
    "varianceNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LineItem_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LineItem_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Assumption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" REAL NOT NULL,
    CONSTRAINT "Assumption_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CatalogItem_name_key" ON "CatalogItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Site_scenarioId_name_key" ON "Site"("scenarioId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Assumption_scenarioId_key_key" ON "Assumption"("scenarioId", "key");
