"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface Scenario {
  id: string
  name: string
  isBase: boolean
}

interface ScenarioSelectorProps {
  scenarios: Scenario[]
  baseScenarioId: string | null
  compareScenarioId: string | null
  onBaseChange: (id: string) => void
  onCompareChange: (id: string) => void
}

export function ScenarioSelector({
  scenarios,
  baseScenarioId,
  compareScenarioId,
  onBaseChange,
  onCompareChange,
}: ScenarioSelectorProps) {
  const getScenarioLabel = (scenario: Scenario) => {
    return scenario.isBase ? `${scenario.name} (Baseline)` : scenario.name
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="base-scenario">Base Scenario</Label>
            <Select
              value={baseScenarioId ?? ""}
              onValueChange={onBaseChange}
            >
              <SelectTrigger id="base-scenario" className="w-full">
                <SelectValue placeholder="Select base scenario" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem
                    key={scenario.id}
                    value={scenario.id}
                    disabled={scenario.id === compareScenarioId}
                  >
                    {getScenarioLabel(scenario)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="compare-scenario">Compare Scenario</Label>
            <Select
              value={compareScenarioId ?? ""}
              onValueChange={onCompareChange}
            >
              <SelectTrigger id="compare-scenario" className="w-full">
                <SelectValue placeholder="Select compare scenario" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem
                    key={scenario.id}
                    value={scenario.id}
                    disabled={scenario.id === baseScenarioId}
                  >
                    {getScenarioLabel(scenario)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
