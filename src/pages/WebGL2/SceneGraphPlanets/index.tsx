import { NativePage } from "@components";
import { SceneGraphPlanets } from "./SceneGraphPlanets";

export default function SceneGraphPlanetsPage() {
  return (
    <NativePage
      nativeScenario={SceneGraphPlanets}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
