import { Page } from "@components";
import ScenarioTransformMatrices from "./ScenarioTransformMatrices";

export default function MatrixInversePage() {
  return (
    <Page
      cameraProps={{ position: [0, 0, 5] }}
      rendererParams={{ useWebGpu: true }}
    >
      <ScenarioTransformMatrices />
    </Page>
  );
}
