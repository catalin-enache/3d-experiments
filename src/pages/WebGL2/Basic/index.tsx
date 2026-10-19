import { NativePage } from "@components";
import { Basic } from "./Basic";

export default function BasicPage() {
  return (
    <NativePage
      nativeScenario={Basic}
      options={{
        webglContextAttributes: {
          preserveDrawingBuffer: false
        }
      }}
    />
  );
}
