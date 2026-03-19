"use client";

import { useState, useMemo, useRef } from "react";
import { LineItem, CatalogItem } from "@prisma/client";
import { TimelineEngine, TimelineData, TimelineItem } from "@/lib/engine/timeline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
  lineItems: (LineItem & { catalogItem: CatalogItem })[];
  horizonStart: string;
  horizonEnd: string;
  siteName?: string;
}

const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 48;
const MIN_QUARTERS = 4;
const MAX_QUARTERS = 32;

export function TimelineView({ lineItems, horizonStart, horizonEnd, siteName }: TimelineViewProps) {
  const [zoomLevel, setZoomLevel] = useState(8);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const timelineData: TimelineData = useMemo(() => {
    return TimelineEngine.generateTimeline(lineItems, horizonStart, horizonEnd);
  }, [lineItems, horizonStart, horizonEnd]);

  const visibleQuarters = useMemo(() => {
    return timelineData.quarters.slice(0, Math.min(zoomLevel, timelineData.quarters.length));
  }, [timelineData.quarters, zoomLevel]);

  const currentQuarter = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const q = Math.floor(now.getMonth() / 3) + 1;
    return `${year}Q${q}`;
  }, []);

  const quarterWidth = 120;
  const totalWidth = visibleQuarters.length * quarterWidth;
  const totalHeight = Math.max(timelineData.lanes.length * ROW_HEIGHT + HEADER_HEIGHT, 200);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 2, MAX_QUARTERS, timelineData.quarters.length));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 2, MIN_QUARTERS));
  };

  const handleScrollLeft = () => {
    setScrollLeft((prev) => Math.max(prev - quarterWidth * 2, 0));
  };

  const handleScrollRight = () => {
    const maxScroll = totalWidth - (containerRef.current?.clientWidth || 0);
    setScrollLeft((prev) => Math.min(prev + quarterWidth * 2, maxScroll));
  };

  const getItemPosition = (item: TimelineItem) => {
    const startIdx = visibleQuarters.indexOf(item.startQuarter);
    if (startIdx === -1) return null;

    const endIdx = visibleQuarters.indexOf(item.endQuarter ?? "");
    const actualEndIdx = endIdx === -1 ? visibleQuarters.length - 1 : endIdx;
    const duration = actualEndIdx - startIdx + 1;

    return {
      left: startIdx * quarterWidth,
      width: duration * quarterWidth - 4,
      top: item.row * ROW_HEIGHT,
    };
  };

  const getCurrentQuarterPosition = () => {
    const idx = visibleQuarters.indexOf(currentQuarter);
    if (idx === -1) return null;
    return idx * quarterWidth + quarterWidth / 2;
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Deployment Timeline {siteName ? `: ${siteName}` : ""}</CardTitle>
            <CardDescription>
              Gantt view of line items by project and quarter
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomLevel <= MIN_QUARTERS}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
              {zoomLevel}Q
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomLevel >= Math.min(MAX_QUARTERS, timelineData.quarters.length)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleScrollLeft}
              disabled={scrollLeft <= 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleScrollRight}
              disabled={scrollLeft >= totalWidth - (containerRef.current?.clientWidth || 0)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="relative overflow-auto border rounded-lg bg-muted/20"
          style={{ height: Math.min(totalHeight + 40, 500) }}
        >
          <div
            className="sticky top-0 z-20 flex border-b bg-card"
            style={{
              width: totalWidth + 200,
              height: HEADER_HEIGHT,
            }}
          >
            <div
              className="sticky left-0 z-30 flex items-center border-r bg-card px-4 font-medium text-sm"
              style={{ width: 200, minWidth: 200 }}
            >
              Project
            </div>
            {visibleQuarters.map((quarter, idx) => (
              <div
                key={quarter}
                className={cn(
                  "flex items-center justify-center border-r text-sm font-medium",
                  quarter === currentQuarter && "bg-primary/10 text-primary"
                )}
                style={{ width: quarterWidth, minWidth: quarterWidth }}
              >
                {quarter}
              </div>
            ))}
          </div>

          <div
            className="relative"
            style={{
              width: totalWidth + 200,
              height: timelineData.lanes.length * ROW_HEIGHT,
            }}
          >
            <div
              className="sticky left-0 z-10 float-left border-r bg-card"
              style={{ width: 200 }}
            >
              {timelineData.lanes.map((lane) => (
                <div
                  key={lane.row}
                  className="flex items-center px-4 border-b text-sm truncate hover:bg-muted/50 transition-colors"
                  style={{ height: ROW_HEIGHT }}
                  title={lane.projectTag || "Untagged"}
                >
                  <span className="truncate font-medium text-muted-foreground">
                    {lane.projectTag || "Untagged"}
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {visibleQuarters.map((quarter, idx) => (
                <div
                  key={`grid-${quarter}`}
                  className={cn(
                    "absolute top-0 bottom-0 border-r",
                    quarter === currentQuarter ? "border-primary/30" : "border-border/50"
                  )}
                  style={{ left: 200 + idx * quarterWidth }}
                />
              ))}
              {timelineData.lanes.map((_, idx) => (
                <div
                  key={`row-${idx}`}
                  className="absolute left-0 right-0 border-b border-border/30"
                  style={{ top: idx * ROW_HEIGHT }}
                />
              ))}
            </div>
            {(() => {
              const pos = getCurrentQuarterPosition();
              if (pos === null) return null;
              return (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none"
                  style={{ left: 200 + pos }}
                >
                  <div className="absolute -top-1 -left-1.5 w-3 h-3 rounded-full bg-primary" />
                </div>
              );
            })()}

            {/* Timeline bars */}
            {timelineData.items.map((item) => {
              const position = getItemPosition(item);
              if (!position) return null;

              return (
                <TimelineBar
                  key={item.id}
                  item={item}
                  position={position}
                  sidebarWidth={200}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
          <span className="text-sm font-medium text-muted-foreground">Categories:</span>
          {[
            { name: "GPU", color: "#3b82f6" },
            { name: "CPU", color: "#22c55e" },
            { name: "Storage", color: "#f59e0b" },
            { name: "Network", color: "#8b5cf6" },
            { name: "Other", color: "#6b7280" },
          ].map((cat) => (
            <div key={cat.name} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-muted-foreground">{cat.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-4">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Current Quarter</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TimelineBarProps {
  item: TimelineItem;
  position: { left: number; width: number; top: number };
  sidebarWidth: number;
}

function TimelineBar({ item, position, sidebarWidth }: TimelineBarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPower = (mw: number) => `${mw.toFixed(2)} MW`;

  return (
    <div
      className="absolute group"
      style={{
        left: sidebarWidth + position.left,
        top: position.top + 6,
        width: position.width,
        height: ROW_HEIGHT - 12,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bar */}
      <div
        className={cn(
          "h-full rounded-md border border-white/20 shadow-sm cursor-pointer transition-all duration-200",
          isHovered && "ring-2 ring-primary/50 shadow-md scale-[1.02]"
        )}
        style={{ backgroundColor: item.color }}
        title={`${item.name} (${item.quantity}x)`}
      >
        {position.width > 60 && (
          <div className="flex items-center h-full px-2 text-white text-xs font-medium truncate drop-shadow-md">
            {item.name}
          </div>
        )}
      </div>
      {isHovered && (
        <div
          className="fixed z-50 px-3 py-2 bg-popover text-popover-foreground rounded-lg shadow-lg border text-sm pointer-events-none"
          style={{
            left: `var(--tooltip-x, 0)`,
            top: `var(--tooltip-y, 0)`,
            transform: "translate(-50%, -100%)",
            marginTop: "-8px",
          }}
          ref={(el) => {
            if (el) {
              const rect = el.getBoundingClientRect();
              const parent = el.parentElement;
              if (parent) {
                const parentRect = parent.getBoundingClientRect();
                el.style.setProperty("--tooltip-x", `${parentRect.left + parentRect.width / 2}px`);
                el.style.setProperty("--tooltip-y", `${parentRect.top}px`);
              }
            }
          }}
        >
          <div className="font-semibold mb-1">{item.name}</div>
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <div>Quantity: <span className="text-foreground">{item.quantity}x</span></div>
            <div>Power: <span className="text-foreground">{formatPower(item.powerMw)}</span></div>
            <div>CAPEX: <span className="text-foreground">{formatCurrency(item.capex)}</span></div>
            <div>Duration: <span className="text-foreground">{item.startQuarter} → {item.endQuarter}</span></div>
            {item.projectTag && (
              <div>Project: <span className="text-foreground">{item.projectTag}</span></div>
            )}
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-popover border-r border-b border-border" />
        </div>
      )}
    </div>
  );
}
