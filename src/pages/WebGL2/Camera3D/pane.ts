import { Pane } from "tweakpane";

export interface Params {
  // in degrees
  cameraAngle: number;
}

export function createPane(params: Params) {
  const pane = new Pane({ title: "Camera" });
  pane.addBinding(params, "cameraAngle", {
    label: "angle",
    min: -360,
    max: 360,
    step: 1
  });
  return pane;
}
