import { Page } from "@components";
import { MaterialTest } from "./MaterialTest";

export default function MaterialTestPage() {
  return (
    <Page
      raycasterParams={{
        Line: {
          threshold: 1
        }
      }}
      rendererParams={{
        useWebGpu: true
      }}
    >
      <MaterialTest />
    </Page>
  );
}
