import { NativePage } from "@components";
import { ScenarioHome } from "./ScenarioHome";

export default function HomePage() {
  return (
    <NativePage
      nativeScenario={ScenarioHome}
      options={{
        rendererParams: {
          useWebGpu: true,
          options: {
            forceWebGL: false
          }
        },
        axesSize: 3,
        gridConfig: {}
      }}
    />
  );
}
