import GUI from "lil-gui";
import type { effects } from "./kernels";

export function createGui(effectsList: typeof effects) {
  const gui = new GUI({ title: "Image processing" });
  const effectsFolder = gui.addFolder("Effects");
  for (const effect of effectsList) {
    effectsFolder.add(effect, "on").name(effect.name);
  }
  return gui;
}
