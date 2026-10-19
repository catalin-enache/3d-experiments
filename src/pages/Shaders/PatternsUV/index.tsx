import { Page } from "@components";
import { PatternsUV } from "./PatternsUV";

export default function PatternsUVPage() {
  return (
    <Page
      orthographic
      cameraProps={{
        zoom: 55
      }}
    >
      <PatternsUV />
    </Page>
  );
}
