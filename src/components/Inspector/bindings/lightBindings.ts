import * as THREE from "three";
import type { Pane } from "tweakpane";

export const lightBindings = ({
  pane,
  object
}: {
  pane: Pane;
  object: THREE.Light;
}) => {
  const lightFolder = pane.addFolder({ title: "Light" });
  lightFolder.addBinding(object, "color", {
    label: "Color",
    view: "color",
    color: { type: "float" }
  });
  lightFolder.addBinding(object, "intensity", { label: "Intensity", min: 0 });
  return lightFolder;
};
