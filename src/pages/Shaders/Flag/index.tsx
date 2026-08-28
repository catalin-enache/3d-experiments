import { Page } from "@components";
import ScenarioShaderFlag from "./ScenarioShaderFlag";

export default function ShaderFlagPage() {
  return (
    <Page
      orthographic
      cameraProps={{
        zoom: 55
      }}
    >
      <ScenarioShaderFlag />
    </Page>
  );
}
