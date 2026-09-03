import { Page } from "@components";
import ScenarioLinesIntersections from "./ScenarioLineIntersections";

export default function MaterialTestPage() {
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
    >
      <ScenarioLinesIntersections />
    </Page>
  );
}
