import { NativePage } from "@components";
import { Orthographic3D } from "./Orthographic3D.tsx";

export default function HomePage() {
  return (
    <NativePage
      nativeScenario={Orthographic3D}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
