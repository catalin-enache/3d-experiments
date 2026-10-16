import { NativePage } from "@components";
import { StencilPortal } from "./StencilPortal.tsx";

export default function StencilPortalPage() {
  return (
    <NativePage
      nativeScenario={StencilPortal}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false,
          // the default drawing buffer has no stencil buffer, it must be asked for
          stencil: true
        }
      }}
    />
  );
}
