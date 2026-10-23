import GUI from "lil-gui";

interface Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Uniforms {
  uShape: { value: number };
  uVars: { value: Vec4 };
}

interface Params {
  shape: number;
  vars: Vec4;
}

export function createGui(uniforms: Uniforms) {
  const gui = new GUI();

  const params: Params = {
    shape: uniforms.uShape.value,

    vars: {
      x: uniforms.uVars.value.x,
      y: uniforms.uVars.value.y,
      z: uniforms.uVars.value.z,
      w: uniforms.uVars.value.w
    }
  };

  gui
    .add(params, "shape", 1, 30, 1)
    .name("Shape")
    .onChange((value: number) => {
      uniforms.uShape.value = value;
    });

  const varsFolder = gui.addFolder("Vars");

  varsFolder
    .add(params.vars, "x", 0, 1, 0.01)
    .name("X")
    .onChange((value: number) => {
      uniforms.uVars.value.x = value;
    });

  varsFolder
    .add(params.vars, "y", 0, 1, 0.01)
    .name("Y")
    .onChange((value: number) => {
      uniforms.uVars.value.y = value;
    });

  varsFolder
    .add(params.vars, "z", 0, 1, 0.01)
    .name("Z")
    .onChange((value: number) => {
      uniforms.uVars.value.z = value;
    });

  varsFolder
    .add(params.vars, "w", 0, 1, 0.01)
    .name("W")
    .onChange((value: number) => {
      uniforms.uVars.value.w = value;
    });

  return gui;
}
