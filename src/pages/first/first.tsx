import { useNativeScenario } from 'hooks/use-native-scenario';
import { startThreeApp } from './scenario';

export default function FirstPage() {
  return <div ref={useNativeScenario(startThreeApp)} className="scenarioContainer" />;
}
