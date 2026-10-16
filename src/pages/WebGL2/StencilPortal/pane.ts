import { Pane } from "tweakpane";

export interface Params {
  useStencil: boolean;
  // in degrees, the camera turns around the portal
  cameraAngle: number;
  animateCamera: boolean;
  cameraHeight: number;
}

export function createPane(params: Params) {
  const pane = new Pane({ title: "Stencil Portal" });
  pane.addBinding(params, "useStencil", { label: "use stencil" });
  const animateBinding = pane.addBinding(params, "animateCamera", {
    label: "animate camera"
  });
  // the slider only drives the camera when it isn't animating
  const angleBinding = pane.addBinding(params, "cameraAngle", {
    label: "camera angle",
    min: -180,
    max: 180,
    step: 1,
    disabled: params.animateCamera
  });
  animateBinding.on("change", ({ value }) => {
    angleBinding.disabled = value;
  });
  pane.addBinding(params, "cameraHeight", {
    label: "camera height",
    min: -60,
    max: 300,
    step: 1
  });
  return pane;
}
