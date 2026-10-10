import { NativePage } from "@components";
import { Projection3D } from "./Projection3D.tsx";

export default function HomePage() {
  return (
    <NativePage
      nativeScenario={Projection3D}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
