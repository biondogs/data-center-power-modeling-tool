-- Migration: Add Multi-Dimensional Capacity Tracking
-- This migration adds support for tracking multiple capacity dimensions

-- Step 1: Add new columns to Site table
ALTER TABLE "Site" ADD COLUMN "electricalCapacityMw" REAL DEFAULT 0;
ALTER TABLE "Site" ADD COLUMN "liquidCoolingCapacityKw" REAL DEFAULT 0;
ALTER TABLE "Site" ADD COLUMN "airCoolingCapacityKw" REAL DEFAULT 0;
ALTER TABLE "Site" ADD COLUMN "totalRackSpaceU" INTEGER DEFAULT 0;
ALTER TABLE "Site" ADD COLUMN "usedRackSpaceU" INTEGER DEFAULT 0;
ALTER TABLE "Site" ADD COLUMN "baselineLiquidCoolingKw" REAL DEFAULT 0;
ALTER TABLE "Site" ADD COLUMN "baselineAirCoolingKw" REAL DEFAULT 0;
ALTER TABLE "Site" ADD COLUMN "baselineElectricalKw" REAL DEFAULT 0;

-- Step 2: Migrate existing data
-- Copy mechanicalCapacityMw to liquidCoolingCapacityKw (assumption: mechanical was liquid)
UPDATE "Site" SET "liquidCoolingCapacityKw" = "mechanicalCapacityMw" * 1000 WHERE "mechanicalCapacityMw" > 0;
UPDATE "Site" SET "electricalCapacityMw" = "totalItCapacityMw" * 1.2; -- 20% overhead default

-- Step 3: Set default rack space based on power capacity (rough approximation)
-- 10kW per rack, 42U per rack
UPDATE "Site" SET "totalRackSpaceU" = CAST("totalItCapacityMw" * 1000 / 10 * 42 AS INTEGER);
UPDATE "Site" SET "usedRackSpaceU" = CAST("baselineItPowerMw" * 1000 / 10 * 42 AS INTEGER);

-- Step 4: Add new columns to CatalogItem table
ALTER TABLE "CatalogItem" ADD COLUMN "liquidCoolingCapacityKw" REAL;
ALTER TABLE "CatalogItem" ADD COLUMN "airCoolingCapacityKw" REAL;
ALTER TABLE "CatalogItem" ADD COLUMN "rackSpaceU" INTEGER;
ALTER TABLE "CatalogItem" ADD COLUMN "electricalCapacityKw" REAL;

-- Step 5: Set default values for existing catalog items based on category
UPDATE "CatalogItem" SET "rackSpaceU" = 4 WHERE "category" = 'GPU';    -- 4U GPU servers
UPDATE "CatalogItem" SET "rackSpaceU" = 2 WHERE "category" = 'CPU';    -- 2U CPU servers
UPDATE "CatalogItem" SET "rackSpaceU" = 2 WHERE "category" = 'Storage'; -- 2U storage
UPDATE "CatalogItem" SET "rackSpaceU" = 1 WHERE "category" = 'Network'; -- 1U network

-- Set cooling based on power (rough approximation)
UPDATE "CatalogItem" SET
    "liquidCoolingCapacityKw" = CASE
        WHEN "powerKw" > 50 THEN "powerKw"  -- High power = liquid cooled
        ELSE 0
    END,
    "airCoolingCapacityKw" = CASE
        WHEN "powerKw" <= 50 THEN "powerKw"  -- Lower power = air cooled
        ELSE 0
    END;

-- NVL72 is liquid cooled
UPDATE "CatalogItem" SET "liquidCoolingCapacityKw" = 135, "airCoolingCapacityKw" = 0 WHERE "name" = 'NVL72';

-- Step 6: Drop old column (optional - keep for now to preserve data)
-- ALTER TABLE "Site" DROP COLUMN "mechanicalCapacityMw";
