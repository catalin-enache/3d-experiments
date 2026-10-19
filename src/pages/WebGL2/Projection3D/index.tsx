import { NativePage } from "@components";
import { Projection3D } from "./Projection3D";

export default function Projection3DPage() {
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
