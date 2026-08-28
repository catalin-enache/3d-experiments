import { Page } from "@components";
import ScenarioShaderPatternsUV from "./ScenarioShaderPatternsUV";

export default function ProjectLongLatOnSpherePage() {
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
