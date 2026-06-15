import { z } from "zod";

// ──────────────────────────────────────────────
// Prisma Quarter format: "2025-Q1", "2026-Q4"
// ──────────────────────────────────────────────
const QuarterSchema = z
  .string()
  .regex(/^\d{4}-Q[1-4]$/, "Quarter must be in YYYY-Q# format (e.g. 2025-Q3)");

// ──────────────────────────────────────────────
// CatalogItem schemas
// ──────────────────────────────────────────────

const CatalogItemBaseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be 50 characters or less"),
  model: z.string().max(100, "Model must be 100 characters or less").optional().nullable(),
  vendor: z.string().max(100, "Vendor must be 100 characters or less").optional().nullable(),
  powerKw: z
    .number()
    .positive("Power must be greater than 0")
    .max(1000, "Power must be 1000 kW or less"),
  cost: z
    .number()
    .nonnegative("Cost cannot be negative"),
  capacityType: z
    .string()
    .max(50, "Capacity type must be 50 characters or less")
    .optional()
    .nullable(),
  capacityVal: z
    .number()
    .positive("Capacity value must be greater than 0")
    .max(10000, "Capacity value must be 10000 or less")
    .optional()
    .nullable(),
  liquidCoolingCapacityKw: z
    .number()
    .nonnegative("Liquid cooling capacity cannot be negative")
    .max(10000, "Liquid cooling capacity must be 10000 kW or less")
    .optional()
    .nullable(),
  airCoolingCapacityKw: z
    .number()
    .nonnegative("Air cooling capacity cannot be negative")
    .max(10000, "Air cooling capacity must be 10000 kW or less")
    .optional()
    .nullable(),
  electricalCapacityKw: z
    .number()
    .nonnegative("Electrical capacity cannot be negative")
    .max(10000, "Electrical capacity must be 10000 kW or less")
    .optional()
    .nullable(),
});

export const CreateCatalogItemSchema = CatalogItemBaseSchema;

export const UpdateCatalogItemSchema = CatalogItemBaseSchema.partial({
  name: true,
  category: true,
});

// ──────────────────────────────────────────────
// Scenario schemas
// ──────────────────────────────────────────────

export const CreateScenarioSchema = z.object({
  name: z
    .string()
    .min(1, "Scenario name is required")
    .max(255, "Name must be 255 characters or less"),
  description: z.string().max(2000, "Description must be 2000 characters or less").optional(),
  isBase: z.boolean().optional().default(false),
  horizonStart: QuarterSchema,
  horizonEnd: QuarterSchema,
  cloneFromId: z.string().uuid("Source scenario ID must be a valid UUID").optional().nullable(),
}).refine(
  (data) => {
    if (data.horizonStart && data.horizonEnd) {
      return data.horizonStart <= data.horizonEnd;
    }
    return true;
  },
  {
    message: "Horizon end quarter must be on or after the start quarter",
    path: ["horizonEnd"],
  }
);

export const UpdateScenarioSchema = z.object({
  name: z
    .string()
    .min(1, "Scenario name is required")
    .max(255, "Name must be 255 characters or less")
    .optional(),
  description: z.string().max(2000, "Description must be 2000 characters or less").optional().nullable(),
  isBase: z.boolean().optional(),
  horizonStart: QuarterSchema.optional(),
  horizonEnd: QuarterSchema.optional(),
}).refine(
  (data) => {
    if (data.horizonStart && data.horizonEnd) {
      return data.horizonStart <= data.horizonEnd;
    }
    return true;
  },
  {
    message: "Horizon end quarter must be on or after the start quarter",
    path: ["horizonEnd"],
  }
);

export const DeleteScenariosSchema = z.object({
  ids: z.array(z.string().uuid("Each scenario ID must be a valid UUID")).min(1, "At least one scenario ID is required"),
});

// ──────────────────────────────────────────────
// Site schemas
// ──────────────────────────────────────────────

export const CreateSiteSchema = z.object({
  name: z
    .string()
    .min(1, "Site name is required")
    .max(255, "Name must be 255 characters or less"),
  totalItCapacityMw: z
    .number()
    .positive("Total IT capacity must be greater than 0")
    .max(1000, "Total IT capacity must be 1000 MW or less"),
  electricalCapacityMw: z
    .number()
    .positive("Electrical capacity must be greater than 0")
    .max(1000, "Electrical capacity must be 1000 MW or less"),
  electricityRatePerKwh: z
    .number()
    .nonnegative("Electricity rate cannot be negative")
    .max(10, "Electricity rate must be $10/kWh or less"),
  totalRackSpaceU: z
    .number()
    .int("Rack space must be a whole number")
    .positive("Rack space must be greater than 0")
    .max(100000, "Rack space must be 100000 U or less"),
});

export const UpdateSiteSettingsSchema = z.object({
  totalItCapacityMw: z
    .number()
    .positive("Total IT capacity must be greater than 0")
    .max(1000, "Total IT capacity must be 1000 MW or less")
    .optional(),
  electricalCapacityMw: z
    .number()
    .positive("Electrical capacity must be greater than 0")
    .max(1000, "Electrical capacity must be 1000 MW or less")
    .optional(),
  electricityRatePerKwh: z
    .number()
    .nonnegative("Electricity rate cannot be negative")
    .max(10, "Electricity rate must be $10/kWh or less")
    .optional(),
  totalRackSpaceU: z
    .number()
    .int("Rack space must be a whole number")
    .positive("Rack space must be greater than 0")
    .max(100000, "Rack space must be 100000 U or less")
    .optional(),
  baselineItPowerMw: z
    .number()
    .nonnegative("Baseline IT power cannot be negative")
    .max(1000, "Baseline IT power must be 1000 MW or less")
    .optional()
    .nullable(),
  baselineMechanicalMw: z
    .number()
    .nonnegative("Baseline mechanical power cannot be negative")
    .max(1000, "Baseline mechanical power must be 1000 MW or less")
    .optional()
    .nullable(),
  baselineLiquidCoolingKw: z
    .number()
    .nonnegative("Baseline liquid cooling cannot be negative")
    .max(10000, "Baseline liquid cooling must be 10000 kW or less")
    .optional()
    .nullable(),
  baselineAirCoolingKw: z
    .number()
    .nonnegative("Baseline air cooling cannot be negative")
    .max(10000, "Baseline air cooling must be 10000 kW or less")
    .optional()
    .nullable(),
  baselineElectricalKw: z
    .number()
    .nonnegative("Baseline electrical power cannot be negative")
    .max(10000, "Baseline electrical power must be 10000 kW or less")
    .optional()
    .nullable(),
});

export const DeleteSiteSchema = z.object({
  id: z.string().uuid("Site ID must be a valid UUID"),
});

// ──────────────────────────────────────────────
// LineItem schemas
// ──────────────────────────────────────────────

export const AddLineItemSchema = z.object({
  siteId: z.string().uuid("Site ID must be a valid UUID"),
  catalogItemId: z.string().uuid("Catalog item ID must be a valid UUID"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0")
    .max(100000, "Quantity must be 100000 or less"),
  startQuarter: QuarterSchema,
  endQuarter: QuarterSchema.optional().nullable(),
  projectTag: z
    .string()
    .max(50, "Project tag must be 50 characters or less")
    .optional()
    .nullable(),
}).refine(
  (data) => {
    if (data.endQuarter && data.startQuarter) {
      return data.startQuarter <= data.endQuarter;
    }
    return true;
  },
  {
    message: "End quarter must be on or after the start quarter",
    path: ["endQuarter"],
  }
);

export const UpdateLineItemSchema = z.object({
  catalogItemId: z.string().uuid("Catalog item ID must be a valid UUID").optional(),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0")
    .max(100000, "Quantity must be 100000 or less")
    .optional(),
  startQuarter: QuarterSchema.optional(),
  endQuarter: QuarterSchema.optional().nullable(),
  projectTag: z
    .string()
    .max(50, "Project tag must be 50 characters or less")
    .optional()
    .nullable(),
}).refine(
  (data) => {
    if (data.endQuarter && data.startQuarter) {
      return data.startQuarter <= data.endQuarter;
    }
    return true;
  },
  {
    message: "End quarter must be on or after the start quarter",
    path: ["endQuarter"],
  }
);

export const DeleteLineItemSchema = z.object({
  id: z.string().uuid("Line item ID must be a valid UUID"),
});

// ──────────────────────────────────────────────
// Assumption schemas
// ──────────────────────────────────────────────

export const UpdateScenarioAssumptionsSchema = z.object({
  scenarioId: z.string().uuid("Scenario ID must be a valid UUID"),
  coolingOverhead: z
    .number()
    .min(0, "Cooling overhead must be 0 or greater")
    .max(2, "Cooling overhead must be 2.0 or less (PCR ratio)"),
  inflationRate: z
    .number()
    .min(-1, "Inflation rate must be greater than -100%")
    .max(1, "Inflation rate must be less than 100%"),
});

// ──────────────────────────────────────────────
// ScenarioActual schemas
// ──────────────────────────────────────────────

export const UpdateActualsSchema = z.object({
  scenarioId: z.string().uuid("Scenario ID must be a valid UUID"),
  actualQuarter: QuarterSchema,
  actualItPowerMw: z
    .number()
    .nonnegative("Actual IT power cannot be negative")
    .max(1000, "Actual IT power must be 1000 MW or less")
    .optional()
    .nullable(),
  actualMechanicalMw: z
    .number()
    .nonnegative("Actual mechanical power cannot be negative")
    .max(1000, "Actual mechanical power must be 1000 MW or less")
    .optional()
    .nullable(),
  actualLiquidCoolingKw: z
    .number()
    .nonnegative("Actual liquid cooling cannot be negative")
    .max(10000, "Actual liquid cooling must be 10000 kW or less")
    .optional()
    .nullable(),
  actualAirCoolingKw: z
    .number()
    .nonnegative("Actual air cooling cannot be negative")
    .max(10000, "Actual air cooling must be 10000 kW or less")
    .optional()
    .nullable(),
  actualElectricalKw: z
    .number()
    .nonnegative("Actual electrical power cannot be negative")
    .max(10000, "Actual electrical power must be 10000 kW or less")
    .optional()
    .nullable(),
  actualEndQuarter: QuarterSchema.optional().nullable(),
  actualQuantity: z
    .number()
    .int("Actual quantity must be a whole number")
    .nonnegative("Actual quantity cannot be negative")
    .optional()
    .nullable(),
  varianceNotes: z
    .string()
    .max(1000, "Variance notes must be 1000 characters or less")
    .optional()
    .nullable(),
});

// ──────────────────────────────────────────────
// Bulk delete helpers
// ──────────────────────────────────────────────

export const DeleteCatalogItemsSchema = z.object({
  ids: z
    .array(z.string().uuid("Each catalog item ID must be a valid UUID"))
    .min(1, "At least one catalog item ID is required"),
});

// ──────────────────────────────────────────────
// FormData → schema parsers (for actions that
// accept FormData directly, e.g. createScenario
// from <form> submissions)
// ──────────────────────────────────────────────

export function parseCreateScenarioFormData(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    isBase: formData.get("isBase") === "on" || formData.get("isBase") === "true",
    horizonStart: formData.get("horizonStart") as string,
    horizonEnd: formData.get("horizonEnd") as string,
    cloneFromId: (formData.get("cloneFromId") as string) || null,
  };
  return CreateScenarioSchema.parse(raw);
}

export function parseAddLineItemFormData(formData: FormData, siteId: string) {
  const raw = {
    siteId,
    catalogItemId: formData.get("catalogItemId") as string,
    quantity: parseFloat(formData.get("quantity") as string),
    startQuarter: formData.get("startQuarter") as string,
    endQuarter: (formData.get("endQuarter") as string) || null,
    projectTag: (formData.get("projectTag") as string) || null,
  };
  return AddLineItemSchema.parse(raw);
}

// ──────────────────────────────────────────────
// Inferred output types (for use in return
// type annotations or React form defaults)
// ──────────────────────────────────────────────

export type CreateCatalogItemInput = z.infer<typeof CreateCatalogItemSchema>;
export type UpdateCatalogItemInput = z.infer<typeof UpdateCatalogItemSchema>;
export type CreateScenarioInput = z.infer<typeof CreateScenarioSchema>;
export type UpdateScenarioInput = z.infer<typeof UpdateScenarioSchema>;
export type CreateSiteInput = z.infer<typeof CreateSiteSchema>;
export type UpdateSiteSettingsInput = z.infer<typeof UpdateSiteSettingsSchema>;
export type AddLineItemInput = z.infer<typeof AddLineItemSchema>;
export type UpdateLineItemInput = z.infer<typeof UpdateLineItemSchema>;
export type UpdateScenarioAssumptionsInput = z.infer<typeof UpdateScenarioAssumptionsSchema>;
export type UpdateActualsInput = z.infer<typeof UpdateActualsSchema>;
