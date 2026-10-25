import { NativePage } from "@components";
import { SceneGraph } from "./SceneGraph";

export default function SceneGraphPage() {
  return (
    <NativePage
      nativeScenario={SceneGraph}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
