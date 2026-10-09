import { NativePage } from "@components";
import { DrawImagesInRectangles } from "./DrawImagesInRectangles.tsx";

export default function HomePage() {
  return (
    <NativePage
      nativeScenario={DrawImagesInRectangles}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
