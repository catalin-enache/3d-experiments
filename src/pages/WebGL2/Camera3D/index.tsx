import { NativePage } from "@components";
import { Camera3D } from "./Camera3D";

export default function Camera3DPage() {
  return (
    <NativePage
      nativeScenario={Camera3D}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
