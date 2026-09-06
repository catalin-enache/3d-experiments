import { Page } from "@components";
import ScenarioHeightMapToNormalMap from "./ScenarioHeightMapToNormalMap";

export default function HeightMapToNormalMapPage() {
  return (
    <Page
      cameraProps={{
        position: [0, 0, 10]
      }}
    >
      <ScenarioHeightMapToNormalMap />
    </Page>
  );
}
