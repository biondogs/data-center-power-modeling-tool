import { LineItem, CatalogItem } from "@prisma/client";
import { TimeUtils } from "./time";

export type TimelineItem = {
  id: string;
  name: string;
  projectTag: string | null;
  category: string;
  startQuarter: string;
  endQuarter: string | null;
  duration: number;
  quantity: number;
  powerMw: number;
  capex: number;
  color: string;
  row: number;
};

export type TimelineLane = {
  row: number;
  projectTag: string | null;
  items: TimelineItem[];
};

export type TimelineData = {
  items: TimelineItem[];
  lanes: TimelineLane[];
  quarters: string[];
  startQuarter: string;
  endQuarter: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  GPU: "#3b82f6",
  CPU: "#22c55e",
  Storage: "#f59e0b",
  Network: "#8b5cf6",
  Other: "#6b7280",
};

export class TimelineEngine {
  static generateTimeline(
    lineItems: (LineItem & { catalogItem: CatalogItem })[],
    horizonStart: string,
    horizonEnd: string
  ): TimelineData {
    const quarters = TimeUtils.generateRange(horizonStart, horizonEnd);
    const items: TimelineItem[] = [];
    const projectGroups = new Map<string | null, TimelineItem[]>();

    for (const item of lineItems) {
      const startIdx = TimeUtils.toIndex(item.startQuarter);
      const endIdx = item.endQuarter
        ? TimeUtils.toIndex(item.endQuarter)
        : TimeUtils.toIndex(horizonEnd);

      const timelineItem: TimelineItem = {
        id: item.id,
        name: item.catalogItem.name,
        projectTag: item.projectTag,
        category: item.catalogItem.category,
        startQuarter: item.startQuarter,
        endQuarter: item.endQuarter || horizonEnd,
        duration: endIdx - startIdx,
        quantity: item.quantity,
        powerMw: (item.catalogItem.powerKw * item.quantity) / 1000,
        capex: item.catalogItem.cost * item.quantity,
        color: CATEGORY_COLORS[item.catalogItem.category] || CATEGORY_COLORS.Other,
        row: 0,
      };

      items.push(timelineItem);

      const tag = item.projectTag || null;
      if (!projectGroups.has(tag)) {
        projectGroups.set(tag, []);
      }
      projectGroups.get(tag)!.push(timelineItem);
    }

    const lanes: TimelineLane[] = [];
    let currentRow = 0;

    for (const [projectTag, projectItems] of projectGroups) {
      projectItems.sort(
        (a, b) => TimeUtils.toIndex(a.startQuarter) - TimeUtils.toIndex(b.startQuarter)
      );

      const laneItems: TimelineItem[] = [];
      for (const item of projectItems) {
        item.row = currentRow;
        laneItems.push(item);
      }

      lanes.push({
        row: currentRow,
        projectTag,
        items: laneItems,
      });

      currentRow++;
    }

    return {
      items,
      lanes,
      quarters,
      startQuarter: horizonStart,
      endQuarter: horizonEnd,
    };
  }

  static calculatePosition(
    quarter: string,
    startQuarter: string,
    endQuarter: string
  ): { left: number; width: number } {
    const totalQuarters = TimeUtils.diff(startQuarter, endQuarter) + 1;
    const quarterIndex = TimeUtils.diff(startQuarter, quarter);

    const left = (quarterIndex / totalQuarters) * 100;
    const width = 100 / totalQuarters;

    return { left, width };
  }

  static calculateItemPosition(
    item: TimelineItem,
    startQuarter: string,
    endQuarter: string
  ): { left: number; width: number } {
    const totalQuarters = TimeUtils.diff(startQuarter, endQuarter) + 1;
    const itemStartIdx = TimeUtils.diff(startQuarter, item.startQuarter);
    const itemDuration = item.duration;

    const left = (itemStartIdx / totalQuarters) * 100;
    const width = (itemDuration / totalQuarters) * 100;

    return { left, width };
  }
}
