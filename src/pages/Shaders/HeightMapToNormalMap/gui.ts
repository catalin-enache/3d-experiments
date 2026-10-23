import GUI from "lil-gui";

export interface Uniforms {
  uIntensity: { value: number };
  uOffset: { value: number };
}

export function createGui(uniforms: Uniforms) {
  const gui = new GUI();

  gui.add(uniforms.uIntensity, "value", 0, 10, 0.1).name("Intensity");

  gui.add(uniforms.uOffset, "value", -1, 1, 0.01).name("Offset");

  return gui;
}
