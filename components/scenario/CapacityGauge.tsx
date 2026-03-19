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
    container: "w-24 h-24",
    stroke: "4",
    text: "text-sm",
    label: "text-sm",
    radius: 40,
    circumference: 251.33,
  },
  lg: {
    container: "w-32 h-32",
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
  if (value >= 1.0) {
    return { text: "text-red-600", stroke: "stroke-red-500" };
  } else if (value >= 0.8) {
    return { text: "text-yellow-600", stroke: "stroke-yellow-500" };
  } else {
    return { text: "text-green-600", stroke: "stroke-green-500" };
  }
}

export function CapacityGauge({ value, label, size = "md" }: CapacityGaugeProps) {
  const config = sizeConfig[size];
  const { text, stroke } = getColorClasses(value);
  const percentage = Math.round(value * 100);

  const maxArc = config.circumference * 0.75;
  const progressArc = maxArc * Math.min(value, 1);
  const dashOffset = config.circumference - progressArc;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative", config.container)}>
        <svg
          className="h-full w-full -rotate-135"
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="60"
            cy="60"
            r={config.radius}
            fill="none"
            className="stroke-gray-200"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={`${maxArc} ${config.circumference}`}
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
          <span className={cn("font-semibold", text, config.text)}>
            {percentage}%
          </span>
        </div>
      </div>
      <span className={cn("font-medium text-muted-foreground", config.label)}>
        {label}
      </span>
    </div>
  );
}
