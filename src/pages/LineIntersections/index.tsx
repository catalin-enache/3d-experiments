import { Page } from "@components";
import ScenarioLinesIntersections from "./LineIntersections";

export default function LineIntersectionsPage() {
  return (
    <Page
      cameraProps={{
        position: [-4.7, 8.02, 3.72]
      }}
      raycasterParams={{
        Line: {
          threshold: 1
        }
      }}
      rendererParams={{ useWebGpu: true }}
    >
      <ScenarioLinesIntersections />
    </Page>
  );
}
