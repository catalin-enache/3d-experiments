import type { Pane } from "tweakpane";
import * as THREE from "three/webgpu";
import * as THREE_WEBGL from "three";

export const glBindings = ({
  gl,
  pane,
  refresh
}: {
  gl: THREE.WebGPURenderer | THREE_WEBGL.WebGLRenderer;
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

  // @ts-ignore
  const glInfo = window.glInfo as
    THREE_WEBGL.WebGLRenderer["info"] | THREE.WebGPURenderer["info"];

  infoFolder.addBinding(glInfo.render, "calls", {
    label: "Calls",
    disabled: true
  });

  if ("frame" in glInfo.render) {
    infoFolder.addBinding(glInfo.render, "frame", {
      label: "Frame",
      disabled: true
    });
  }

  if ("frameCalls" in glInfo.render) {
    infoFolder.addBinding(glInfo.render, "frameCalls", {
      label: "Frame Calls",
      disabled: true
    });
  }

  if ("drawCalls" in glInfo.render) {
    infoFolder.addBinding(glInfo.render, "drawCalls", {
      label: "Draw Calls",
      disabled: true
    });
  }

  infoFolder.addBinding(glInfo.render, "lines", {
    label: "Lines",
    disabled: true
  });

  infoFolder.addBinding(glInfo.render, "points", {
    label: "Points",
    disabled: true
  });

  infoFolder.addBinding(glInfo.render, "triangles", {
    label: "Triangles",
    disabled: true
  });
  infoFolder.addBinding(glInfo.memory, "geometries", {
    label: "Geometries",
    disabled: true
  });

  infoFolder.addBinding(glInfo.memory, "textures", {
    label: "Textures",
    disabled: true
  });
};
