import { Page } from "@components";
import ScenarioProjectLongLatOnSphere from "./ScenarioProjectLongLatOnSphere";

export default function ProjectLongLatOnSpherePage() {
  return (
    <Page orthographic rendererParams={{ useWebGpu: true }}>
      <ScenarioProjectLongLatOnSphere />
    </Page>
  );
}
