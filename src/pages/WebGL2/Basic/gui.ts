import GUI from "lil-gui";

export interface Params {
  translationX: number;
  translationY: number;
  // degrees
  rotation: number;
  // radians per second
  rotationSpeed: number;
  scaleX: number;
  scaleY: number;
}

export function createGui(transform: Params) {
  const gui = new GUI({ title: "Triangle transform" });
  const translationFolder = gui.addFolder("Translation");
  translationFolder.add(transform, "translationX", -2000, 2000, 1).name("x");
  translationFolder.add(transform, "translationY", -2000, 2000, 1).name("y");
  const rotationFolder = gui.addFolder("Rotation");
  rotationFolder.add(transform, "rotation", -360, 360, 1).name("angle (deg)");
  rotationFolder.add(transform, "rotationSpeed", -5, 5, 0.01).name("speed");
  const scaleFolder = gui.addFolder("Scale");
  scaleFolder.add(transform, "scaleX", -5, 5, 0.01).name("x");
  scaleFolder.add(transform, "scaleY", -5, 5, 0.01).name("y");
  return gui;
}
