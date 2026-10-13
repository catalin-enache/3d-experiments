import { NativePage } from "@components";
import { LightingDirectional } from "./LightingDirectional.tsx";

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
