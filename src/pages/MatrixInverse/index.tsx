import { Page } from "@components";
import MatrixInverse from "./MatrixInverse";

export default function MatrixInversePage() {
  return (
    <Page
      cameraProps={{ position: [0, 0, 4] }}
      rendererParams={{ useWebGpu: true }}
    >
      <MatrixInverse />
    </Page>
  );
}
