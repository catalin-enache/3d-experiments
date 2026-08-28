import { Page } from "@components";
import ScenarioShaderShapes from "./ScenarioShaderShapes";

export default function ShaderShapesPage() {
  return (
    <Page
      orthographic
      cameraProps={{
        zoom: 55
      }}
    >
      <ScenarioShaderShapes />
    </Page>
  );
}
