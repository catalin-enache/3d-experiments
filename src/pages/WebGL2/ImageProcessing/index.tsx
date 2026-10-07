import { NativePage } from "@components";
import { ImageProcessing } from "./ImageProcessing";

export default function HomePage() {
  return (
    <NativePage
      nativeScenario={ImageProcessing}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
