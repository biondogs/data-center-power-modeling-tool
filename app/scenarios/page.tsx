import { getScenarios } from "@/lib/services/data";
import { ScenariosList } from "@/components/scenario/ScenariosList";

export const dynamic = "force-dynamic";

export default async function ScenariosPage() {
  const scenarios = await getScenarios();

  return <ScenariosList initialScenarios={scenarios} />;
}
