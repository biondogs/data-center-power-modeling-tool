import { getScenarios } from "@/lib/services/data";
import { ScenarioComparisonClient } from "./ScenarioComparisonClient";

export default async function ComparePage() {
    const scenarios = await getScenarios();

    return <ScenarioComparisonClient scenarios={scenarios} />;
}
