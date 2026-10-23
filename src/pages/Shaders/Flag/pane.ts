import { Pane } from "tweakpane";

export interface Params {
  tessellation: number;
}

interface Uniforms {
  uIntensity: { value: number };
  uFrequency: { value: { x: number; y: number } };
}

export function createPane(
  params: Params,
  uniforms: Uniforms,
  { onTessellationChange }: { onTessellationChange: (value: number) => void }
) {
  const pane = new Pane({
    title: "Shader Flag"
  });

  pane
    .addBinding(params, "tessellation", {
      label: "Tessellation",
      min: 1,
      max: 256,
      step: 1
    })
    .on("change", ({ value }) => {
      onTessellationChange(value);
    });

  pane.addBinding(uniforms.uIntensity, "value", {
    label: "Intensity",
    min: 0,
    max: 1,
    step: 0.1
  });

  const frequencyFolder = pane.addFolder({
    title: "Frequency"
  });

  frequencyFolder.addBinding(uniforms.uFrequency.value, "x", {
    label: "X",
    min: 0,
    max: 2,
    step: 0.1
  });

  frequencyFolder.addBinding(uniforms.uFrequency.value, "y", {
    label: "Y",
    min: 0,
    max: 2,
    step: 0.1
  });

  return pane;
}
