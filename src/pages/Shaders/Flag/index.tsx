import { Page } from "@components";
import Flag from "./Flag";

export default function FlagPage() {
  return (
    <Page
      orthographic
      cameraProps={{
        zoom: 55
      }}
    >
      <Flag />
    </Page>
  );
}
