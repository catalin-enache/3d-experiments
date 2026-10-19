import { NativePage } from "@components";
import { DrawImagesInRectangles } from "./DrawImagesInRectangles";

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
