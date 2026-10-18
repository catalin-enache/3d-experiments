import { Page } from "@components";
import ShaderFlag from "./ShaderFlag";

export default function ShaderFlagPage() {
  return (
    <Page
      orthographic
      cameraProps={{
        zoom: 55
      }}
    >
      <ShaderFlag />
    </Page>
  );
}
