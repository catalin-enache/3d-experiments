import { Page } from "@components";
import { ProjectLongLatOnSphere } from "./ProjectLongLatOnSphere";

export default function ProjectLongLatOnSpherePage() {
  return (
    <Page orthographic rendererParams={{ useWebGpu: true }}>
      <ProjectLongLatOnSphere />
    </Page>
  );
}
