import { NativePage } from "@components";
import { MatrixStackSquares } from "./MatrixStackSquares";

export default function HomePage() {
  return (
    <NativePage
      nativeScenario={MatrixStackSquares}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
