import { Pane } from "tweakpane";

export interface Params {
  // in degrees
  rotationX: number;
  rotationY: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  // where the light comes from, in degrees:
  // horizontal goes left (-) / right (+), vertical goes bottom (-) / top (+)
  lightHorizontalYaw: number;
  lightVerticalPitch: number;
}

export function createPane(params: Params) {
  const pane = new Pane({ title: "Lighting Normal Map" });
  const cubeFolder = pane.addFolder({ title: "Cube" });
  for (const key of ["rotationX", "rotationY"] as const) {
    cubeFolder.addBinding(params, key, { min: -180, max: 180, step: 1 });
  }
  // min > 0 keeps the world matrix invertible
  for (const key of ["scaleX", "scaleY", "scaleZ"] as const) {
    cubeFolder.addBinding(params, key, { min: 0.1, max: 3, step: 0.1 });
  }
  const lightFolder = pane.addFolder({ title: "Light" });
  lightFolder.addBinding(params, "lightHorizontalYaw", {
    label: "left/right",
    min: -180,
    max: 180,
    step: 1
  });
  lightFolder.addBinding(params, "lightVerticalPitch", {
    label: "bottom/top",
    min: -90,
    max: 90,
    step: 1
  });
  return pane;
}
