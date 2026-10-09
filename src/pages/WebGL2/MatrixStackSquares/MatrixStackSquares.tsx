import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop, type Timer } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { MatrixStack } from "@lib/webgl2fundamentals/matrixStack";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";
import { squares, type Square } from "./squares";

export async function MatrixStackSquares({
  container,
  webglContextAttributes
}: ScenarioParams) {
  const { gl, cleanUp } = init({ container, webglContextAttributes });

  const program = await createProgram({
    gl,
    vertexShaderSource,
    fragmentShaderSource
  });

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  const matrixLocation = gl.getUniformLocation(program, "u_matrix");
  const colorLocation = gl.getUniformLocation(program, "u_color");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Put a unit quad centered on the origin in the buffer
  // so rotations and scales happen around the square's center
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5
    ]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const matrixStack = new MatrixStack();

  function drawSquare(square: Square, time: number) {
    matrixStack.save();

    matrixStack.rotateZ(time * square.rotationSpeed);

    // children inherit the rotation above but not the aspect scale below
    for (const child of square.children) {
      matrixStack.save();
      // child positions are relative to the parent's size
      matrixStack.translate(child.x * square.size, child.y * square.size);
      drawSquare({ ...child, size: child.size * square.size }, time);
      matrixStack.restore();
    }

    matrixStack.scale(square.size * square.xScale, square.size * square.yScale);

    gl.uniformMatrix4fv(matrixLocation, false, matrixStack.getCurrentMatrix());
    gl.uniform4fv(colorLocation, square.color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    matrixStack.restore();
  }

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  function tick({ timer }: { timer: Timer }) {
    const time = timer.getElapsed();

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // the bottom of the stack converts from pixels to clip space
    matrixStack.setCurrentMatrix(
      m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1)
    );

    for (const square of squares) {
      matrixStack.save();
      matrixStack.translate(
        square.x * gl.canvas.width,
        square.y * gl.canvas.height
      );
      drawSquare(square, time);
      matrixStack.restore();
    }
  }

  return loop({ tick, cleanUp });
}
