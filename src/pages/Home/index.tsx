import { NativePage } from "@components";
import { Home } from "./Home";

export default function HomePage() {
  return (
    <NativePage
      nativeScenario={Home}
      options={{
        rendererParams: {
          useWebGpu: true,
          options: {
            forceWebGL: false
          }
        },
        axesSize: 3,
        gridConfig: {}
      }}
    />
  );
}
