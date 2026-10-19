import { NativePage } from "@components";
import { LightingDirectional } from "./LightingDirectional";

export default function LightingDirectionalPage() {
  return (
    <NativePage
      nativeScenario={LightingDirectional}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
