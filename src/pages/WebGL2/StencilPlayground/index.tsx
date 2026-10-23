import { NativePage } from "@components";
import { StencilPlayground } from "./StencilPlayground";

export default function StencilPlaygroundPage() {
  return (
    <NativePage
      nativeScenario={StencilPlayground}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false,
          // the default drawing buffer has no stencil buffer, it must be asked for
          stencil: true,
          // without antialiasing every pixel has exactly one stencil value,
          // which makes the stencil view (and the value under the cursor) exact
          antialias: true,
          // an opaque canvas, so blending the shapes never makes it see-through
          alpha: false
        }
      }}
    />
  );
}
