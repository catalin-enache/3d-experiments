import type { Pane } from "tweakpane";
import * as THREE from "three";

export const glBindings = ({
  gl,
  pane,
  refresh
}: {
  gl: THREE.WebGLRenderer;
  pane: Pane;
  refresh: () => void;
}) => {
  const shadowTypeOptions = {
    Basic: THREE.BasicShadowMap,
    PCF: THREE.PCFShadowMap,
    VSM: THREE.VSMShadowMap
  };

  const glFolder = pane.addFolder({
    title: "GL",
    expanded: false
  });

  glFolder
    .addBinding(gl.shadowMap, "type", {
      label: "Shadow Map Type",
      options: shadowTypeOptions
    })
    .on("change", refresh);
};
