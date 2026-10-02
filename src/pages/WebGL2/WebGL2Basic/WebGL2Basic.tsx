import GUI from "lil-gui";
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

  // prettier-ignore
  const positionsFloat32Array1 = new Float32Array([
    0, -100,
    150, 125,
    -175, 100
  ]);

  // prettier-ignore
  const positionsFloat32Array2 = new Float32Array([
    -35, -35,
    35, -35,
    -35, 35,
    -35, 35,
    35, -35,
    35, 35
  ]);

  const color1 = [Math.random(), Math.random(), Math.random(), 1];
  const color2 = [Math.random(), Math.random(), Math.random(), 1];

  const program = await createProgram({
    gl,
    vertexShaderSource,
    fragmentShaderSource
  });

  const aPositionLocation = gl.getAttribLocation(program, "a_position");
  const aColorLocation = gl.getAttribLocation(program, "a_color");
  const uResolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const uMatrixLocation = gl.getUniformLocation(program, "u_matrix");
  const uColorLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray();
  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute on currently bound VAO
  gl.enableVertexAttribArray(aPositionLocation);
  gl.enableVertexAttribArray(aColorLocation);

  // (ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

  // (ARRAY_BUFFER = colorBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(aColorLocation, 4, gl.FLOAT, false, 0, 0);

  const transform1 = {
    translationX: 200,
    translationY: 200,
    rotation: 0, // degrees
    rotationSpeed: 0.75, // radians per second
    scaleX: 1,
    scaleY: 1
  };

  const gui = new GUI({ title: "Triangle transform" });
  const translationFolder = gui.addFolder("Translation");
  translationFolder.add(transform1, "translationX", -2000, 2000, 1).name("x");
  translationFolder.add(transform1, "translationY", -2000, 2000, 1).name("y");
  const rotationFolder = gui.addFolder("Rotation");
  rotationFolder.add(transform1, "rotation", -360, 360, 1).name("angle (deg)");
  rotationFolder.add(transform1, "rotationSpeed", -5, 5, 0.01).name("speed");
  const scaleFolder = gui.addFolder("Scale");
  scaleFolder.add(transform1, "scaleX", -5, 5, 0.01).name("x");
  scaleFolder.add(transform1, "scaleY", -5, 5, 0.01).name("y");

  function tick({ timer }: { timer: Timer }) {
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    gl.uniform2f(uResolutionLocation, gl.canvas.width, gl.canvas.height);

    const now = timer.getElapsed();
    // const matrix = m3.rotation(now * 0.99);
    // const matrix = m3.translation(gl.canvas.width / 2, gl.canvas.height / 2);
    const matrix = m3.multiply(
      m3.translation(transform1.translationX, transform1.translationY),
      m3.multiply(
        m3.rotation(
          m3.degToRad(transform1.rotation) + now * transform1.rotationSpeed
        ),
        m3.scaling(transform1.scaleX, transform1.scaleY)
      )
    );
    gl.uniformMatrix3fv(uMatrixLocation, false, matrix);
    gl.uniform4f(uColorLocation, color1[0], color1[1], color1[2], color1[3]);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionsFloat32Array1, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // 6 colors for 6 vertices
        0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1
      ]),
      gl.STATIC_DRAW
    );
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    //  ============

    const matrix2 = m3.multiply(
      m3.translation(gl.canvas.width / 2, gl.canvas.height / 2),
      m3.multiply(m3.rotation(-now * 0.35), m3.scaling(8, 1))
    );
    gl.uniformMatrix3fv(uMatrixLocation, false, matrix2);
    gl.uniform4f(uColorLocation, color2[0], color2[1], color2[2], color2[3]);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionsFloat32Array2, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // 6 colors for 6 vertices
        0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1
      ]),
      gl.STATIC_DRAW
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  return loop({
    tick,
    cleanUp: () => {
      gui.destroy();
      cleanUp();
    }
  });
}
