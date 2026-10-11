import { NativePage } from "@components";
import { DrawImagesInRectangles } from "./DrawImagesInRectangles.tsx";

export default function DrawImagesInRectanglesPage() {
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
