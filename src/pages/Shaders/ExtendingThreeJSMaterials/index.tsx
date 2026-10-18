import { Page } from "@components";
import ExtendingThreeJSMaterials from "./ExtendingThreeJSMaterials";

export default function ExtendingThreeJSMaterialsPage() {
  return (
    <Page
      cameraProps={{
        position: [0, 0, 10]
      }}
    >
      <ExtendingThreeJSMaterials />
    </Page>
  );
}
