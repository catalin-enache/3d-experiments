import { NativePage } from "@components";
import { LightingSpot } from "./LightingSpot";

export default function LightingSpotPage() {
  return (
    <NativePage
      nativeScenario={LightingSpot}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
