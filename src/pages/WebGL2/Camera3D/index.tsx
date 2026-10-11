import { NativePage } from "@components";
import { Camera3D } from "./Camera3D.tsx";

export default function HomePage() {
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
