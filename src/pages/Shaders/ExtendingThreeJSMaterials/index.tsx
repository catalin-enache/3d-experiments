import { Page } from "@components";
import ShaderExtendingThreeJSMaterials from "./ShaderExtendingThreeJSMaterials";

export default function ShaderExtendingThreeJSMaterialsPage() {
  return (
    <Page
      cameraProps={{
        position: [0, 0, 10]
      }}
    >
      <ShaderExtendingThreeJSMaterials />
    </Page>
  );
}
