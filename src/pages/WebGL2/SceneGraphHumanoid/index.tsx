import { NativePage } from "@components";
import { SceneGraphHumanoid } from "./SceneGraphHumanoid";

export default function SceneGraphHumanoidPage() {
  return (
    <NativePage
      nativeScenario={SceneGraphHumanoid}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
