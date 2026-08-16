import { useNativeScenario } from '@hooks/useNativeScenario';
import { scenarioNative } from './scenarioNative.tsx';

export default function NativePage() {
  return (
    <div ref={useNativeScenario(scenarioNative)} className="scenarioContainer" />
  );
}
