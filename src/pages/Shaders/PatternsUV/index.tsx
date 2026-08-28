import { Page } from "@components";
import ScenarioShaderPatternsUV from "./ScenarioShaderPatternsUV";

export default function ShaderPatternsUVPage() {
  return (
    <Page
      orthographic
      cameraProps={{
        zoom: 55
      }}
    >
      <ScenarioShaderPatternsUV />
    </Page>
  );
}
