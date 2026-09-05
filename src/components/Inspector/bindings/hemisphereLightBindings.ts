import * as THREE from "three/webgpu";
import { type FolderApi } from "tweakpane";

export const hemisphereLightBindings = ({
  object,
  lightFolder
}: {
  object: THREE.HemisphereLight;
  lightFolder: FolderApi;
}) => {
  const hemisphereFolder = lightFolder.addFolder({
    title: "Hemisphere Light"
  });

  hemisphereFolder.addBinding(object, "groundColor", {
    label: "Ground Color",
    view: "color",
    color: { type: "float" }
  });
};
