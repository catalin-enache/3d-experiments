import { Pane } from "tweakpane";

export interface Params {
  projection: "perspective" | "orthographic";
  translation: { x: number; y: number; z: number };
  // in degrees
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

// the translation ranges: x and y span the canvas, z spans the depth
export interface Bounds {
  width: number;
  height: number;
  depth: number;
}

export function createPane(params: Params, { width, height, depth }: Bounds) {
  const pane = new Pane({ title: "Transform" });
  pane.addBinding(params, "projection", {
    options: {
      Perspective: "perspective",
      Orthographic: "orthographic"
    }
  });
  pane.addBinding(params, "translation", {
    x: { min: -width / 2, max: width / 2, step: 1 },
    y: { min: -height / 2, max: height / 2, step: 1 },
    z: { min: -depth, max: depth, step: 1 }
  });
  pane.addBinding(params, "rotation", {
    x: { min: -360, max: 360, step: 1 },
    y: { min: -360, max: 360, step: 1 },
    z: { min: -360, max: 360, step: 1 }
  });
  pane.addBinding(params, "scale", {
    x: { min: -5, max: 5, step: 0.01 },
    y: { min: -5, max: 5, step: 0.01 },
    z: { min: -5, max: 5, step: 0.01 }
  });
  return pane;
}
