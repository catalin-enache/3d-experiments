import { Pane } from "tweakpane";
import { funcs, ops, type Params, type PassSettings } from "./settings";
import { applyPreset, presets } from "./presets";

// shown in the pane, updated every frame
export interface Info {
  pass1Test: string;
  pass2Test: string;
  underCursor: string;
}

export function createPane(params: Params, info: Info) {
  const pane = new Pane({ title: "Stencil Playground" });
  pane.addBinding(params, "view", {
    options: { split: "split", color: "color", stencil: "stencil" }
  });
  pane.addBinding(info, "underCursor", {
    label: "at cursor",
    readonly: true
  });

  pane
    .addBinding(params, "preset", {
      options: Object.fromEntries(presets.map(({ title }, i) => [title, i]))
    })
    .on("change", ({ value }) => {
      applyPreset(params, value);
      pane.refresh();
    });

  const tabs = pane.addTab({
    pages: [{ title: "Pass 1" }, { title: "Pass 2" }, { title: "Scene" }]
  });

  function addPassBindings(
    page: (typeof tabs.pages)[number],
    pass: PassSettings,
    infoKey: "pass1Test" | "pass2Test"
  ) {
    page.addBinding(pass, "enabled");
    page.addBinding(pass, "colorWrite", { label: "color write" });
    page.addBinding(pass, "depthTest", { label: "depth test" });

    const funcFolder = page.addFolder({
      title: "stencilFunc(func, ref, mask)"
    });
    funcFolder.addBinding(pass, "func", { options: funcs });
    funcFolder.addBinding(pass, "ref", { min: 0, max: 255, step: 1 });
    funcFolder.addBinding(pass, "funcMask", {
      label: "mask",
      min: 0,
      max: 255,
      step: 1
    });
    funcFolder.addBinding(info, infoKey, {
      label: "passes if",
      readonly: true,
      multiline: true,
      rows: 2
    });

    const opFolder = page.addFolder({
      title: "stencilOp(sfail, dpfail, dppass)"
    });
    opFolder.addBinding(pass, "sfail", { options: ops });
    opFolder.addBinding(pass, "dpfail", { options: ops });
    opFolder.addBinding(pass, "dppass", { options: ops });

    const maskFolder = page.addFolder({ title: "stencilMask(mask)" });
    maskFolder.addBinding(pass, "writeMask", {
      label: "mask",
      min: 0,
      max: 255,
      step: 1
    });
  }

  addPassBindings(tabs.pages[0], params.pass1, "pass1Test");
  addPassBindings(tabs.pages[1], params.pass2, "pass2Test");

  const scenePage = tabs.pages[2];
  scenePage.addBinding(params, "clearStencil", {
    label: "clearStencil",
    min: 0,
    max: 255,
    step: 1
  });
  scenePage.addBinding(params, "blocker", { label: "depth blocker" });
  scenePage.addBinding(params, "outlines", { label: "stencil outlines" });

  return pane;
}
