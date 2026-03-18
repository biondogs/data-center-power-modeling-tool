module.exports = [
"[project]/NonSync/Power Modeling Tool/app/favicon.ico.mjs { IMAGE => \"[project]/NonSync/Power Modeling Tool/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/NonSync/Power Modeling Tool/app/favicon.ico.mjs { IMAGE => \"[project]/NonSync/Power Modeling Tool/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/NonSync/Power Modeling Tool/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/NonSync/Power Modeling Tool/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/NonSync/Power Modeling Tool/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/NonSync/Power Modeling Tool/node_modules/@prisma/client)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: [
        "query"
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/NonSync/Power Modeling Tool/lib/services/data.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCatalogItems",
    ()=>getCatalogItems,
    "getScenarioById",
    ()=>getScenarioById,
    "getScenarios",
    ()=>getScenarios
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/db.ts [app-rsc] (ecmascript)");
;
async function getCatalogItems() {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].catalogItem.findMany({
        orderBy: {
            name: 'asc'
        }
    });
}
async function getScenarios() {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].scenario.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            sites: {
                include: {
                    lineItems: {
                        include: {
                            catalogItem: true
                        }
                    }
                }
            },
            assumptions: true,
            _count: {
                select: {
                    sites: true
                }
            }
        }
    });
}
async function getScenarioById(id) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].scenario.findUnique({
        where: {
            id
        },
        include: {
            sites: {
                include: {
                    lineItems: {
                        include: {
                            catalogItem: true
                        }
                    }
                }
            },
            assumptions: true
        }
    });
}
}),
"[project]/NonSync/Power Modeling Tool/lib/engine/time.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TimeUtils",
    ()=>TimeUtils
]);
class TimeUtils {
    static parse(quarterStr) {
        // Expects "2024-Q1" or "2024Q1"
        const cleaned = quarterStr.replace("-", "").toUpperCase();
        const match = cleaned.match(/^(\d{4})Q(\d)$/);
        if (!match) {
            throw new Error(`Invalid quarter format: ${quarterStr}`);
        }
        return {
            year: parseInt(match[1]),
            q: parseInt(match[2])
        };
    }
    static format(q) {
        return `${q.year}Q${q.q}`;
    }
    static toIndex(q) {
        const { year, q: quarter } = typeof q === "string" ? TimeUtils.parse(q) : q;
        return year * 4 + (quarter - 1);
    }
    static fromIndex(idx) {
        const year = Math.floor(idx / 4);
        const q = idx % 4 + 1;
        return TimeUtils.format({
            year,
            q
        });
    }
    static diff(q1, q2) {
        return TimeUtils.toIndex(q2) - TimeUtils.toIndex(q1);
    }
    static add(q, quarters) {
        return TimeUtils.fromIndex(TimeUtils.toIndex(q) + quarters);
    }
    static generateRange(start, end) {
        const sIdx = TimeUtils.toIndex(start);
        const eIdx = TimeUtils.toIndex(end);
        const range = [];
        for(let i = sIdx; i <= eIdx; i++){
            range.push(TimeUtils.fromIndex(i));
        }
        return range;
    }
}
}),
"[project]/NonSync/Power Modeling Tool/lib/engine/projector.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Projector",
    ()=>Projector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/engine/time.ts [app-rsc] (ecmascript)");
;
class Projector {
    /**
     * Projects a single line item over the horizon
     * Returns quarterly breakdown of power, capex, capacity
     */ static projectLineItem(item, settings) {
        const quarters = __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TimeUtils"].generateRange(settings.horizonStart, settings.horizonEnd);
        // Determine lifecycle based on start/end quarters
        const startIdx = __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TimeUtils"].toIndex(item.startQuarter);
        const endIdx = item.endQuarter ? __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TimeUtils"].toIndex(item.endQuarter) : __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TimeUtils"].toIndex(settings.horizonEnd) + 100; // Indefinite (extends beyond horizon)
        return quarters.map((q)=>{
            const currentIdx = __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TimeUtils"].toIndex(q);
            const isActive = currentIdx >= startIdx && currentIdx < endIdx;
            // Is this the first quarter of deployment? (For Capex calculation)
            const isDeploymentQuarter = currentIdx === startIdx;
            // Values
            const activeUnits = isActive ? item.quantity : 0;
            // --- Calculations matching Excel formulas ---
            // Power = units * kW_per_unit / 1000 (to get MW)
            // Excel formula: `=I*G/1000` where I=qty, G=powerKw
            const powerMw = activeUnits * item.catalogItem.powerKw / 1000;
            // Capex = units * cost_per_unit (only in deployment quarter)
            // Excel: Capex hit only when equipment first arrives
            const capex = isDeploymentQuarter ? item.quantity * item.catalogItem.cost : 0;
            // Opex placeholder - calculated at aggregation level with rates
            const opex = 0;
            // Capacity tracking
            const capacityVal = activeUnits * (item.catalogItem.capacityVal || 0);
            return {
                quarter: q,
                activeUnits,
                powerMw,
                capex,
                opex,
                capacity: {
                    type: item.catalogItem.capacityType,
                    value: capacityVal
                },
                projectTag: item.projectTag || undefined
            };
        });
    }
}
}),
"[project]/NonSync/Power Modeling Tool/lib/engine/aggregator.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Aggregator",
    ()=>Aggregator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$projector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/engine/projector.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/engine/time.ts [app-rsc] (ecmascript)");
;
;
class Aggregator {
    /**
     * Aggregates power and cost projections for a site across all quarters
     * Matches the Excel calculation logic from the reference spreadsheet
     */ static aggregateSite(site, assumptions, settings) {
        const quarters = __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TimeUtils"].generateRange(settings.horizonStart, settings.horizonEnd);
        // Resolve Global Assumptions
        const coolingOverhead = assumptions.find((a)=>a.key === 'cooling_overhead')?.value || 1.35;
        const inflationRate = assumptions.find((a)=>a.key === 'inflation_rate')?.value || 0.10;
        // Site-specific electricity rate (from Excel Power Blocks sheet columns P-Q)
        const baseRate = site.electricityRatePerKwh || 0.10;
        const siteInflation = site.inflationRate || inflationRate;
        // Site capacity limits (from Excel Baseline Power sheet)
        const totalCapacity = site.totalItCapacityMw || 0;
        const baselineIt = site.baselineItPowerMw || 0;
        // Calculate available power for new deployments
        // This is: Total capacity - baseline load
        const availableForNewDeployments = totalCapacity - baselineIt;
        // Project all line items independently
        const projections = site.lineItems.map((li)=>__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$projector$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Projector"].projectLineItem(li, settings));
        // Track cumulative inflation by year
        let currentRate = baseRate;
        return quarters.map((q, idx)=>{
            const qObj = __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TimeUtils"].parse(q);
            // Check if this is start of a new year (Q1) and idx > 0, then apply inflation
            if (qObj.q === 1 && idx > 0) {
                currentRate = baseRate * Math.pow(1 + siteInflation, qObj.year - __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TimeUtils"].parse(quarters[0]).year);
            }
            // 1. Sum raw metrics from all deployed equipment
            let itPowerMw = 0;
            let capex = 0;
            const capacity = {};
            const projectBreakdown = {};
            for (const proj of projections){
                const point = proj.find((p)=>p.quarter === q);
                if (point) {
                    itPowerMw += point.powerMw;
                    capex += point.capex;
                    // Track capacity
                    if (point.capacity.type) {
                        capacity[point.capacity.type] = (capacity[point.capacity.type] || 0) + point.capacity.value;
                    }
                    // Track project breakdown
                    if (point.projectTag) {
                        if (!projectBreakdown[point.projectTag]) {
                            projectBreakdown[point.projectTag] = {
                                powerMw: 0,
                                capex: 0,
                                quantity: 0
                            };
                        }
                        projectBreakdown[point.projectTag].powerMw += point.powerMw;
                        if (point.capex > 0) {
                            projectBreakdown[point.projectTag].capex += point.capex;
                        }
                        projectBreakdown[point.projectTag].quantity += point.activeUnits;
                    }
                }
            }
            // Calculate totals with baseline
            const totalItPowerMw = itPowerMw + baselineIt;
            // Cooling overhead calculation (from Excel)
            // Mechanical load = (total IT power) * (cooling overhead - 1)
            // Example: If overhead is 1.35 and IT is 10MW, mechanical = 3.5MW
            const adjustedPowerMw = totalItPowerMw * coolingOverhead;
            const mechanicalLoadMw = adjustedPowerMw - totalItPowerMw;
            // Total facility power
            const totalFacilityPowerMw = adjustedPowerMw;
            // Available vs used power for new deployments
            const usedPowerMw = itPowerMw; // Only new deployments (not baseline)
            const remainingPowerMw = availableForNewDeployments - usedPowerMw;
            // Hourly calculation for utility cost
            // Excel uses: Hours in quarter = 24 * 365.25 / 4 ≈ 2191.5
            const hoursPerQuarter = 24 * 365.25 / 4;
            // Utility cost = (adjusted power MW * 1000 kW/MW) * hours * rate
            const energyKwh = adjustedPowerMw * 1000 * hoursPerQuarter;
            const utilityCost = energyKwh * currentRate;
            return {
                quarter: q,
                year: qObj.year,
                quarterNum: qObj.q,
                itPowerMw,
                baselineItPowerMw: baselineIt,
                totalItPowerMw,
                adjustedPowerMw,
                mechanicalLoadMw,
                totalFacilityPowerMw,
                availablePowerMw: availableForNewDeployments,
                usedPowerMw,
                remainingPowerMw,
                electricityRatePerKwh: currentRate,
                utilityCost,
                capex,
                capacity,
                projectBreakdown: Object.keys(projectBreakdown).length > 0 ? projectBreakdown : undefined
            };
        });
    }
    /**
     * Calculate summary statistics across all quarters
     */ static calculateSummary(projections) {
        if (projections.length === 0) {
            return {
                peakPowerMw: 0,
                peakAdjustedPowerMw: 0,
                totalCapex: 0,
                totalUtilityCost: 0,
                maxGpuCount: 0
            };
        }
        return {
            peakPowerMw: Math.max(...projections.map((p)=>p.totalItPowerMw)),
            peakAdjustedPowerMw: Math.max(...projections.map((p)=>p.adjustedPowerMw)),
            totalCapex: projections.reduce((sum, p)=>sum + p.capex, 0),
            totalUtilityCost: projections.reduce((sum, p)=>sum + p.utilityCost, 0),
            maxGpuCount: Math.max(...projections.map((p)=>p.capacity['GPU'] || 0))
        };
    }
}
}),
"[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardSummary.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardSummary",
    ()=>DashboardSummary
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardSummary() from the server but DashboardSummary is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardSummary.tsx <module evaluation>", "DashboardSummary");
}),
"[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardSummary.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardSummary",
    ()=>DashboardSummary
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardSummary() from the server but DashboardSummary is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardSummary.tsx", "DashboardSummary");
}),
"[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardSummary.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$DashboardSummary$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardSummary.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$DashboardSummary$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardSummary.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$DashboardSummary$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/NonSync/Power Modeling Tool/components/dashboard/ScenarioAggregateChart.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScenarioAggregateChart",
    ()=>ScenarioAggregateChart
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ScenarioAggregateChart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ScenarioAggregateChart() from the server but ScenarioAggregateChart is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/NonSync/Power Modeling Tool/components/dashboard/ScenarioAggregateChart.tsx <module evaluation>", "ScenarioAggregateChart");
}),
"[project]/NonSync/Power Modeling Tool/components/dashboard/ScenarioAggregateChart.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScenarioAggregateChart",
    ()=>ScenarioAggregateChart
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ScenarioAggregateChart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ScenarioAggregateChart() from the server but ScenarioAggregateChart is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/NonSync/Power Modeling Tool/components/dashboard/ScenarioAggregateChart.tsx", "ScenarioAggregateChart");
}),
"[project]/NonSync/Power Modeling Tool/components/dashboard/ScenarioAggregateChart.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$ScenarioAggregateChart$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/dashboard/ScenarioAggregateChart.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$ScenarioAggregateChart$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/dashboard/ScenarioAggregateChart.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$ScenarioAggregateChart$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/NonSync/Power Modeling Tool/components/ui/card.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/utils.ts [app-rsc] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/NonSync/Power Modeling Tool/components/ui/button.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/@radix-ui/react-slot/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/class-variance-authority/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        "data-variant": variant,
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/NonSync/Power Modeling Tool/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$services$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/services/data.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$aggregator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/engine/aggregator.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$DashboardSummary$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardSummary.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$ScenarioAggregateChart$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/dashboard/ScenarioAggregateChart.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-rsc] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-rsc] (ecmascript) <export default as FileSpreadsheet>");
;
;
;
;
;
;
;
;
;
const dynamic = "force-dynamic";
async function DashboardPage() {
    const scenarios = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$services$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getScenarios"])();
    const catalogItems = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$services$2f$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCatalogItems"])();
    const horizon = {
        horizonStart: "2024Q1",
        horizonEnd: "2026Q4"
    };
    const scenarioProjections = {};
    for (const scenario of scenarios){
        const allSiteProjections = [];
        for (const site of scenario.sites){
            const siteProjections = __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$engine$2f$aggregator$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Aggregator"].aggregateSite(site, scenario.assumptions, horizon);
            allSiteProjections.push(...siteProjections);
        }
        const aggregatedByQuarter = aggregateByQuarter(allSiteProjections);
        scenarioProjections[scenario.id] = {
            name: scenario.name,
            projections: aggregatedByQuarter
        };
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl font-bold tracking-tight",
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground mt-2",
                                children: "Aggregate view of all scenarios - power, costs, and capacity across all sites."
                            }, void 0, false, {
                                fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/scenarios",
                            children: [
                                "Manage Scenarios ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                    className: "ml-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 30
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$DashboardSummary$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DashboardSummary"], {
                scenarioProjections: scenarioProjections
            }, void 0, false, {
                fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 lg:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$ScenarioAggregateChart$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ScenarioAggregateChart"], {
                        scenarioProjections: scenarioProjections
                    }, void 0, false, {
                        fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        children: "Quick Access"
                                    }, void 0, false, {
                                        fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                        lineNumber: 66,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                                        children: "Navigate to your scenarios and catalog"
                                    }, void 0, false, {
                                        fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                        lineNumber: 67,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "space-y-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/scenarios",
                                            className: "block",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                                                className: "hover:bg-muted/50 transition-colors cursor-pointer",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    className: "p-4 flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "p-2 bg-primary/10 rounded-md",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                                        className: "h-5 w-5 text-primary"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                                        lineNumber: 76,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                                    lineNumber: 75,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-medium",
                                                                            children: "Scenarios"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                                            lineNumber: 79,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm text-muted-foreground",
                                                                            children: [
                                                                                scenarios.length,
                                                                                " scenario",
                                                                                scenarios.length !== 1 ? 's' : '',
                                                                                " configured"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                                            lineNumber: 80,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                                    lineNumber: 78,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                            lineNumber: 74,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                            className: "h-4 w-4 text-muted-foreground"
                                                        }, void 0, false, {
                                                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                            lineNumber: 85,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                    lineNumber: 73,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                lineNumber: 72,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/catalog",
                                            className: "block",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                                                className: "hover:bg-muted/50 transition-colors cursor-pointer",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    className: "p-4 flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "p-2 bg-primary/10 rounded-md",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                                        className: "h-5 w-5 text-primary"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                                        lineNumber: 95,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                                    lineNumber: 94,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-medium",
                                                                            children: "Hardware Catalog"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                                            lineNumber: 98,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm text-muted-foreground",
                                                                            children: [
                                                                                catalogItems.length,
                                                                                " item",
                                                                                catalogItems.length !== 1 ? 's' : '',
                                                                                " available"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                                            lineNumber: 99,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                                    lineNumber: 97,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                            lineNumber: 93,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                            className: "h-4 w-4 text-muted-foreground"
                                                        }, void 0, false, {
                                                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                            lineNumber: 104,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                                lineNumber: 91,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
function aggregateByQuarter(projections) {
    const byQuarter = new Map();
    for (const proj of projections){
        if (byQuarter.has(proj.quarter)) {
            const existing = byQuarter.get(proj.quarter);
            existing.itPowerMw += proj.itPowerMw;
            existing.totalItPowerMw += proj.totalItPowerMw;
            existing.adjustedPowerMw += proj.adjustedPowerMw;
            existing.mechanicalLoadMw += proj.mechanicalLoadMw;
            existing.totalFacilityPowerMw += proj.totalFacilityPowerMw;
            existing.usedPowerMw += proj.usedPowerMw;
            existing.remainingPowerMw += proj.remainingPowerMw;
            existing.utilityCost += proj.utilityCost;
            existing.capex += proj.capex;
            for (const [key, value] of Object.entries(proj.capacity)){
                existing.capacity[key] = (existing.capacity[key] || 0) + value;
            }
        } else {
            byQuarter.set(proj.quarter, {
                ...proj
            });
        }
    }
    return Array.from(byQuarter.values()).sort((a, b)=>a.quarter.localeCompare(b.quarter));
}
}),
"[project]/NonSync/Power Modeling Tool/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/NonSync/Power Modeling Tool/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f5c03f50._.js.map