module.exports = [
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
"[project]/NonSync/Power Modeling Tool/lib/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"405bb359627df51c662de0127fc3f8e88ba46ada78":"deleteScenario","406f2d6bc9858efe210b678bf907d8fd0440c479eb":"createCatalogItem","40730866b3d2ed13c42d9f3b4c7792ad45c44f5723":"deleteLineItem","40d5f3e3e24a11e7fb0d3312dd34cf274f4c4d2c62":"deleteCatalogItem","40e3498d754b95548ebd4754d72e701828f1661f97":"createScenario","6039fd841f65d0ffde93b46c8679b62870416523c8":"updateLineItem","6065e9c13da4cd6c3f2c786641a89d6a54bdb20caa":"addLineItem","6080443137c220cf4c83d8b005a7c2847c24c2e321":"updateScenarioAssumptions","60d61d66bed3d3516b2c0e80945f451c18dd2aee69":"updateCatalogItem","60e5b41cf9a11ee32a5f4d65149b01393e53c10b5d":"updateSiteSettings"},"",""] */ __turbopack_context__.s([
    "addLineItem",
    ()=>addLineItem,
    "createCatalogItem",
    ()=>createCatalogItem,
    "createScenario",
    ()=>createScenario,
    "deleteCatalogItem",
    ()=>deleteCatalogItem,
    "deleteLineItem",
    ()=>deleteLineItem,
    "deleteScenario",
    ()=>deleteScenario,
    "updateCatalogItem",
    ()=>updateCatalogItem,
    "updateLineItem",
    ()=>updateLineItem,
    "updateScenarioAssumptions",
    ()=>updateScenarioAssumptions,
    "updateSiteSettings",
    ()=>updateSiteSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function createScenario(formData) {
    const name = formData.get("name");
    const description = formData.get("description");
    const cloneFromId = formData.get("cloneFromId");
    if (!name) throw new Error("Name is required");
    let newScenario;
    if (cloneFromId) {
        // Deep copy logic
        const source = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].scenario.findUnique({
            where: {
                id: cloneFromId
            },
            include: {
                assumptions: true,
                sites: {
                    include: {
                        lineItems: true
                    }
                }
            }
        });
        if (!source) throw new Error("Source scenario not found");
        newScenario = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].scenario.create({
            data: {
                name: `${name} (Copy)`,
                description: description || source.description,
                isBase: false,
                horizonStart: source.horizonStart,
                horizonEnd: source.horizonEnd,
                assumptions: {
                    create: source.assumptions.map((a)=>({
                            key: a.key,
                            value: a.value
                        }))
                },
                sites: {
                    create: source.sites.map((s)=>({
                            name: s.name,
                            totalItCapacityMw: s.totalItCapacityMw,
                            electricalCapacityMw: s.electricalCapacityMw,
                            electricityRatePerKwh: s.electricityRatePerKwh,
                            inflationRate: s.inflationRate,
                            baselineItPowerMw: s.baselineItPowerMw,
                            baselineMechanicalMw: s.baselineMechanicalMw,
                            lineItems: {
                                create: s.lineItems.map((li)=>({
                                        catalogItemId: li.catalogItemId,
                                        projectTag: li.projectTag,
                                        startQuarter: li.startQuarter,
                                        endQuarter: li.endQuarter,
                                        quantity: li.quantity
                                    }))
                            }
                        }))
                }
            }
        });
    } else {
        newScenario = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].scenario.create({
            data: {
                name,
                description,
                isBase: false,
                horizonStart: '2024Q1',
                horizonEnd: '2026Q4',
                assumptions: {
                    create: [
                        {
                            key: 'inflation_rate',
                            value: 0.10
                        },
                        {
                            key: 'cooling_overhead',
                            value: 1.35
                        }
                    ]
                },
                sites: {
                    create: [
                        {
                            name: 'BayView',
                            totalItCapacityMw: 12,
                            electricityRatePerKwh: 0.10,
                            inflationRate: 0.10
                        },
                        {
                            name: 'Mt.Wash',
                            totalItCapacityMw: 1.05,
                            electricityRatePerKwh: 0.0755,
                            inflationRate: 0.0
                        },
                        {
                            name: 'Bloomberg',
                            totalItCapacityMw: 1.2,
                            electricityRatePerKwh: 0.10,
                            inflationRate: 0.10
                        }
                    ]
                }
            }
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/scenarios/${newScenario.id}`);
}
async function addLineItem(siteId, data) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lineItem.create({
        data: {
            siteId,
            ...data
        }
    });
    const site = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].site.findUnique({
        where: {
            id: siteId
        }
    });
    if (site) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/scenarios/${site.scenarioId}`);
    }
}
async function updateLineItem(id, data) {
    const item = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lineItem.findUnique({
        where: {
            id
        }
    });
    if (!item) {
        throw new Error("Line item not found");
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lineItem.update({
        where: {
            id
        },
        data: {
            ...data.catalogItemId && {
                catalogItemId: data.catalogItemId
            },
            ...data.quantity !== undefined && {
                quantity: data.quantity
            },
            ...data.startQuarter && {
                startQuarter: data.startQuarter
            },
            ...data.endQuarter !== undefined && {
                endQuarter: data.endQuarter
            },
            ...data.projectTag !== undefined && {
                projectTag: data.projectTag
            }
        }
    });
    const site = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].site.findUnique({
        where: {
            id: item.siteId
        }
    });
    if (site) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/scenarios/${site.scenarioId}`);
    }
}
async function deleteLineItem(id) {
    const item = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lineItem.findUnique({
        where: {
            id
        }
    });
    if (item) {
        const site = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].site.findUnique({
            where: {
                id: item.siteId
            }
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].lineItem.delete({
            where: {
                id
            }
        });
        if (site) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/scenarios/${site.scenarioId}`);
        }
    }
}
async function createCatalogItem(data) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].catalogItem.create({
        data
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/catalog");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
}
async function updateCatalogItem(id, data) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].catalogItem.update({
        where: {
            id
        },
        data
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/catalog");
}
async function deleteCatalogItem(id) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].catalogItem.delete({
            where: {
                id
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/catalog");
    } catch (e) {
        console.error("Failed to delete catalog item", e);
        throw new Error("Cannot delete item that is currently in use by a scenario.");
    }
}
async function updateSiteSettings(siteId, data) {
    const site = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].site.update({
        where: {
            id: siteId
        },
        data
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/scenarios/${site.scenarioId}`);
}
async function updateScenarioAssumptions(scenarioId, data) {
    const scenario = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].scenario.findUnique({
        where: {
            id: scenarioId
        },
        include: {
            assumptions: true
        }
    });
    if (!scenario) throw new Error("Scenario not found");
    // Update or create cooling_overhead assumption
    const coolingAssumption = scenario.assumptions.find((a)=>a.key === 'cooling_overhead');
    if (coolingAssumption) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].assumption.update({
            where: {
                id: coolingAssumption.id
            },
            data: {
                value: data.coolingOverhead
            }
        });
    } else {
        await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].assumption.create({
            data: {
                scenarioId,
                key: 'cooling_overhead',
                value: data.coolingOverhead
            }
        });
    }
    // Update or create inflation_rate assumption
    const inflationAssumption = scenario.assumptions.find((a)=>a.key === 'inflation_rate');
    if (inflationAssumption) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].assumption.update({
            where: {
                id: inflationAssumption.id
            },
            data: {
                value: data.globalInflation
            }
        });
    } else {
        await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].assumption.create({
            data: {
                scenarioId,
                key: 'inflation_rate',
                value: data.globalInflation
            }
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/scenarios/${scenarioId}`);
}
async function deleteScenario(id) {
    // Check if scenario is protected (isBase scenarios cannot be deleted)
    const scenario = await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].scenario.findUnique({
        where: {
            id
        }
    });
    if (!scenario) {
        throw new Error("Scenario not found");
    }
    if (scenario.isBase) {
        throw new Error("Base scenarios cannot be deleted");
    }
    // Delete scenario and all related data (cascade will handle lineItems, sites, assumptions)
    await __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].scenario.delete({
        where: {
            id
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createScenario,
    addLineItem,
    updateLineItem,
    deleteLineItem,
    createCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    updateSiteSettings,
    updateScenarioAssumptions,
    deleteScenario
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createScenario, "40e3498d754b95548ebd4754d72e701828f1661f97", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addLineItem, "6065e9c13da4cd6c3f2c786641a89d6a54bdb20caa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateLineItem, "6039fd841f65d0ffde93b46c8679b62870416523c8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteLineItem, "40730866b3d2ed13c42d9f3b4c7792ad45c44f5723", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createCatalogItem, "406f2d6bc9858efe210b678bf907d8fd0440c479eb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCatalogItem, "60d61d66bed3d3516b2c0e80945f451c18dd2aee69", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCatalogItem, "40d5f3e3e24a11e7fb0d3312dd34cf274f4c4d2c62", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateSiteSettings, "60e5b41cf9a11ee32a5f4d65149b01393e53c10b5d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateScenarioAssumptions, "6080443137c220cf4c83d8b005a7c2847c24c2e321", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteScenario, "405bb359627df51c662de0127fc3f8e88ba46ada78", null);
}),
"[project]/NonSync/Power Modeling Tool/.next-internal/server/app/scenarios/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/NonSync/Power Modeling Tool/lib/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
}),
"[project]/NonSync/Power Modeling Tool/.next-internal/server/app/scenarios/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/NonSync/Power Modeling Tool/lib/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40730866b3d2ed13c42d9f3b4c7792ad45c44f5723",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteLineItem"],
    "6039fd841f65d0ffde93b46c8679b62870416523c8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateLineItem"],
    "6065e9c13da4cd6c3f2c786641a89d6a54bdb20caa",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addLineItem"],
    "6080443137c220cf4c83d8b005a7c2847c24c2e321",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateScenarioAssumptions"],
    "60e5b41cf9a11ee32a5f4d65149b01393e53c10b5d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSiteSettings"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f2e$next$2d$internal$2f$server$2f$app$2f$scenarios$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/NonSync/Power Modeling Tool/.next-internal/server/app/scenarios/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/NonSync/Power Modeling Tool/lib/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=NonSync_Power%20Modeling%20Tool_945216d0._.js.map