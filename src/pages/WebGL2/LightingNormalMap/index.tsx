import { NativePage } from "@components";
import { LightingNormalMap } from "./LightingNormalMap";

export default function LightingNormalMapPage() {
  return (
    <NativePage
      nativeScenario={LightingNormalMap}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
