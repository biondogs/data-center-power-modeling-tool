(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/NonSync/Power Modeling Tool/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
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
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        "data-variant": variant,
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
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
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Dialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Dialog;
function DialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = DialogTrigger;
function DialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = DialogPortal;
function DialogClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        "data-slot": "dialog-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_c3 = DialogClose;
function DialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c4 = DialogOverlay;
function DialogContent({ className, children, showCloseButton = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        "data-slot": "dialog-portal",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg", className),
                ...props,
                children: [
                    children,
                    showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        "data-slot": "dialog-close",
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                                fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c5 = DialogContent;
function DialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_c6 = DialogHeader;
function DialogFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c7 = DialogFooter;
function DialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_c8 = DialogTitle;
function DialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_c9 = DialogDescription;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Dialog");
__turbopack_context__.k.register(_c1, "DialogTrigger");
__turbopack_context__.k.register(_c2, "DialogPortal");
__turbopack_context__.k.register(_c3, "DialogClose");
__turbopack_context__.k.register(_c4, "DialogOverlay");
__turbopack_context__.k.register(_c5, "DialogContent");
__turbopack_context__.k.register(_c6, "DialogHeader");
__turbopack_context__.k.register(_c7, "DialogFooter");
__turbopack_context__.k.register(_c8, "DialogTitle");
__turbopack_context__.k.register(_c9, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/NonSync/Power Modeling Tool/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/NonSync/Power Modeling Tool/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Label;
;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/NonSync/Power Modeling Tool/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/utils.ts [app-client] (ecmascript)");
;
;
function Textarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        "data-slot": "textarea",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Textarea;
;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/NonSync/Power Modeling Tool/lib/data:3d69e2 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createScenario",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40e3498d754b95548ebd4754d72e701828f1661f97":"createScenario"},"NonSync/Power Modeling Tool/lib/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40e3498d754b95548ebd4754d72e701828f1661f97", __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createScenario");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIkAvbGliL2RiXCI7XG5pbXBvcnQgeyByZXZhbGlkYXRlUGF0aCB9IGZyb20gXCJuZXh0L2NhY2hlXCI7XG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gXCJuZXh0L25hdmlnYXRpb25cIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNjZW5hcmlvKGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICAgIGNvbnN0IG5hbWUgPSBmb3JtRGF0YS5nZXQoXCJuYW1lXCIpIGFzIHN0cmluZztcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGZvcm1EYXRhLmdldChcImRlc2NyaXB0aW9uXCIpIGFzIHN0cmluZztcbiAgICBjb25zdCBjbG9uZUZyb21JZCA9IGZvcm1EYXRhLmdldChcImNsb25lRnJvbUlkXCIpIGFzIHN0cmluZztcblxuICAgIGlmICghbmFtZSkgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBpcyByZXF1aXJlZFwiKTtcblxuICAgIGxldCBuZXdTY2VuYXJpbztcblxuICAgIGlmIChjbG9uZUZyb21JZCkge1xuICAgICAgICAvLyBEZWVwIGNvcHkgbG9naWNcbiAgICAgICAgY29uc3Qgc291cmNlID0gYXdhaXQgcHJpc21hLnNjZW5hcmlvLmZpbmRVbmlxdWUoe1xuICAgICAgICAgICAgd2hlcmU6IHsgaWQ6IGNsb25lRnJvbUlkIH0sXG4gICAgICAgICAgICBpbmNsdWRlOiB7XG4gICAgICAgICAgICAgICAgYXNzdW1wdGlvbnM6IHRydWUsXG4gICAgICAgICAgICAgICAgc2l0ZXM6IHsgaW5jbHVkZTogeyBsaW5lSXRlbXM6IHRydWUgfSB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghc291cmNlKSB0aHJvdyBuZXcgRXJyb3IoXCJTb3VyY2Ugc2NlbmFyaW8gbm90IGZvdW5kXCIpO1xuXG4gICAgICAgIG5ld1NjZW5hcmlvID0gYXdhaXQgcHJpc21hLnNjZW5hcmlvLmNyZWF0ZSh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogYCR7bmFtZX0gKENvcHkpYCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24gfHwgc291cmNlLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgIGlzQmFzZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgaG9yaXpvblN0YXJ0OiBzb3VyY2UuaG9yaXpvblN0YXJ0LFxuICAgICAgICAgICAgICAgIGhvcml6b25FbmQ6IHNvdXJjZS5ob3Jpem9uRW5kLFxuICAgICAgICAgICAgICAgIGFzc3VtcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogc291cmNlLmFzc3VtcHRpb25zLm1hcChhID0+ICh7IGtleTogYS5rZXksIHZhbHVlOiBhLnZhbHVlIH0pKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2l0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlOiBzb3VyY2Uuc2l0ZXMubWFwKHMgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsSXRDYXBhY2l0eU13OiBzLnRvdGFsSXRDYXBhY2l0eU13LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVjaGFuaWNhbENhcGFjaXR5TXc6IHMubWVjaGFuaWNhbENhcGFjaXR5TXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVjdHJpY2l0eVJhdGVQZXJLd2g6IHMuZWxlY3RyaWNpdHlSYXRlUGVyS3doLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mbGF0aW9uUmF0ZTogcy5pbmZsYXRpb25SYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZWxpbmVJdFBvd2VyTXc6IHMuYmFzZWxpbmVJdFBvd2VyTXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlbGluZU1lY2hhbmljYWxNdzogcy5iYXNlbGluZU1lY2hhbmljYWxNdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVJdGVtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogcy5saW5lSXRlbXMubWFwKGxpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2dJdGVtSWQ6IGxpLmNhdGFsb2dJdGVtSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3RUYWc6IGxpLnByb2plY3RUYWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogbGkuc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBsaS5lbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogbGkucXVhbnRpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXdTY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5zY2VuYXJpby5jcmVhdGUoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgaXNCYXNlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBob3Jpem9uU3RhcnQ6ICcyMDI0UTEnLFxuICAgICAgICAgICAgICAgIGhvcml6b25FbmQ6ICcyMDI2UTQnLFxuICAgICAgICAgICAgICAgIGFzc3VtcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogW1xuICAgICAgICAgICAgICAgICAgICAgICAgeyBrZXk6ICdpbmZsYXRpb25fcmF0ZScsIHZhbHVlOiAwLjEwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGtleTogJ2Nvb2xpbmdfb3ZlcmhlYWQnLCB2YWx1ZTogMS4zNSB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNpdGVzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdCYXlWaWV3JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbEl0Q2FwYWNpdHlNdzogMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlY3RyaWNpdHlSYXRlUGVyS3doOiAwLjEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmxhdGlvblJhdGU6IDAuMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ010Lldhc2gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsSXRDYXBhY2l0eU13OiAxLjA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZWN0cmljaXR5UmF0ZVBlckt3aDogMC4wNzU1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmxhdGlvblJhdGU6IDAuMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQmxvb21iZXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbEl0Q2FwYWNpdHlNdzogMS4yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZWN0cmljaXR5UmF0ZVBlckt3aDogMC4xMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZsYXRpb25SYXRlOiAwLjEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbiAgICByZWRpcmVjdChgL3NjZW5hcmlvcy8ke25ld1NjZW5hcmlvLmlkfWApO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkTGluZUl0ZW0oc2l0ZUlkOiBzdHJpbmcsIGRhdGE6IHtcbiAgICBjYXRhbG9nSXRlbUlkOiBzdHJpbmc7XG4gICAgcXVhbnRpdHk6IG51bWJlcjtcbiAgICBzdGFydFF1YXJ0ZXI6IHN0cmluZztcbiAgICBlbmRRdWFydGVyPzogc3RyaW5nO1xuICAgIHByb2plY3RUYWc/OiBzdHJpbmc7XG59KSB7XG4gICAgYXdhaXQgcHJpc21hLmxpbmVJdGVtLmNyZWF0ZSh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHNpdGVJZCxcbiAgICAgICAgICAgIC4uLmRhdGFcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2l0ZSA9IGF3YWl0IHByaXNtYS5zaXRlLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBpZDogc2l0ZUlkIH0gfSk7XG4gICAgaWYgKHNpdGUpIHtcbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoYC9zY2VuYXJpb3MvJHtzaXRlLnNjZW5hcmlvSWR9YCk7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlTGluZUl0ZW0oaWQ6IHN0cmluZywgZGF0YToge1xuICAgIGNhdGFsb2dJdGVtSWQ/OiBzdHJpbmc7XG4gICAgcXVhbnRpdHk/OiBudW1iZXI7XG4gICAgc3RhcnRRdWFydGVyPzogc3RyaW5nO1xuICAgIGVuZFF1YXJ0ZXI/OiBzdHJpbmcgfCBudWxsO1xuICAgIHByb2plY3RUYWc/OiBzdHJpbmc7XG59KSB7XG4gICAgY29uc3QgaXRlbSA9IGF3YWl0IHByaXNtYS5saW5lSXRlbS5maW5kVW5pcXVlKHsgd2hlcmU6IHsgaWQgfSB9KTtcbiAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGluZSBpdGVtIG5vdCBmb3VuZFwiKTtcbiAgICB9XG5cbiAgICBhd2FpdCBwcmlzbWEubGluZUl0ZW0udXBkYXRlKHtcbiAgICAgICAgd2hlcmU6IHsgaWQgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLi4uKGRhdGEuY2F0YWxvZ0l0ZW1JZCAmJiB7IGNhdGFsb2dJdGVtSWQ6IGRhdGEuY2F0YWxvZ0l0ZW1JZCB9KSxcbiAgICAgICAgICAgIC4uLihkYXRhLnF1YW50aXR5ICE9PSB1bmRlZmluZWQgJiYgeyBxdWFudGl0eTogZGF0YS5xdWFudGl0eSB9KSxcbiAgICAgICAgICAgIC4uLihkYXRhLnN0YXJ0UXVhcnRlciAmJiB7IHN0YXJ0UXVhcnRlcjogZGF0YS5zdGFydFF1YXJ0ZXIgfSksXG4gICAgICAgICAgICAuLi4oZGF0YS5lbmRRdWFydGVyICE9PSB1bmRlZmluZWQgJiYgeyBlbmRRdWFydGVyOiBkYXRhLmVuZFF1YXJ0ZXIgfSksXG4gICAgICAgICAgICAuLi4oZGF0YS5wcm9qZWN0VGFnICE9PSB1bmRlZmluZWQgJiYgeyBwcm9qZWN0VGFnOiBkYXRhLnByb2plY3RUYWcgfSksXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHNpdGUgPSBhd2FpdCBwcmlzbWEuc2l0ZS5maW5kVW5pcXVlKHsgd2hlcmU6IHsgaWQ6IGl0ZW0uc2l0ZUlkIH0gfSk7XG4gICAgaWYgKHNpdGUpIHtcbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoYC9zY2VuYXJpb3MvJHtzaXRlLnNjZW5hcmlvSWR9YCk7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlTGluZUl0ZW0oaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCBwcmlzbWEubGluZUl0ZW0uZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGlkIH0gfSk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgY29uc3Qgc2l0ZSA9IGF3YWl0IHByaXNtYS5zaXRlLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBpZDogaXRlbS5zaXRlSWQgfSB9KTtcbiAgICAgICAgYXdhaXQgcHJpc21hLmxpbmVJdGVtLmRlbGV0ZSh7IHdoZXJlOiB7IGlkIH0gfSk7XG4gICAgICAgIGlmIChzaXRlKSB7XG4gICAgICAgICAgICByZXZhbGlkYXRlUGF0aChgL3NjZW5hcmlvcy8ke3NpdGUuc2NlbmFyaW9JZH1gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gQ2F0YWxvZyBBY3Rpb25zXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVDYXRhbG9nSXRlbShkYXRhOiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGNhdGVnb3J5OiBzdHJpbmc7XG4gICAgdmVuZG9yPzogc3RyaW5nO1xuICAgIG1vZGVsPzogc3RyaW5nO1xuICAgIHBvd2VyS3c6IG51bWJlcjtcbiAgICBjb3N0OiBudW1iZXI7XG4gICAgY2FwYWNpdHlUeXBlPzogc3RyaW5nO1xuICAgIGNhcGFjaXR5VmFsPzogbnVtYmVyO1xufSkge1xuICAgIGF3YWl0IHByaXNtYS5jYXRhbG9nSXRlbS5jcmVhdGUoeyBkYXRhIH0pO1xuICAgIHJldmFsaWRhdGVQYXRoKFwiL2NhdGFsb2dcIik7XG4gICAgcmV2YWxpZGF0ZVBhdGgoXCIvXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ2F0YWxvZ0l0ZW0oaWQ6IHN0cmluZywgZGF0YToge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBjYXRlZ29yeTogc3RyaW5nO1xuICAgIHZlbmRvcj86IHN0cmluZztcbiAgICBtb2RlbD86IHN0cmluZztcbiAgICBwb3dlckt3OiBudW1iZXI7XG4gICAgY29zdDogbnVtYmVyO1xuICAgIGNhcGFjaXR5VHlwZT86IHN0cmluZztcbiAgICBjYXBhY2l0eVZhbD86IG51bWJlcjtcbn0pIHtcbiAgICBhd2FpdCBwcmlzbWEuY2F0YWxvZ0l0ZW0udXBkYXRlKHtcbiAgICAgICAgd2hlcmU6IHsgaWQgfSxcbiAgICAgICAgZGF0YVxuICAgIH0pO1xuICAgIHJldmFsaWRhdGVQYXRoKFwiL2NhdGFsb2dcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVDYXRhbG9nSXRlbShpZDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgcHJpc21hLmNhdGFsb2dJdGVtLmRlbGV0ZSh7IHdoZXJlOiB7IGlkIH0gfSk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKFwiL2NhdGFsb2dcIik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGRlbGV0ZSBjYXRhbG9nIGl0ZW1cIiwgZSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgaXRlbSB0aGF0IGlzIGN1cnJlbnRseSBpbiB1c2UgYnkgYSBzY2VuYXJpby5cIik7XG4gICAgfVxufVxuXG4vLyBTaXRlIFNldHRpbmdzIEFjdGlvbnNcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVNpdGVTZXR0aW5ncyhcbiAgICBzaXRlSWQ6IHN0cmluZyxcbiAgICBkYXRhOiB7XG4gICAgICAgIHRvdGFsSXRDYXBhY2l0eU13OiBudW1iZXI7XG4gICAgICAgIG1lY2hhbmljYWxDYXBhY2l0eU13OiBudW1iZXI7XG4gICAgICAgIGVsZWN0cmljaXR5UmF0ZVBlckt3aDogbnVtYmVyO1xuICAgICAgICBpbmZsYXRpb25SYXRlOiBudW1iZXI7XG4gICAgICAgIGJhc2VsaW5lSXRQb3dlck13OiBudW1iZXI7XG4gICAgICAgIGJhc2VsaW5lTWVjaGFuaWNhbE13OiBudW1iZXI7XG4gICAgfVxuKSB7XG4gICAgY29uc3Qgc2l0ZSA9IGF3YWl0IHByaXNtYS5zaXRlLnVwZGF0ZSh7XG4gICAgICAgIHdoZXJlOiB7IGlkOiBzaXRlSWQgfSxcbiAgICAgICAgZGF0YVxuICAgIH0pO1xuXG4gICAgcmV2YWxpZGF0ZVBhdGgoYC9zY2VuYXJpb3MvJHtzaXRlLnNjZW5hcmlvSWR9YCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVTY2VuYXJpb0Fzc3VtcHRpb25zKFxuICAgIHNjZW5hcmlvSWQ6IHN0cmluZyxcbiAgICBkYXRhOiB7XG4gICAgICAgIGNvb2xpbmdPdmVyaGVhZDogbnVtYmVyO1xuICAgICAgICBnbG9iYWxJbmZsYXRpb246IG51bWJlcjtcbiAgICB9XG4pIHtcbiAgICBjb25zdCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5zY2VuYXJpby5maW5kVW5pcXVlKHtcbiAgICAgICAgd2hlcmU6IHsgaWQ6IHNjZW5hcmlvSWQgfSxcbiAgICAgICAgaW5jbHVkZTogeyBhc3N1bXB0aW9uczogdHJ1ZSB9XG4gICAgfSk7XG5cbiAgICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoXCJTY2VuYXJpbyBub3QgZm91bmRcIik7XG5cbiAgICAvLyBVcGRhdGUgb3IgY3JlYXRlIGNvb2xpbmdfb3ZlcmhlYWQgYXNzdW1wdGlvblxuICAgIGNvbnN0IGNvb2xpbmdBc3N1bXB0aW9uID0gc2NlbmFyaW8uYXNzdW1wdGlvbnMuZmluZChhID0+IGEua2V5ID09PSAnY29vbGluZ19vdmVyaGVhZCcpO1xuICAgIGlmIChjb29saW5nQXNzdW1wdGlvbikge1xuICAgICAgICBhd2FpdCBwcmlzbWEuYXNzdW1wdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgd2hlcmU6IHsgaWQ6IGNvb2xpbmdBc3N1bXB0aW9uLmlkIH0sXG4gICAgICAgICAgICBkYXRhOiB7IHZhbHVlOiBkYXRhLmNvb2xpbmdPdmVyaGVhZCB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHByaXNtYS5hc3N1bXB0aW9uLmNyZWF0ZSh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc2NlbmFyaW9JZCxcbiAgICAgICAgICAgICAgICBrZXk6ICdjb29saW5nX292ZXJoZWFkJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZGF0YS5jb29saW5nT3ZlcmhlYWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIG9yIGNyZWF0ZSBpbmZsYXRpb25fcmF0ZSBhc3N1bXB0aW9uXG4gICAgY29uc3QgaW5mbGF0aW9uQXNzdW1wdGlvbiA9IHNjZW5hcmlvLmFzc3VtcHRpb25zLmZpbmQoYSA9PiBhLmtleSA9PT0gJ2luZmxhdGlvbl9yYXRlJyk7XG4gICAgaWYgKGluZmxhdGlvbkFzc3VtcHRpb24pIHtcbiAgICAgICAgYXdhaXQgcHJpc21hLmFzc3VtcHRpb24udXBkYXRlKHtcbiAgICAgICAgICAgIHdoZXJlOiB7IGlkOiBpbmZsYXRpb25Bc3N1bXB0aW9uLmlkIH0sXG4gICAgICAgICAgICBkYXRhOiB7IHZhbHVlOiBkYXRhLmdsb2JhbEluZmxhdGlvbiB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHByaXNtYS5hc3N1bXB0aW9uLmNyZWF0ZSh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc2NlbmFyaW9JZCxcbiAgICAgICAgICAgICAgICBrZXk6ICdpbmZsYXRpb25fcmF0ZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGRhdGEuZ2xvYmFsSW5mbGF0aW9uXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldmFsaWRhdGVQYXRoKGAvc2NlbmFyaW9zLyR7c2NlbmFyaW9JZH1gKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVNjZW5hcmlvKGlkOiBzdHJpbmcpIHtcbiAgICAvLyBDaGVjayBpZiBzY2VuYXJpbyBpcyBwcm90ZWN0ZWQgKGlzQmFzZSBzY2VuYXJpb3MgY2Fubm90IGJlIGRlbGV0ZWQpXG4gICAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEuc2NlbmFyaW8uZmluZFVuaXF1ZSh7XG4gICAgICAgIHdoZXJlOiB7IGlkIH1cbiAgICB9KTtcbiAgICBcbiAgICBpZiAoIXNjZW5hcmlvKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNjZW5hcmlvIG5vdCBmb3VuZFwiKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHNjZW5hcmlvLmlzQmFzZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYXNlIHNjZW5hcmlvcyBjYW5ub3QgYmUgZGVsZXRlZFwiKTtcbiAgICB9XG4gICAgXG4gICAgLy8gRGVsZXRlIHNjZW5hcmlvIGFuZCBhbGwgcmVsYXRlZCBkYXRhIChjYXNjYWRlIHdpbGwgaGFuZGxlIGxpbmVJdGVtcywgc2l0ZXMsIGFzc3VtcHRpb25zKVxuICAgIGF3YWl0IHByaXNtYS5zY2VuYXJpby5kZWxldGUoeyB3aGVyZTogeyBpZCB9IH0pO1xuICAgIFxuICAgIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbiAgICByZWRpcmVjdChcIi9cIik7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjZTQU1zQiwyTEFBQSJ9
}),
"[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreateScenarioDialog",
    ()=>CreateScenarioDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$data$3a$3d69e2__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/data:3d69e2 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function CreateScenarioDialog({ triggerLabel }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: setOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                            lineNumber: 27,
                            columnNumber: 21
                        }, this),
                        " ",
                        triggerLabel || "New Scenario"
                    ]
                }, void 0, true, {
                    fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                    lineNumber: 26,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                className: "sm:max-w-[425px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    action: __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$data$3a$3d69e2__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createScenario"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "Create Scenario"
                                }, void 0, false, {
                                    fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                                    lineNumber: 33,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    children: "Start a new capacity plan."
                                }, void 0, false, {
                                    fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                                    lineNumber: 34,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                            lineNumber: 32,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-4 items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "name",
                                            className: "text-right",
                                            children: "Name"
                                        }, void 0, false, {
                                            fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                                            lineNumber: 40,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "name",
                                            name: "name",
                                            className: "col-span-3",
                                            placeholder: "e.g. Q3 Revision",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                                            lineNumber: 43,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                                    lineNumber: 39,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-4 items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "description",
                                            className: "text-right",
                                            children: "Desc"
                                        }, void 0, false, {
                                            fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                                            lineNumber: 46,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                            id: "description",
                                            name: "description",
                                            className: "col-span-3",
                                            placeholder: "Optional notes"
                                        }, void 0, false, {
                                            fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                                            lineNumber: 49,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                                    lineNumber: 45,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                            lineNumber: 38,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                children: "Create"
                            }, void 0, false, {
                                fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                                lineNumber: 53,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                            lineNumber: 52,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                    lineNumber: 31,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/CreateScenarioDialog.tsx",
        lineNumber: 24,
        columnNumber: 9
    }, this);
}
_s(CreateScenarioDialog, "xG1TONbKtDWtdOTrXaTAsNhPg/Q=");
_c = CreateScenarioDialog;
var _c;
__turbopack_context__.k.register(_c, "CreateScenarioDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/NonSync/Power Modeling Tool/lib/data:23d87d [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteScenario",
    ()=>$$RSC_SERVER_ACTION_9
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"405bb359627df51c662de0127fc3f8e88ba46ada78":"deleteScenario"},"NonSync/Power Modeling Tool/lib/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("405bb359627df51c662de0127fc3f8e88ba46ada78", __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteScenario");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIkAvbGliL2RiXCI7XG5pbXBvcnQgeyByZXZhbGlkYXRlUGF0aCB9IGZyb20gXCJuZXh0L2NhY2hlXCI7XG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gXCJuZXh0L25hdmlnYXRpb25cIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNjZW5hcmlvKGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICAgIGNvbnN0IG5hbWUgPSBmb3JtRGF0YS5nZXQoXCJuYW1lXCIpIGFzIHN0cmluZztcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGZvcm1EYXRhLmdldChcImRlc2NyaXB0aW9uXCIpIGFzIHN0cmluZztcbiAgICBjb25zdCBjbG9uZUZyb21JZCA9IGZvcm1EYXRhLmdldChcImNsb25lRnJvbUlkXCIpIGFzIHN0cmluZztcblxuICAgIGlmICghbmFtZSkgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBpcyByZXF1aXJlZFwiKTtcblxuICAgIGxldCBuZXdTY2VuYXJpbztcblxuICAgIGlmIChjbG9uZUZyb21JZCkge1xuICAgICAgICAvLyBEZWVwIGNvcHkgbG9naWNcbiAgICAgICAgY29uc3Qgc291cmNlID0gYXdhaXQgcHJpc21hLnNjZW5hcmlvLmZpbmRVbmlxdWUoe1xuICAgICAgICAgICAgd2hlcmU6IHsgaWQ6IGNsb25lRnJvbUlkIH0sXG4gICAgICAgICAgICBpbmNsdWRlOiB7XG4gICAgICAgICAgICAgICAgYXNzdW1wdGlvbnM6IHRydWUsXG4gICAgICAgICAgICAgICAgc2l0ZXM6IHsgaW5jbHVkZTogeyBsaW5lSXRlbXM6IHRydWUgfSB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghc291cmNlKSB0aHJvdyBuZXcgRXJyb3IoXCJTb3VyY2Ugc2NlbmFyaW8gbm90IGZvdW5kXCIpO1xuXG4gICAgICAgIG5ld1NjZW5hcmlvID0gYXdhaXQgcHJpc21hLnNjZW5hcmlvLmNyZWF0ZSh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogYCR7bmFtZX0gKENvcHkpYCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24gfHwgc291cmNlLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgIGlzQmFzZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgaG9yaXpvblN0YXJ0OiBzb3VyY2UuaG9yaXpvblN0YXJ0LFxuICAgICAgICAgICAgICAgIGhvcml6b25FbmQ6IHNvdXJjZS5ob3Jpem9uRW5kLFxuICAgICAgICAgICAgICAgIGFzc3VtcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogc291cmNlLmFzc3VtcHRpb25zLm1hcChhID0+ICh7IGtleTogYS5rZXksIHZhbHVlOiBhLnZhbHVlIH0pKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2l0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlOiBzb3VyY2Uuc2l0ZXMubWFwKHMgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsSXRDYXBhY2l0eU13OiBzLnRvdGFsSXRDYXBhY2l0eU13LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVjaGFuaWNhbENhcGFjaXR5TXc6IHMubWVjaGFuaWNhbENhcGFjaXR5TXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVjdHJpY2l0eVJhdGVQZXJLd2g6IHMuZWxlY3RyaWNpdHlSYXRlUGVyS3doLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mbGF0aW9uUmF0ZTogcy5pbmZsYXRpb25SYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZWxpbmVJdFBvd2VyTXc6IHMuYmFzZWxpbmVJdFBvd2VyTXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlbGluZU1lY2hhbmljYWxNdzogcy5iYXNlbGluZU1lY2hhbmljYWxNdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVJdGVtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogcy5saW5lSXRlbXMubWFwKGxpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2dJdGVtSWQ6IGxpLmNhdGFsb2dJdGVtSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3RUYWc6IGxpLnByb2plY3RUYWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UXVhcnRlcjogbGkuc3RhcnRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRRdWFydGVyOiBsaS5lbmRRdWFydGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogbGkucXVhbnRpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXdTY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5zY2VuYXJpby5jcmVhdGUoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgaXNCYXNlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBob3Jpem9uU3RhcnQ6ICcyMDI0UTEnLFxuICAgICAgICAgICAgICAgIGhvcml6b25FbmQ6ICcyMDI2UTQnLFxuICAgICAgICAgICAgICAgIGFzc3VtcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogW1xuICAgICAgICAgICAgICAgICAgICAgICAgeyBrZXk6ICdpbmZsYXRpb25fcmF0ZScsIHZhbHVlOiAwLjEwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGtleTogJ2Nvb2xpbmdfb3ZlcmhlYWQnLCB2YWx1ZTogMS4zNSB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNpdGVzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdCYXlWaWV3JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbEl0Q2FwYWNpdHlNdzogMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlY3RyaWNpdHlSYXRlUGVyS3doOiAwLjEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmxhdGlvblJhdGU6IDAuMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ010Lldhc2gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsSXRDYXBhY2l0eU13OiAxLjA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZWN0cmljaXR5UmF0ZVBlckt3aDogMC4wNzU1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmxhdGlvblJhdGU6IDAuMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQmxvb21iZXJnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbEl0Q2FwYWNpdHlNdzogMS4yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZWN0cmljaXR5UmF0ZVBlckt3aDogMC4xMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZsYXRpb25SYXRlOiAwLjEwXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbiAgICByZWRpcmVjdChgL3NjZW5hcmlvcy8ke25ld1NjZW5hcmlvLmlkfWApO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkTGluZUl0ZW0oc2l0ZUlkOiBzdHJpbmcsIGRhdGE6IHtcbiAgICBjYXRhbG9nSXRlbUlkOiBzdHJpbmc7XG4gICAgcXVhbnRpdHk6IG51bWJlcjtcbiAgICBzdGFydFF1YXJ0ZXI6IHN0cmluZztcbiAgICBlbmRRdWFydGVyPzogc3RyaW5nO1xuICAgIHByb2plY3RUYWc/OiBzdHJpbmc7XG59KSB7XG4gICAgYXdhaXQgcHJpc21hLmxpbmVJdGVtLmNyZWF0ZSh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHNpdGVJZCxcbiAgICAgICAgICAgIC4uLmRhdGFcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2l0ZSA9IGF3YWl0IHByaXNtYS5zaXRlLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBpZDogc2l0ZUlkIH0gfSk7XG4gICAgaWYgKHNpdGUpIHtcbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoYC9zY2VuYXJpb3MvJHtzaXRlLnNjZW5hcmlvSWR9YCk7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlTGluZUl0ZW0oaWQ6IHN0cmluZywgZGF0YToge1xuICAgIGNhdGFsb2dJdGVtSWQ/OiBzdHJpbmc7XG4gICAgcXVhbnRpdHk/OiBudW1iZXI7XG4gICAgc3RhcnRRdWFydGVyPzogc3RyaW5nO1xuICAgIGVuZFF1YXJ0ZXI/OiBzdHJpbmcgfCBudWxsO1xuICAgIHByb2plY3RUYWc/OiBzdHJpbmc7XG59KSB7XG4gICAgY29uc3QgaXRlbSA9IGF3YWl0IHByaXNtYS5saW5lSXRlbS5maW5kVW5pcXVlKHsgd2hlcmU6IHsgaWQgfSB9KTtcbiAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGluZSBpdGVtIG5vdCBmb3VuZFwiKTtcbiAgICB9XG5cbiAgICBhd2FpdCBwcmlzbWEubGluZUl0ZW0udXBkYXRlKHtcbiAgICAgICAgd2hlcmU6IHsgaWQgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLi4uKGRhdGEuY2F0YWxvZ0l0ZW1JZCAmJiB7IGNhdGFsb2dJdGVtSWQ6IGRhdGEuY2F0YWxvZ0l0ZW1JZCB9KSxcbiAgICAgICAgICAgIC4uLihkYXRhLnF1YW50aXR5ICE9PSB1bmRlZmluZWQgJiYgeyBxdWFudGl0eTogZGF0YS5xdWFudGl0eSB9KSxcbiAgICAgICAgICAgIC4uLihkYXRhLnN0YXJ0UXVhcnRlciAmJiB7IHN0YXJ0UXVhcnRlcjogZGF0YS5zdGFydFF1YXJ0ZXIgfSksXG4gICAgICAgICAgICAuLi4oZGF0YS5lbmRRdWFydGVyICE9PSB1bmRlZmluZWQgJiYgeyBlbmRRdWFydGVyOiBkYXRhLmVuZFF1YXJ0ZXIgfSksXG4gICAgICAgICAgICAuLi4oZGF0YS5wcm9qZWN0VGFnICE9PSB1bmRlZmluZWQgJiYgeyBwcm9qZWN0VGFnOiBkYXRhLnByb2plY3RUYWcgfSksXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHNpdGUgPSBhd2FpdCBwcmlzbWEuc2l0ZS5maW5kVW5pcXVlKHsgd2hlcmU6IHsgaWQ6IGl0ZW0uc2l0ZUlkIH0gfSk7XG4gICAgaWYgKHNpdGUpIHtcbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoYC9zY2VuYXJpb3MvJHtzaXRlLnNjZW5hcmlvSWR9YCk7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlTGluZUl0ZW0oaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCBwcmlzbWEubGluZUl0ZW0uZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGlkIH0gfSk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgY29uc3Qgc2l0ZSA9IGF3YWl0IHByaXNtYS5zaXRlLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBpZDogaXRlbS5zaXRlSWQgfSB9KTtcbiAgICAgICAgYXdhaXQgcHJpc21hLmxpbmVJdGVtLmRlbGV0ZSh7IHdoZXJlOiB7IGlkIH0gfSk7XG4gICAgICAgIGlmIChzaXRlKSB7XG4gICAgICAgICAgICByZXZhbGlkYXRlUGF0aChgL3NjZW5hcmlvcy8ke3NpdGUuc2NlbmFyaW9JZH1gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gQ2F0YWxvZyBBY3Rpb25zXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVDYXRhbG9nSXRlbShkYXRhOiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGNhdGVnb3J5OiBzdHJpbmc7XG4gICAgdmVuZG9yPzogc3RyaW5nO1xuICAgIG1vZGVsPzogc3RyaW5nO1xuICAgIHBvd2VyS3c6IG51bWJlcjtcbiAgICBjb3N0OiBudW1iZXI7XG4gICAgY2FwYWNpdHlUeXBlPzogc3RyaW5nO1xuICAgIGNhcGFjaXR5VmFsPzogbnVtYmVyO1xufSkge1xuICAgIGF3YWl0IHByaXNtYS5jYXRhbG9nSXRlbS5jcmVhdGUoeyBkYXRhIH0pO1xuICAgIHJldmFsaWRhdGVQYXRoKFwiL2NhdGFsb2dcIik7XG4gICAgcmV2YWxpZGF0ZVBhdGgoXCIvXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ2F0YWxvZ0l0ZW0oaWQ6IHN0cmluZywgZGF0YToge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBjYXRlZ29yeTogc3RyaW5nO1xuICAgIHZlbmRvcj86IHN0cmluZztcbiAgICBtb2RlbD86IHN0cmluZztcbiAgICBwb3dlckt3OiBudW1iZXI7XG4gICAgY29zdDogbnVtYmVyO1xuICAgIGNhcGFjaXR5VHlwZT86IHN0cmluZztcbiAgICBjYXBhY2l0eVZhbD86IG51bWJlcjtcbn0pIHtcbiAgICBhd2FpdCBwcmlzbWEuY2F0YWxvZ0l0ZW0udXBkYXRlKHtcbiAgICAgICAgd2hlcmU6IHsgaWQgfSxcbiAgICAgICAgZGF0YVxuICAgIH0pO1xuICAgIHJldmFsaWRhdGVQYXRoKFwiL2NhdGFsb2dcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVDYXRhbG9nSXRlbShpZDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgcHJpc21hLmNhdGFsb2dJdGVtLmRlbGV0ZSh7IHdoZXJlOiB7IGlkIH0gfSk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKFwiL2NhdGFsb2dcIik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGRlbGV0ZSBjYXRhbG9nIGl0ZW1cIiwgZSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBkZWxldGUgaXRlbSB0aGF0IGlzIGN1cnJlbnRseSBpbiB1c2UgYnkgYSBzY2VuYXJpby5cIik7XG4gICAgfVxufVxuXG4vLyBTaXRlIFNldHRpbmdzIEFjdGlvbnNcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVNpdGVTZXR0aW5ncyhcbiAgICBzaXRlSWQ6IHN0cmluZyxcbiAgICBkYXRhOiB7XG4gICAgICAgIHRvdGFsSXRDYXBhY2l0eU13OiBudW1iZXI7XG4gICAgICAgIG1lY2hhbmljYWxDYXBhY2l0eU13OiBudW1iZXI7XG4gICAgICAgIGVsZWN0cmljaXR5UmF0ZVBlckt3aDogbnVtYmVyO1xuICAgICAgICBpbmZsYXRpb25SYXRlOiBudW1iZXI7XG4gICAgICAgIGJhc2VsaW5lSXRQb3dlck13OiBudW1iZXI7XG4gICAgICAgIGJhc2VsaW5lTWVjaGFuaWNhbE13OiBudW1iZXI7XG4gICAgfVxuKSB7XG4gICAgY29uc3Qgc2l0ZSA9IGF3YWl0IHByaXNtYS5zaXRlLnVwZGF0ZSh7XG4gICAgICAgIHdoZXJlOiB7IGlkOiBzaXRlSWQgfSxcbiAgICAgICAgZGF0YVxuICAgIH0pO1xuXG4gICAgcmV2YWxpZGF0ZVBhdGgoYC9zY2VuYXJpb3MvJHtzaXRlLnNjZW5hcmlvSWR9YCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVTY2VuYXJpb0Fzc3VtcHRpb25zKFxuICAgIHNjZW5hcmlvSWQ6IHN0cmluZyxcbiAgICBkYXRhOiB7XG4gICAgICAgIGNvb2xpbmdPdmVyaGVhZDogbnVtYmVyO1xuICAgICAgICBnbG9iYWxJbmZsYXRpb246IG51bWJlcjtcbiAgICB9XG4pIHtcbiAgICBjb25zdCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5zY2VuYXJpby5maW5kVW5pcXVlKHtcbiAgICAgICAgd2hlcmU6IHsgaWQ6IHNjZW5hcmlvSWQgfSxcbiAgICAgICAgaW5jbHVkZTogeyBhc3N1bXB0aW9uczogdHJ1ZSB9XG4gICAgfSk7XG5cbiAgICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoXCJTY2VuYXJpbyBub3QgZm91bmRcIik7XG5cbiAgICAvLyBVcGRhdGUgb3IgY3JlYXRlIGNvb2xpbmdfb3ZlcmhlYWQgYXNzdW1wdGlvblxuICAgIGNvbnN0IGNvb2xpbmdBc3N1bXB0aW9uID0gc2NlbmFyaW8uYXNzdW1wdGlvbnMuZmluZChhID0+IGEua2V5ID09PSAnY29vbGluZ19vdmVyaGVhZCcpO1xuICAgIGlmIChjb29saW5nQXNzdW1wdGlvbikge1xuICAgICAgICBhd2FpdCBwcmlzbWEuYXNzdW1wdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgd2hlcmU6IHsgaWQ6IGNvb2xpbmdBc3N1bXB0aW9uLmlkIH0sXG4gICAgICAgICAgICBkYXRhOiB7IHZhbHVlOiBkYXRhLmNvb2xpbmdPdmVyaGVhZCB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHByaXNtYS5hc3N1bXB0aW9uLmNyZWF0ZSh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc2NlbmFyaW9JZCxcbiAgICAgICAgICAgICAgICBrZXk6ICdjb29saW5nX292ZXJoZWFkJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZGF0YS5jb29saW5nT3ZlcmhlYWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIG9yIGNyZWF0ZSBpbmZsYXRpb25fcmF0ZSBhc3N1bXB0aW9uXG4gICAgY29uc3QgaW5mbGF0aW9uQXNzdW1wdGlvbiA9IHNjZW5hcmlvLmFzc3VtcHRpb25zLmZpbmQoYSA9PiBhLmtleSA9PT0gJ2luZmxhdGlvbl9yYXRlJyk7XG4gICAgaWYgKGluZmxhdGlvbkFzc3VtcHRpb24pIHtcbiAgICAgICAgYXdhaXQgcHJpc21hLmFzc3VtcHRpb24udXBkYXRlKHtcbiAgICAgICAgICAgIHdoZXJlOiB7IGlkOiBpbmZsYXRpb25Bc3N1bXB0aW9uLmlkIH0sXG4gICAgICAgICAgICBkYXRhOiB7IHZhbHVlOiBkYXRhLmdsb2JhbEluZmxhdGlvbiB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHByaXNtYS5hc3N1bXB0aW9uLmNyZWF0ZSh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc2NlbmFyaW9JZCxcbiAgICAgICAgICAgICAgICBrZXk6ICdpbmZsYXRpb25fcmF0ZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGRhdGEuZ2xvYmFsSW5mbGF0aW9uXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldmFsaWRhdGVQYXRoKGAvc2NlbmFyaW9zLyR7c2NlbmFyaW9JZH1gKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVNjZW5hcmlvKGlkOiBzdHJpbmcpIHtcbiAgICAvLyBDaGVjayBpZiBzY2VuYXJpbyBpcyBwcm90ZWN0ZWQgKGlzQmFzZSBzY2VuYXJpb3MgY2Fubm90IGJlIGRlbGV0ZWQpXG4gICAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEuc2NlbmFyaW8uZmluZFVuaXF1ZSh7XG4gICAgICAgIHdoZXJlOiB7IGlkIH1cbiAgICB9KTtcbiAgICBcbiAgICBpZiAoIXNjZW5hcmlvKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNjZW5hcmlvIG5vdCBmb3VuZFwiKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHNjZW5hcmlvLmlzQmFzZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYXNlIHNjZW5hcmlvcyBjYW5ub3QgYmUgZGVsZXRlZFwiKTtcbiAgICB9XG4gICAgXG4gICAgLy8gRGVsZXRlIHNjZW5hcmlvIGFuZCBhbGwgcmVsYXRlZCBkYXRhIChjYXNjYWRlIHdpbGwgaGFuZGxlIGxpbmVJdGVtcywgc2l0ZXMsIGFzc3VtcHRpb25zKVxuICAgIGF3YWl0IHByaXNtYS5zY2VuYXJpby5kZWxldGUoeyB3aGVyZTogeyBpZCB9IH0pO1xuICAgIFxuICAgIHJldmFsaWRhdGVQYXRoKFwiL1wiKTtcbiAgICByZWRpcmVjdChcIi9cIik7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjZTQXVSc0IsMkxBQUEifQ==
}),
"[project]/NonSync/Power Modeling Tool/components/scenario/DeleteScenarioButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeleteScenarioButton",
    ()=>DeleteScenarioButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$data$3a$23d87d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/NonSync/Power Modeling Tool/lib/data:23d87d [app-client] (ecmascript) <text/javascript>");
"use client";
;
;
;
;
function DeleteScenarioButton({ scenarioId, scenarioName }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$lib$2f$data$3a$23d87d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteScenario"])(scenarioId),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            type: "submit",
            variant: "ghost",
            size: "icon",
            "aria-label": `Delete ${scenarioName}`,
            onClick: (e)=>{
                if (!confirm(`Delete scenario "${scenarioName}"? This cannot be undone.`)) {
                    e.preventDefault();
                }
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$NonSync$2f$Power__Modeling__Tool$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                className: "h-4 w-4 text-red-500"
            }, void 0, false, {
                fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/DeleteScenarioButton.tsx",
                lineNumber: 26,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/DeleteScenarioButton.tsx",
            lineNumber: 15,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/NonSync/Power Modeling Tool/components/scenario/DeleteScenarioButton.tsx",
        lineNumber: 14,
        columnNumber: 9
    }, this);
}
_c = DeleteScenarioButton;
var _c;
__turbopack_context__.k.register(_c, "DeleteScenarioButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=NonSync_Power%20Modeling%20Tool_8363e827._.js.map