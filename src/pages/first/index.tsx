import { useNativeScenario } from '@hooks/useNativeScenario';
import { startThreeApp } from './scenario';

export default function FirstPage() {
  return (
    <div ref={useNativeScenario(startThreeApp)} className="scenarioContainer" />
  );
}
