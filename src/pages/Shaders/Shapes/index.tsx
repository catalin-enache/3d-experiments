import { Page } from "@components";
import ShaderShapes from "./ShaderShapes";

export default function ShaderShapesPage() {
  return (
    <Page
      orthographic
      cameraProps={{
        zoom: 55
      }}
    >
      <ShaderShapes />
    </Page>
  );
}
