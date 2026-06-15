"use client";

import { cn } from "@/lib/utils";

interface CapacityGaugeProps {
  value: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    container: "w-16 h-16",
    stroke: "3",
    text: "text-xs",
    label: "text-xs",
    radius: 26,
    circumference: 163.36,
  },
  md: {
    container: "w-28 h-28",
    stroke: "4",
    text: "text-sm",
    label: "text-sm",
    radius: 40,
    circumference: 251.33,
  },
  lg: {
    container: "w-40 h-40",
    stroke: "5",
    text: "text-base",
    label: "text-base",
    radius: 54,
    circumference: 339.29,
  },
};

function getColorClasses(value: number): {
  text: string;
  stroke: string;
} {
  if (value >= 0.9) return { text: "text-red-600", stroke: "stroke-red-600" };
  if (value >= 0.75)
    return { text: "text-orange-500", stroke: "stroke-orange-500" };
  if (value >= 0.6)
    return { text: "text-yellow-500", stroke: "stroke-yellow-500" };
  return { text: "text-green-600", stroke: "stroke-green-600" };
}

function getLevelLabel(value: number): string {
  if (value >= 0.9) return "Critical";
  if (value >= 0.75) return "Warning";
  if (value >= 0.6) return "Moderate";
  return "Healthy";
}

type Trend = "up" | "down" | "stable" | undefined;

export function CapacityGauge({
    value,
    label,
    size = "md",
    trend,
}: CapacityGaugeProps & { trend?: Trend }) {
  const config = sizeConfig[size];
  const { text, stroke } = getColorClasses(value);
  const percentage = Math.round(value * 100);

  const maxArc = config.circumference * 0.75;
  const progressArc = maxArc * Math.min(value, 1);
  const dashOffset = config.circumference - progressArc;

  // Accessibility: generate machine-readable label and description
  const levelLabel = getLevelLabel(value);
  const gaugeLabelId = `gauge-label-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const gaugeDescId = `gauge-desc-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex flex-col items-center gap-2" role="group" aria-labelledby={gaugeLabelId}>
      <span id={gaugeLabelId} className="sr-only">
        {label} capacity gauge
      </span>
      <span id={gaugeDescId} className="sr-only">
        {percentage}% capacity used, {levelLabel} level.
        {value >= 0.9
          ? " Capacity is critically high. Immediate action required."
          : value >= 0.75
            ? " Capacity is approaching limits. Plan for expansion."
            : value >= 0.6
              ? " Capacity usage is moderate. Monitor for growth."
              : " Capacity usage is within healthy range."}
      </span>
      <div className={cn("relative", config.container)}>
        <svg
          className="h-full w-full -rotate-135"
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby={gaugeLabelId}
          aria-describedby={gaugeDescId}
          aria-label={`${label}: ${percentage}% capacity used, ${levelLabel} level`}
        >
          <circle
            cx="60"
            cy="60"
            r={config.radius}
            fill="none"
            className="stroke-gray-300"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={`${maxArc} ${config.circumference - maxArc}`}
          />
          <circle
            cx="60"
            cy="60"
            r={config.radius}
            fill="none"
            className={cn(stroke, "transition-all duration-500 ease-out")}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={`${config.circumference} ${config.circumference}`}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn("font-semibold", text, config.text)}
            aria-hidden="true"
          >
            {percentage}%
          </span>
        </div>
      </div>
      <span
        className={cn("font-medium text-muted-foreground", config.label)}
      >
        {label}
      </span>
      {trend && (
        <span
          className={cn(
            "text-xs font-medium",
            trend === "up" && "text-red-500",
            trend === "down" && "text-green-500",
            trend === "stable" && "text-muted-foreground"
          )}
          aria-label={`Trend: ${trend}`}
        >
          {trend === "up" ? "▲" : trend === "down" ? "▼" : "●"} {trend}
        </span>
      )}
    </div>
  );
}
