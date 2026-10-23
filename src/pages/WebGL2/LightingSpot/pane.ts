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
  lightX: number;
  lightY: number;
  lightZ: number;
  // distance at which the light is at half its brightness
  falloffDistance: number;
  // 0..1 per channel
  lightColor: { r: number; g: number; b: number };
  shininess: number;
  // DIFFERENT from the point light: the point the spot is aimed at
  targetX: number;
  targetY: number;
  targetZ: number;
  // DIFFERENT: in degrees, from the center line of the spot to the edge
  // of the cone (half the cone's opening). Full light inside the inner cone,
  // fading out up to the outer cone
  innerAngle: number;
  outerAngle: number;
  // hides the banding of slow gradients (see the fragment shader)
  dithering: boolean;
  // in 8-bit levels, the noise goes from -strength to +strength
  ditherStrength: number;
}

export function createPane(params: Params) {
  const pane = new Pane({ title: "Lighting Spot" });
  pane.addBinding(params, "rotation", {
    min: -360,
    max: 360,
    step: 1
  });
  // min > 0 keeps the world matrix invertible
  for (const key of ["scaleX", "scaleY", "scaleZ"] as const) {
    pane.addBinding(params, key, { min: 0.1, max: 3, step: 0.1 });
  }
  pane.addBinding(params, "inverseTranspose", { label: "inverse transpose" });
  // off: look at the dark side of the floor, it shows bands
  pane.addBinding(params, "dithering");
  // too low leaves bands, too high shows the grain
  pane.addBinding(params, "ditherStrength", {
    label: "dither strength",
    min: 0,
    max: 4,
    step: 0.25
  });

  const lightFolder = pane.addFolder({ title: "Light" });
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

  // DIFFERENT: where the spot points and how wide its cone is
  const spotFolder = pane.addFolder({ title: "Spot" });
  for (const key of ["targetX", "targetY", "targetZ"] as const) {
    spotFolder.addBinding(params, key, { min: -300, max: 300, step: 1 });
  }
  // inner == outer gives a hard edge
  spotFolder.addBinding(params, "innerAngle", {
    label: "inner angle",
    min: 0,
    max: 90,
    step: 1
  });
  spotFolder.addBinding(params, "outerAngle", {
    label: "outer angle",
    min: 0,
    max: 90,
    step: 1
  });
  return pane;
}
