import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop, type Timer } from "@lib/utils/webgl";
import * as m3 from "@lib/webgl2fundamentals/m3";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

export async function WebGL2Basic({
  container,
  webglContextAttributes
}: ScenarioParams) {
  const { gl, cleanUp } = init({ container, webglContextAttributes });

  const program = await createProgram({
    gl,
    vertexShaderSource,
    fragmentShaderSource
  });

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");
  const colorLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // prettier-ignore
  const positions1 = [
    -35, -5,
    35, -5,
    -35, 5,
    -35, 5,
    35, -5,
    35, 5
  ];
  const positionsFloat32Array1 = new Float32Array(positions1);
  // gl.bufferData(gl.ARRAY_BUFFER, positionsFloat32Array1, gl.STATIC_DRAW);

  // prettier-ignore
  const positions2 = [
    -35, -35,
    35, -35,
    -35, 35,
    -35, 35,
    35, -35,
    35, 35
  ];
  const positionsFloat32Array2 = new Float32Array(positions2);

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer

  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  const color1 = [Math.random(), Math.random(), Math.random(), 1];
  const color2 = [Math.random(), Math.random(), Math.random(), 1];

  function tick({ timer }: { timer: Timer }) {
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    const now = timer.getElapsed();
    // const matrix = m3.rotation(now * 0.99);
    // const matrix = m3.translation(gl.canvas.width / 2, gl.canvas.height / 2);
    const matrix = m3.multiply(
      m3.translation(100, 100),
      m3.rotation(now * 0.75)
    );
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
    gl.uniform4f(colorLocation, color1[0], color1[1], color1[2], color1[3]);
    gl.bufferData(gl.ARRAY_BUFFER, positionsFloat32Array1, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    //  ============

    const matrix2 = m3.multiply(
      m3.translation(gl.canvas.width / 2, gl.canvas.height / 2),
      m3.rotation(-now * 0.35)
    );
    gl.uniformMatrix3fv(matrixLocation, false, matrix2);
    gl.uniform4f(colorLocation, color2[0], color2[1], color2[2], color2[3]);
    gl.bufferData(gl.ARRAY_BUFFER, positionsFloat32Array2, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  return loop({
    tick,
    cleanUp
  });
}
