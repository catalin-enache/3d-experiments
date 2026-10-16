import { Pane } from "tweakpane";
import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop } from "@lib/utils/webgl";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

// A playground for the stencil state.
//
// The stencil buffer holds one 8 bit value (0..255) per pixel. It is never
// shown, it is only a mask: every draw can test against it and write into it.
// Three calls configure it (the stencil test must be enabled):
//
//   gl.stencilFunc(func, ref, mask)
//     the TEST. A pixel passes when
//       (ref & mask) func (stencil & mask)
//     ref is on the LEFT: LESS means "ref < stencil".
//     A pixel that fails is not drawn (no color, no depth).
//
//   gl.stencilOp(sfail, dpfail, dppass)
//     what to WRITE into the stencil, depending on what happened to the pixel:
//       sfail:  the stencil test failed
//       dpfail: the stencil test passed but the depth test failed
//       dppass: both passed (the pixel is drawn)
//     KEEP leaves the value, ZERO sets 0, REPLACE sets ref, INCR / DECR add /
//     subtract 1 and stop at 255 / 0, INCR_WRAP / DECR_WRAP wrap around
//     (255 + 1 = 0, 0 - 1 = 255), INVERT flips all the bits.
//
//   gl.stencilMask(mask)
//     which BITS can be written, the others keep their old value:
//       stencil = (old & ~mask) | (new & mask)
//     It is also used by gl.clear, so it must be 0xff to clear all the bits.
//
// (stencilFuncSeparate, stencilOpSeparate and stencilMaskSeparate do the same
// with different settings for front and back faces.)
//
// The scene is drawn twice: on the left as it is (the color buffer) and on
// the right with every stencil value painted in its own color.
// The stencil can't be read directly, so the right side is painted by drawing
// a full screen quad 256 times, with stencilFunc(EQUAL, value) for each value:
// every pixel is painted only by the quad of its own value.
export async function StencilPlayground({
  container,
  webglContextAttributes
}: ScenarioParams) {
  const { gl, cleanUp } = init({ container, webglContextAttributes });
  const canvas = gl.canvas as HTMLCanvasElement;

  const program = await createProgram({
    gl,
    vertexShaderSource,
    fragmentShaderSource
  });

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const transformLocation = gl.getUniformLocation(program, "u_transform");
  const aspectLocation = gl.getUniformLocation(program, "u_aspect");
  const depthLocation = gl.getUniformLocation(program, "u_depth");
  const colorLocation = gl.getUniformLocation(program, "u_color");

  // one buffer for both shapes:
  // the quad (4 vertices, drawn as a fan or as an outline)
  // then the circle (center + rim, drawn as a fan, the rim alone is its outline)
  const circleSegments = 64;
  const vertices = [-1, -1, 1, -1, 1, 1, -1, 1];
  const quadFirst = 0;
  const quadCount = 4;
  const circleFirst = vertices.length / 2;
  vertices.push(0, 0);
  for (let i = 0; i <= circleSegments; ++i) {
    const angle = (i / circleSegments) * Math.PI * 2;
    vertices.push(Math.cos(angle), Math.sin(angle));
  }
  // center + rim + the first rim point again to close the fan
  const circleCount = circleSegments + 2;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // the shapes, in a space where y goes from -1 to 1
  const circleRadius = 0.42;
  const circles = [
    { center: [-0.24, 0.16], color: [1, 0.25, 0.25, 0.5] },
    { center: [0.24, 0.16], color: [0.25, 1, 0.3, 0.5] },
    { center: [0, -0.24], color: [0.3, 0.45, 1, 0.5] }
  ];
  // pass 2 draws a rectangle covering most of the circles
  const rect = { center: [0, -0.02], halfSize: [0.82, 0.78] };
  const rectColor = [1, 0.85, 0.2, 0.85];
  // a vertical bar in front of everything, to make the depth test fail
  const blocker = { center: [0, 0], halfSize: [0.1, 0.95] };
  const blockerColor = [0.45, 0.45, 0.5, 1];

  // the stencil value colors: 0 is almost black, 1..15 are distinct colors,
  // 16..247 are grays as bright as the value, 248..254 are light colors
  // (the values right below 255 that DECR_WRAP and INVERT give) and 255 is white.
  // All different, so the value under the cursor can be read back from the color
  // prettier-ignore
  const vividColors = [
    [24, 24, 32],
    [255, 99, 71], [60, 180, 75], [65, 105, 225], [255, 215, 0],
    [186, 85, 211], [0, 206, 209], [255, 140, 0], [255, 105, 180],
    [154, 205, 50], [30, 144, 255], [210, 180, 140], [128, 0, 128],
    [0, 128, 128], [128, 128, 0], [220, 20, 60]
  ];
  const palette: number[][] = [];
  const valueByColor = new Map<number, number>();
  for (let value = 0; value < 256; ++value) {
    let rgb = vividColors[value] ?? [value, value, value];
    if (value >= 248 && value < 255) {
      // 254 is a light version of the color of 1, 253 of 2, ...
      rgb = vividColors[255 - value].map((c) => Math.round((c + 255) / 2));
    }
    palette.push(rgb);
    valueByColor.set((rgb[0] << 16) | (rgb[1] << 8) | rgb[2], value);
  }

  const funcs = {
    NEVER: gl.NEVER,
    LESS: gl.LESS,
    LEQUAL: gl.LEQUAL,
    GREATER: gl.GREATER,
    GEQUAL: gl.GEQUAL,
    EQUAL: gl.EQUAL,
    NOTEQUAL: gl.NOTEQUAL,
    ALWAYS: gl.ALWAYS
  };
  const funcSymbols: Record<number, string> = {
    [gl.NEVER]: "never",
    [gl.LESS]: "<",
    [gl.LEQUAL]: "<=",
    [gl.GREATER]: ">",
    [gl.GEQUAL]: ">=",
    [gl.EQUAL]: "==",
    [gl.NOTEQUAL]: "!=",
    [gl.ALWAYS]: "always"
  };
  const ops = {
    KEEP: gl.KEEP,
    ZERO: gl.ZERO,
    REPLACE: gl.REPLACE,
    INCR: gl.INCR,
    INCR_WRAP: gl.INCR_WRAP,
    DECR: gl.DECR,
    DECR_WRAP: gl.DECR_WRAP,
    INVERT: gl.INVERT
  };

  interface PassSettings {
    enabled: boolean;
    // write the color (colorMask), off = the pass only changes the stencil
    colorWrite: boolean;
    depthTest: boolean;
    func: number;
    ref: number;
    funcMask: number;
    writeMask: number;
    sfail: number;
    dpfail: number;
    dppass: number;
  }

  const defaultPass = (): PassSettings => ({
    enabled: true,
    colorWrite: true,
    depthTest: true,
    func: gl.ALWAYS,
    ref: 1,
    funcMask: 0xff,
    writeMask: 0xff,
    sfail: gl.KEEP,
    dpfail: gl.KEEP,
    dppass: gl.KEEP
  });

  const params = {
    view: "split",
    // index in presets
    preset: 0,
    clearStencil: 0,
    blocker: false,
    outlines: true,
    pass1: defaultPass(),
    pass2: defaultPass()
  };

  // shown in the pane, updated every frame
  const info = {
    pass1Test: "",
    pass2Test: "",
    underCursor: "-"
  };

  // presets, each starts from the defaults and changes a few things
  const presets: {
    title: string;
    apply: () => void;
  }[] = [
    {
      // every circle adds 1 where it is drawn: the stencil counts the overlaps.
      // Pass 2 is drawn only where exactly 2 circles overlap
      title: "Count overlaps (INCR)",
      apply: () => {
        Object.assign(params.pass1, { dppass: gl.INCR });
        Object.assign(params.pass2, { func: gl.EQUAL, ref: 2 });
      }
    },
    {
      // the circles stamp 1, pass 2 is drawn everywhere else
      title: "Mask outside (REPLACE + NOTEQUAL)",
      apply: () => {
        Object.assign(params.pass1, { ref: 1, dppass: gl.REPLACE });
        Object.assign(params.pass2, { func: gl.NOTEQUAL, ref: 1 });
      }
    },
    {
      // the func mask only looks at bit 0: odd counts (1 and 3) pass
      title: "Odd overlaps (func mask)",
      apply: () => {
        Object.assign(params.pass1, { dppass: gl.INCR });
        Object.assign(params.pass2, { func: gl.EQUAL, ref: 1, funcMask: 1 });
      }
    },
    {
      // INVERT flips all bits every time a circle is drawn: 0 -> 255 -> 0 ...
      // Only bit 0 is writable so it toggles between 0 and 1: XOR of the circles
      title: "XOR (INVERT + write mask)",
      apply: () => {
        Object.assign(params.pass1, { dppass: gl.INVERT, writeMask: 1 });
        Object.assign(params.pass2, { func: gl.EQUAL, ref: 1 });
      }
    },
    {
      // REPLACE writes ref, but the write mask only lets the low 4 bits through:
      // 255 & 0b00001111 = 15
      title: "Write mask (REPLACE 255 -> 15)",
      apply: () => {
        Object.assign(params.pass1, {
          ref: 255,
          dppass: gl.REPLACE,
          writeMask: 0b00001111
        });
        Object.assign(params.pass2, { func: gl.EQUAL, ref: 15 });
      }
    },
    {
      // 0 - 1 wraps to 255, then 254, 253. Remember ref is on the left:
      // LESS with ref 253 means 253 < stencil, so 1 or 2 overlaps pass
      title: "Wrap around (DECR_WRAP + LESS)",
      apply: () => {
        Object.assign(params.pass1, { dppass: gl.DECR_WRAP });
        Object.assign(params.pass2, { func: gl.LESS, ref: 253 });
      }
    },
    {
      // where the circles are hidden by the blocker the depth test fails:
      // dpfail marks them with 1. Pass 2 ignores the depth and is drawn
      // only there, like an x-ray view of what is hidden
      title: "X-ray (depth fail)",
      apply: () => {
        params.blocker = true;
        Object.assign(params.pass1, { ref: 1, dpfail: gl.REPLACE });
        Object.assign(params.pass2, {
          func: gl.EQUAL,
          ref: 1,
          depthTest: false
        });
      }
    },
    {
      // the circles are drawn only where the stencil is 0.
      // A circle stamps 1 where it is drawn, so the next circles fail there:
      // the first circle drawn covers the others, nothing is drawn twice
      title: "No overdraw (EQUAL 0 + INCR)",
      apply: () => {
        Object.assign(params.pass1, {
          func: gl.EQUAL,
          ref: 0,
          dppass: gl.INCR
        });
        params.pass2.enabled = false;
      }
    }
  ];

  function applyPreset(apply: () => void) {
    params.clearStencil = 0;
    params.blocker = false;
    Object.assign(params.pass1, defaultPass());
    Object.assign(params.pass2, defaultPass());
    apply();
    pane.refresh();
  }

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
      applyPreset(presets[value].apply);
    });

  const tabs = pane.addTab({
    pages: [{ title: "Pass 1" }, { title: "Pass 2" }, { title: "Scene" }]
  });

  const bin = (value: number) => value.toString(2).padStart(8, "0");

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

  applyPreset(presets[0].apply);

  const { overlay, colorLabel, stencilLabel, legend } = createOverlay(
    container,
    palette
  );

  // the value under the cursor is read back from the stencil view
  let mouse: { x: number; y: number } | null = null;
  const onMouseMove = (event: MouseEvent) => {
    mouse = { x: event.offsetX, y: canvas.height - 1 - event.offsetY };
  };
  const onMouseLeave = () => {
    mouse = null;
  };
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseleave", onMouseLeave);

  gl.useProgram(program);
  gl.bindVertexArray(vao);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let aspect = 1;

  function drawShape(
    first: number,
    count: number,
    mode: number,
    center: number[],
    scale: number[],
    color: number[],
    depth = 0
  ) {
    gl.uniform4f(transformLocation, scale[0], scale[1], center[0], center[1]);
    gl.uniform1f(aspectLocation, aspect);
    gl.uniform1f(depthLocation, depth);
    gl.uniform4fv(colorLocation, color);
    gl.drawArrays(mode, first, count);
  }

  const drawCircle = (
    center: number[],
    color: number[],
    mode: number = gl.TRIANGLE_FAN
  ) =>
    mode === gl.TRIANGLE_FAN
      ? drawShape(
          circleFirst,
          circleCount,
          mode,
          center,
          [circleRadius, circleRadius],
          color
        )
      : // the rim only, without the center and the closing point
        drawShape(
          circleFirst + 1,
          circleSegments,
          mode,
          center,
          [circleRadius, circleRadius],
          color
        );

  const drawRect = (
    { center, halfSize }: { center: number[]; halfSize: number[] },
    color: number[],
    mode: number = gl.TRIANGLE_FAN,
    depth = 0
  ) => drawShape(quadFirst, quadCount, mode, center, halfSize, color, depth);

  function applyPass(pass: PassSettings) {
    gl.enable(gl.STENCIL_TEST);
    gl.stencilFunc(pass.func, pass.ref, pass.funcMask);
    gl.stencilOp(pass.sfail, pass.dpfail, pass.dppass);
    gl.stencilMask(pass.writeMask);
    gl.colorMask(
      pass.colorWrite,
      pass.colorWrite,
      pass.colorWrite,
      pass.colorWrite
    );
    // the depth test decides between dpfail and dppass.
    // Turned off, it always passes and dpfail never happens
    if (pass.depthTest) {
      gl.enable(gl.DEPTH_TEST);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }
    // only the blocker writes depth, so the shapes never hide each other
    gl.depthMask(false);
    gl.enable(gl.BLEND);
  }

  // draws the whole scene in the current viewport
  function drawScene() {
    // clear uses the masks too: all the stencil bits and the depth must be writable
    gl.stencilMask(0xff);
    gl.depthMask(true);
    gl.colorMask(true, true, true, true);
    gl.clearColor(0.08, 0.08, 0.1, 1);
    gl.clearStencil(params.clearStencil);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    // the blocker only writes color and depth, it doesn't touch the stencil
    if (params.blocker) {
      gl.disable(gl.STENCIL_TEST);
      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
      drawRect(blocker, blockerColor, gl.TRIANGLE_FAN, -0.5);
    }

    // pass 1: the circles, one draw each, so where they overlap
    // a pixel goes through the stencil test and op once per circle
    if (params.pass1.enabled) {
      applyPass(params.pass1);
      for (const { center, color } of circles) {
        drawCircle(center, color);
      }
    }

    // pass 2: the rectangle, tested against what pass 1 left in the stencil
    if (params.pass2.enabled) {
      applyPass(params.pass2);
      drawRect(rect, rectColor);
    }
  }

  // paints every pixel with the color of its stencil value
  function drawStencilView() {
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.colorMask(true, true, true, true);
    gl.enable(gl.STENCIL_TEST);
    // only test, never write
    gl.stencilMask(0);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    for (let value = 0; value < 256; ++value) {
      gl.stencilFunc(gl.EQUAL, value, 0xff);
      const [r, g, b] = palette[value];
      // the quad covers the whole viewport whatever its aspect
      drawShape(
        quadFirst,
        quadCount,
        gl.TRIANGLE_FAN,
        [0, 0],
        [aspect, 1],
        [r / 255, g / 255, b / 255, 1]
      );
    }
    gl.disable(gl.STENCIL_TEST);

    // where the shapes are, to relate the values to them
    if (params.outlines) {
      for (const { center, color } of circles) {
        drawCircle(center, [color[0], color[1], color[2], 1], gl.LINE_LOOP);
      }
      drawRect(rect, [1, 0.85, 0.2, 1], gl.LINE_LOOP);
      if (params.blocker) {
        drawRect(blocker, [0.7, 0.7, 0.75, 1], gl.LINE_LOOP);
      }
    }
  }

  function passDescription(pass: PassSettings) {
    const symbol = funcSymbols[pass.func];
    if (pass.func === gl.NEVER || pass.func === gl.ALWAYS) {
      return symbol;
    }
    return `${bin(pass.ref & pass.funcMask)} ${symbol}\nstencil & ${bin(pass.funcMask)}`;
  }

  function tick() {
    const width = gl.canvas.width;
    const height = gl.canvas.height;
    const half = Math.floor(width / 2);

    // the viewports of the two views, the scissor keeps the clears inside them
    const colorView =
      params.view === "stencil"
        ? null
        : params.view === "split"
          ? [0, 0, half, height]
          : [0, 0, width, height];
    const stencilView =
      params.view === "color"
        ? null
        : params.view === "split"
          ? [half, 0, half, height]
          : [0, 0, width, height];

    gl.enable(gl.SCISSOR_TEST);
    for (const view of [colorView, stencilView]) {
      if (!view) continue;
      const [x, y, w, h] = view;
      gl.viewport(x, y, w, h);
      gl.scissor(x, y, w, h);
      aspect = w / h;
      drawScene();
      if (view === stencilView) {
        drawStencilView();
      }
    }
    gl.disable(gl.SCISSOR_TEST);

    info.pass1Test = passDescription(params.pass1);
    info.pass2Test = passDescription(params.pass2);

    // read the stencil view's color under the cursor and turn it back
    // into the stencil value. Over the color view, the same spot in the stencil view
    info.underCursor = "-";
    if (mouse && stencilView) {
      let { x } = mouse;
      if (params.view === "split" && x < half) x += half;
      const pixel = new Uint8Array(4);
      gl.readPixels(x, mouse.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      const value = valueByColor.get(
        (pixel[0] << 16) | (pixel[1] << 8) | pixel[2]
      );
      // undefined on the outlines
      if (value !== undefined)
        info.underCursor = `${String(value)} (${bin(value)})`;
    }

    colorLabel.style.display = colorView ? "" : "none";
    stencilLabel.style.display = stencilView ? "" : "none";
    const split = params.view === "split";
    stencilLabel.style.left = split ? "calc(50% + 8px)" : "8px";
    legend.style.left = split ? "calc(50% + 8px)" : "8px";
    legend.style.display = stencilView ? "flex" : "none";
  }

  return loop({
    tick,
    cleanUp: () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      container.removeChild(overlay);
      pane.dispose();
      cleanUp();
    }
  });
}

// labels over the two halves and a legend of the stencil colors
function createOverlay(container: HTMLElement, palette: number[][]) {
  // the overlay is placed over the container
  if (getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:absolute;inset:0;pointer-events:none;font:12px monospace;color:#ddd";
  const labelStyle =
    "position:absolute;top:8px;padding:2px 6px;background:rgba(0,0,0,0.6)";
  const colorLabel = document.createElement("div");
  colorLabel.textContent = "color buffer";
  colorLabel.style.cssText = `${labelStyle};left:8px`;
  const stencilLabel = document.createElement("div");
  stencilLabel.textContent = "stencil buffer";
  stencilLabel.style.cssText = labelStyle;
  const legend = document.createElement("div");
  legend.style.cssText =
    "position:absolute;bottom:8px;padding:4px 6px;background:rgba(0,0,0,0.6);display:flex;flex-wrap:wrap;gap:3px;max-width:calc(50% - 32px)";
  const addSwatch = (value: number) => {
    const [r, g, b] = palette[value];
    const swatch = document.createElement("div");
    swatch.textContent = String(value);
    const textColor = r + g + b > 380 ? "#000" : "#fff";
    swatch.style.cssText = `min-width:20px;padding:0 2px;text-align:center;background:rgb(${[r, g, b].join(",")});color:${textColor}`;
    legend.appendChild(swatch);
  };
  for (let value = 0; value < 16; ++value) addSwatch(value);
  const grays = document.createElement("div");
  grays.textContent = "16 .. 247";
  grays.style.cssText =
    "padding:0 6px;background:linear-gradient(to right,rgb(16,16,16),rgb(247,247,247));color:#f44";
  legend.appendChild(grays);
  for (let value = 248; value < 256; ++value) addSwatch(value);
  overlay.append(colorLabel, stencilLabel, legend);
  container.appendChild(overlay);
  return { overlay, colorLabel, stencilLabel, legend };
}
