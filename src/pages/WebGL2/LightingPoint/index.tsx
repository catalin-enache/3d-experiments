import { NativePage } from "@components";
import { LightingPoint } from "./LightingPoint.tsx";

export default function LightingPointPage() {
  return (
    <NativePage
      nativeScenario={LightingPoint}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
