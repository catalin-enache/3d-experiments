import { Page } from "@components";
import DotAndCrossProduct from "./DotAndCrossProduct";

export default function DotAndCrossProductsPage() {
  return (
    <Page
      cameraProps={{
        position: [0, 0, 10]
      }}
      rendererParams={{ useWebGpu: true }}
      gridConfig={{ position: [0, -2.5, 0] }}
    >
      <DotAndCrossProduct />
    </Page>
  );
}
