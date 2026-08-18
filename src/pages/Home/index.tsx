import { useNativeScenario } from '@hooks/useNativeScenario';
import { scenarioNative } from './ScenarioNative.tsx';

export default function NativePage() {
  return (
    <div
      ref={useNativeScenario(scenarioNative)}
      className="scenarioContainer"
    />
  );
}
