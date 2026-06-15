// Time utilities
export { TimeUtils } from "./time";
export type { Quarter } from "./time";

// Aggregation
export { Aggregator } from "./aggregator";
export type {
  SiteProjection,
  SiteWithLineItems,
} from "./aggregator";

// Projection engine
export { Projector } from "./projector";
export type {
  ProjectedPoint,
  ProjectorSettings,
} from "./projector";

// Capacity analysis
export { CapacityAnalyzer } from "./capacity";
export type {
  CapacityConstraint,
  SiteCapacityStatus,
} from "./capacity";

// Timeline
export { TimelineEngine } from "./timeline";
export type {
  TimelineItem,
  TimelineLane,
  TimelineData,
} from "./timeline";

// Project portfolio
export { ProjectAggregator } from "./project";
export type {
  ProjectSummary,
  ProjectPortfolio,
  ProjectMetrics,
  LineItemWithCatalog,
} from "./project";

// What-if analysis
export { WhatIfEngine } from "./whatif";
export type {
  WhatIfChange,
  WhatIfScenario,
  WhatIfResult,
} from "./whatif";
