"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ComparisonResult } from "@/lib/engine/comparison"
import { cn } from "@/lib/utils"

interface ComparisonTableProps {
  comparison: ComparisonResult
}

function formatMW(value: number): string {
  return value.toFixed(2)
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number): string {
  if (!isFinite(value)) return "∞"
  return `${value.toFixed(2)}%`
}

function getDeltaClass(delta: number): string {
  if (delta > 0.001) return "text-green-600 font-medium"
  if (delta < -0.001) return "text-red-600 font-medium"
  return "text-gray-500"
}

export function ComparisonTable({ comparison }: ComparisonTableProps) {
  const { differences, summary, baseScenario, compareScenario } = comparison

  const totalBasePower = differences.reduce((sum, d) => sum + d.baseValue, 0)
  const totalComparePower = differences.reduce((sum, d) => sum + d.compareValue, 0)
  const totalDelta = differences.reduce((sum, d) => sum + d.delta, 0)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quarter</TableHead>
            <TableHead className="text-right">{baseScenario.name} Power (MW)</TableHead>
            <TableHead className="text-right">{compareScenario.name} Power (MW)</TableHead>
            <TableHead className="text-right">Delta (MW)</TableHead>
            <TableHead className="text-right">% Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {differences.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No differences found between scenarios
              </TableCell>
            </TableRow>
          ) : (
            differences.map((diff) => (
              <TableRow key={diff.quarter}>
                <TableCell className="font-medium">{diff.quarter}</TableCell>
                <TableCell className="text-right">{formatMW(diff.baseValue)}</TableCell>
                <TableCell className="text-right">{formatMW(diff.compareValue)}</TableCell>
                <TableCell className={cn("text-right", getDeltaClass(diff.delta))}>
                  {diff.delta > 0 ? "+" : ""}
                  {formatMW(diff.delta)}
                </TableCell>
                <TableCell className={cn("text-right", getDeltaClass(diff.delta))}>
                  {diff.delta > 0 ? "+" : ""}
                  {formatPercent(diff.percentChange)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-muted/50">
            <TableCell className="font-semibold">Totals / Summary</TableCell>
            <TableCell className="text-right font-semibold">
              {formatMW(totalBasePower)}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatMW(totalComparePower)}
            </TableCell>
            <TableCell className={cn("text-right font-semibold", getDeltaClass(totalDelta))}>
              {totalDelta > 0 ? "+" : ""}
              {formatMW(totalDelta)}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              —
            </TableCell>
          </TableRow>
          <TableRow className="bg-muted/30 border-t-0">
            <TableCell colSpan={5} className="py-2">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  Peak Power Delta:{" "}
                  <span className={cn("font-medium", getDeltaClass(summary.peakPowerDelta))}>
                    {summary.peakPowerDelta > 0 ? "+" : ""}
                    {formatMW(summary.peakPowerDelta)} MW
                  </span>
                </span>
                <span>
                  Total CapEx Delta:{" "}
                  <span className={cn("font-medium", getDeltaClass(summary.totalCapexDelta))}>
                    {summary.totalCapexDelta > 0 ? "+" : ""}
                    {formatCurrency(summary.totalCapexDelta)}
                  </span>
                </span>
                <span>
                  Total Utility Delta:{" "}
                  <span className={cn("font-medium", getDeltaClass(summary.totalUtilityDelta))}>
                    {summary.totalUtilityDelta > 0 ? "+" : ""}
                    {formatCurrency(summary.totalUtilityDelta)}
                  </span>
                </span>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
