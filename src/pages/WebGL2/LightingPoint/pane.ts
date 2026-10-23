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
  // DIFFERENT from the directional light: the light is a point in the world
  lightX: number;
  lightY: number;
  lightZ: number;
  // DIFFERENT: distance at which the light is at half its brightness
  falloffDistance: number;
  // 0..1 per channel
  lightColor: { r: number; g: number; b: number };
  shininess: number;
}

export function createPane(params: Params) {
  const pane = new Pane({ title: "Lighting Point" });
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
  // DIFFERENT: the light can be moved around the scene
  const lightFolder = pane.addFolder({ title: "Light position" });
  for (const key of ["lightX", "lightY", "lightZ"] as const) {
    lightFolder.addBinding(params, key, { min: -300, max: 300, step: 1 });
  }
  lightFolder.addBinding(params, "falloffDistance", {
    label: "half brightness at",
    min: 10,
    max: 1000,
    step: 1
  });
  lightFolder.addBinding(params, "lightColor", {
    label: "light color",
    color: { type: "float" }
  });
  lightFolder.addBinding(params, "shininess", { min: 1, max: 500, step: 1 });
  return pane;
}
