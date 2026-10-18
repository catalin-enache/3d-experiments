import { Page } from "@components";
import Shapes from "./Shapes";

export default function ShapesPage() {
  return (
    <Page
      orthographic
      cameraProps={{
        zoom: 55
      }}
    >
      <Shapes />
    </Page>
  );
}
