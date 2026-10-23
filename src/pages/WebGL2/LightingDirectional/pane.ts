import { Pane } from "tweakpane";

export interface Params {
  // in degrees
  rotation: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  // when off, normals are transformed by the world matrix itself
  // so their distortion under non-uniform scaling can be observed
  inverseTranspose: boolean;
}

export function createPane(params: Params) {
  const pane = new Pane({ title: "Lighting Directional" });
  pane.addBinding(params, "rotation", {
    min: -360,
    max: 360,
    step: 1
  });
  // non-uniform scaling is where normals break if they are
  // transformed by the world matrix instead of its inverse transpose.
  // min > 0 keeps the world matrix invertible
  for (const key of ["scaleX", "scaleY", "scaleZ"] as const) {
    pane.addBinding(params, key, { min: 0.1, max: 3, step: 0.1 });
  }
  pane.addBinding(params, "inverseTranspose", { label: "inverse transpose" });
  return pane;
}
