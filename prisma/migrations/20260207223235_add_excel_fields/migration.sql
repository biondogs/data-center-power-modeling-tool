/*
  Warnings:

  - You are about to drop the column `unitsPerBlock` on the `CatalogItem` table. All the data in the column will be lost.
  - You are about to drop the column `baselinePowerMw` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `powerLimitMw` on the `Site` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CatalogItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "model" TEXT,
    "vendor" TEXT,
    "powerKw" REAL NOT NULL,
    "cost" REAL NOT NULL,
    "capacityType" TEXT,
    "capacityVal" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CatalogItem" ("capacityType", "capacityVal", "category", "cost", "createdAt", "id", "model", "name", "powerKw", "updatedAt", "vendor") SELECT "capacityType", "capacityVal", "category", "cost", "createdAt", "id", "model", "name", "powerKw", "updatedAt", "vendor" FROM "CatalogItem";
DROP TABLE "CatalogItem";
ALTER TABLE "new_CatalogItem" RENAME TO "CatalogItem";
CREATE UNIQUE INDEX "CatalogItem_name_key" ON "CatalogItem"("name");
CREATE TABLE "new_Scenario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isBase" BOOLEAN NOT NULL DEFAULT false,
    "horizonStart" TEXT NOT NULL DEFAULT '2024Q1',
    "horizonEnd" TEXT NOT NULL DEFAULT '2026Q4',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Scenario" ("createdAt", "description", "id", "isBase", "name", "updatedAt") SELECT "createdAt", "description", "id", "isBase", "name", "updatedAt" FROM "Scenario";
DROP TABLE "Scenario";
ALTER TABLE "new_Scenario" RENAME TO "Scenario";
CREATE TABLE "new_Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalItCapacityMw" REAL NOT NULL DEFAULT 0,
    "mechanicalCapacityMw" REAL NOT NULL DEFAULT 0,
    "electricityRatePerKwh" REAL NOT NULL DEFAULT 0.10,
    "electricityRatePerKwy" REAL,
    "inflationRate" REAL NOT NULL DEFAULT 0.10,
    "baselineItPowerMw" REAL NOT NULL DEFAULT 0,
    "baselineMechanicalMw" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "Site_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Site" ("id", "name", "scenarioId") SELECT "id", "name", "scenarioId" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
CREATE UNIQUE INDEX "Site_scenarioId_name_key" ON "Site"("scenarioId", "name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
