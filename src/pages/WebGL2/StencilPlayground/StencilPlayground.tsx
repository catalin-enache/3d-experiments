import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop } from "@lib/utils/webgl";
import {
  defaultPass,
  bin,
  passDescription,
  type Params,
  type PassSettings
} from "./settings";
import { applyPreset } from "./presets";
import { palette, stencilValueOf } from "./palette";
import { createShapes, type ShapeRange } from "./shapes";
import { createPane, type Info } from "./pane";
import { createOverlay } from "./overlay";

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

  const { vao, quad, circle, circleRim } = createShapes(
    gl,
    positionAttributeLocation
  );

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

  const params: Params = {
    view: "split",
    preset: 0,
    clearStencil: 0,
    blocker: false,
    outlines: true,
    pass1: defaultPass(),
    pass2: defaultPass()
  };
  applyPreset(params, params.preset);

  const info: Info = { pass1Test: "", pass2Test: "", underCursor: "-" };
  const pane = createPane(params, info);
  const overlay = createOverlay(container);

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
    { first, count }: ShapeRange,
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

  const drawCircle = (center: number[], color: number[], outline = false) =>
    drawShape(
      outline ? circleRim : circle,
      outline ? gl.LINE_LOOP : gl.TRIANGLE_FAN,
      center,
      [circleRadius, circleRadius],
      color
    );

  const drawRect = (
    { center, halfSize }: { center: number[]; halfSize: number[] },
    color: number[],
    outline = false,
    depth = 0
  ) =>
    drawShape(
      quad,
      outline ? gl.LINE_LOOP : gl.TRIANGLE_FAN,
      center,
      halfSize,
      color,
      depth
    );

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
      drawRect(blocker, blockerColor, false, -0.5);
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
        quad,
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
        drawCircle(center, [color[0], color[1], color[2], 1], true);
      }
      drawRect(rect, [1, 0.85, 0.2, 1], true);
      if (params.blocker) {
        drawRect(blocker, [0.7, 0.7, 0.75, 1], true);
      }
    }
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
      const value = stencilValueOf(pixel);
      // undefined on the outlines
      if (value !== undefined)
        info.underCursor = `${String(value)} (${bin(value)})`;
    }

    overlay.update(params.view);
  }

  return loop({
    tick,
    cleanUp: () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      overlay.dispose();
      pane.dispose();
      cleanUp();
    }
  });
}
