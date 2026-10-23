import { Pane } from "tweakpane";

interface Uniforms {
  uPattern: { value: number };
  uVars: { value: { x: number; y: number; z: number; w: number } };
}

export function createPane(uniforms: Uniforms) {
  const pane = new Pane({
    title: "Shader Patterns UV"
  });

  pane.addBinding(uniforms.uPattern, "value", {
    label: "Pattern",
    min: 1,
    max: 40,
    step: 1
  });

  const varsFolder = pane.addFolder({
    title: "Vars"
  });

  varsFolder.addBinding(uniforms.uVars.value, "x", {
    label: "X",
    min: 0,
    max: 1,
    step: 0.01
  });

  varsFolder.addBinding(uniforms.uVars.value, "y", {
    label: "Y",
    min: 0,
    max: 1,
    step: 0.01
  });

  varsFolder.addBinding(uniforms.uVars.value, "z", {
    label: "Z",
    min: 0,
    max: 1,
    step: 0.01
  });

  varsFolder.addBinding(uniforms.uVars.value, "w", {
    label: "W",
    min: 0,
    max: 1,
    step: 0.01
  });

  return pane;
}
