import { NativePage } from "@components";
import { HeadsLookingAt } from "./HeadsLookingAt";

export default function HeadsLookingAtPage() {
  return (
    <NativePage
      nativeScenario={HeadsLookingAt}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
