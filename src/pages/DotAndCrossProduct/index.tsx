import { Page } from "@components";
import ScenarioDotAndCrossProduct from "./ScenarioDotAndCrossProduct";

export default function DotAndCrossProductsPage() {
  return (
    <Page
      cameraProps={{
        position: [0, 0, 10]
      }}
    >
      <ScenarioDotAndCrossProduct />
    </Page>
  );
}
