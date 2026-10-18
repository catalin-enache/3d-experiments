import { Page } from "@components";
import TransformMatrices from "./TransformMatrices";

export default function TransformMatricesPage() {
  return (
    <Page
      cameraProps={{ position: [0, 0, 5] }}
      rendererParams={{ useWebGpu: true }}
    >
      <TransformMatrices />
    </Page>
  );
}
