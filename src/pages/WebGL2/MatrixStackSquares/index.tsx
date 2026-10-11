import { NativePage } from "@components";
import { MatrixStackSquares } from "./MatrixStackSquares";

export default function MatrixStackSquaresPage() {
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
