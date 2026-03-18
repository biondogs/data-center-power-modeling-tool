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
"[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardView.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardView",
    ()=>DashboardView
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardView() from the server but DashboardView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardView.tsx <module evaluation>", "DashboardView");
}),
"[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardView.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardView",
    ()=>DashboardView
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DashboardView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DashboardView() from the server but DashboardView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardView.tsx", "DashboardView");
}),
"[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardView.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$DashboardView$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardView.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$DashboardView$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardView.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$DashboardView$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$DashboardView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/dashboard/DashboardView.tsx [app-rsc] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$dashboard$2f$DashboardView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DashboardView"], {
        scenarios: scenarios,
        catalogItems: catalogItems,
        scenarioProjections: scenarioProjections
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/app/page.tsx",
        lineNumber: 39,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__19bb2397._.js.map