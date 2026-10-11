import { NativePage } from "@components";
import { WebGL2Basic } from "./WebGL2Basic";

export default function WebGL2BasicPage() {
  return (
    <NativePage
      nativeScenario={WebGL2Basic}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
