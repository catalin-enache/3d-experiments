import { Page } from "@components";
import { MaterialTest } from "./ScenarioMaterialTest";

export default function MaterialTestPage() {
  return (
    <Page
      raycasterParams={{
        Line: {
          threshold: 1
        }
      }}
    >
      <MaterialTest />
    </Page>
  );
}
