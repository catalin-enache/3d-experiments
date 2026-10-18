import { Page } from "@components";
import ShaderPatternsUV from "./ShaderPatternsUV";

export default function ShaderPatternsUVPage() {
  return (
    <Page
      orthographic
      cameraProps={{
        zoom: 55
      }}
    >
      <ShaderPatternsUV />
    </Page>
  );
}
