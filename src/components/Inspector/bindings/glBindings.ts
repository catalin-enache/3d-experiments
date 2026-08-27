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

  const infoFolder = glFolder.addFolder({
    title: "Info",
    expanded: false
  });

  infoFolder.addBinding(gl.info.render, "calls", {
    label: "Calls",
    disabled: true
  });

  infoFolder.addBinding(gl.info.render, "frame", {
    label: "Frame",
    disabled: true
  });

  infoFolder.addBinding(gl.info.render, "lines", {
    label: "Lines",
    disabled: true
  });

  infoFolder.addBinding(gl.info.render, "points", {
    label: "Points",
    disabled: true
  });

  infoFolder.addBinding(gl.info.render, "triangles", {
    label: "Triangles",
    disabled: true
  });
  infoFolder.addBinding(gl.info.memory, "geometries", {
    label: "Geometries",
    disabled: true
  });

  infoFolder.addBinding(gl.info.memory, "textures", {
    label: "Textures",
    disabled: true
  });
};
