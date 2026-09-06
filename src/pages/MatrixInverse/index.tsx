import { Page } from "@components";
import ScenarioMatrixInverse from "./ScenarioMatrixInverse";

export default function MatrixInversePage() {
  return (
    <Page
      cameraProps={{ position: [0, 0, 4] }}
      rendererParams={{ useWebGpu: true }}
    >
      <ScenarioMatrixInverse />
    </Page>
  );
}
