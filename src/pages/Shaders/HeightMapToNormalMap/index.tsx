import { Page } from "@components";
import { HeightMapToNormalMap } from "./HeightMapToNormalMap";

export default function HeightMapToNormalMapPage() {
  return (
    <Page
      cameraProps={{
        position: [0, 0, 10]
      }}
    >
      <HeightMapToNormalMap />
    </Page>
  );
}
