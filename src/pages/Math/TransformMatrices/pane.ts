import { Pane } from "tweakpane";

export interface Params {
  translation: { x: number; y: number; z: number };
  rotationDegrees: number;
  scale: { x: number; y: number; z: number };
}

export function createPane(params: Params) {
  const pane = new Pane({
    title: "Transform matrices"
  });

  /*
   * ---------------------------------------------------------
   * TRANSLATION
   * ---------------------------------------------------------
   */
  const translationFolder = pane.addFolder({
    title: "Translation"
  });

  translationFolder.addBinding(params.translation, "x", {
    min: -5,
    max: 5,
    step: 0.01
  });

  translationFolder.addBinding(params.translation, "y", {
    min: -5,
    max: 5,
    step: 0.01
  });

  translationFolder.addBinding(params.translation, "z", {
    min: -5,
    max: 5,
    step: 0.01
  });

  /*
   * ---------------------------------------------------------
   * ROTATION
   * ---------------------------------------------------------
   *
   * The angle is applied around the direction defined by:
   *
   * normalize(B - A)
   */
  const rotationFolder = pane.addFolder({
    title: "Rotation"
  });

  rotationFolder.addBinding(params, "rotationDegrees", {
    label: "angle",
    min: -180,
    max: 180,
    step: 1
  });

  /*
   * ---------------------------------------------------------
   * SCALE
   * ---------------------------------------------------------
   */
  const scaleFolder = pane.addFolder({
    title: "Scale"
  });

  scaleFolder.addBinding(params.scale, "x", {
    min: 0.1,
    max: 3,
    step: 0.01
  });

  scaleFolder.addBinding(params.scale, "y", {
    min: 0.1,
    max: 3,
    step: 0.01
  });

  scaleFolder.addBinding(params.scale, "z", {
    min: 0.1,
    max: 3,
    step: 0.01
  });

  return pane;
}
