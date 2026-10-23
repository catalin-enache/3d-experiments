import type { Vector4 } from "three/webgpu";
import { Pane } from "tweakpane";

export function createPane(vars: Vector4) {
  const pane = new Pane({
    title: "Material Distortion"
  });

  const varsFolder = pane.addFolder({
    title: "Vars"
  });

  varsFolder.addBinding(vars, "x", {
    label: "X",
    min: 0,
    max: 1,
    step: 0.01
  });

  varsFolder.addBinding(vars, "y", {
    label: "Y",
    min: 0,
    max: 1,
    step: 0.01
  });

  varsFolder.addBinding(vars, "z", {
    label: "Z",
    min: 0,
    max: 1,
    step: 0.01
  });

  varsFolder.addBinding(vars, "w", {
    label: "W",
    min: 0,
    max: 1,
    step: 0.01
  });

  return pane;
}
