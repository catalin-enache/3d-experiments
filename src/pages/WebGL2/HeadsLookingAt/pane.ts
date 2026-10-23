import { Pane } from "tweakpane";

export interface Params {
  // in degrees
  targetAngle: number;
  targetHeight: number;
}

export function createPane(params: Params) {
  const pane = new Pane({ title: "Target" });
  pane.addBinding(params, "targetAngle", {
    label: "angle",
    min: -360,
    max: 360,
    step: 1
  });
  pane.addBinding(params, "targetHeight", {
    label: "height",
    min: 50,
    max: 300,
    step: 1
  });
  return pane;
}
