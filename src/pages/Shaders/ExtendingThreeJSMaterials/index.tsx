import { Page } from "@components";
import ScenarioShaderExtendingThreeJSMaterials from "./ScenarioShaderExtendingThreeJSMaterials";

export default function ShaderExtendingThreeJSMaterialsPage() {
  return (
    <Page
      cameraProps={{
        position: [0, 0, 10]
      }}
    >
      <ScenarioShaderExtendingThreeJSMaterials />
    </Page>
  );
}
