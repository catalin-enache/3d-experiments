import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import {
  letterF3DPositions,
  letterF3DColors,
  letterF3DVertexCount
} from "@lib/geometries";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";
import { createPane, type Params } from "./pane";

// https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
export async function Projection3D({
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
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

  const matrixLocation = gl.getUniformLocation(program, "u_matrix");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  letterF3DPositions(gl);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  letterF3DColors(gl);
  gl.enableVertexAttribArray(colorAttributeLocation);
  // convert the colors from 0-255 to 0.0-1.0
  gl.vertexAttribPointer(
    colorAttributeLocation,
    3,
    gl.UNSIGNED_BYTE,
    true,
    0,
    0
  );

  const params: Params = {
    projection: "orthographic",
    translation: { x: 0, y: 0, z: -950 },
    rotation: { x: 40, y: 25, z: 325 },
    scale: { x: 1, y: 1, z: 1 }
  };

  const depth = 2000;

  const pane = createPane(params, {
    width: gl.canvas.width,
    height: gl.canvas.height,
    depth
  });

  // only draw the faces pointing toward the viewer
  gl.enable(gl.CULL_FACE);
  // only draw pixels closer than what's already been drawn
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  function tick() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const { projection, translation, rotation, scale } = params;

    let matrix =
      projection === "orthographic"
        ? // centered on the canvas, y up and looking down -z like perspective,
          // so it keeps the same handedness (winding order / depth direction)
          m4.orthographic(
            -gl.canvas.width / 2,
            gl.canvas.width / 2,
            -gl.canvas.height / 2,
            gl.canvas.height / 2,
            -depth,
            depth
          )
        : m4.perspective(
            degToRad(60),
            gl.canvas.width / gl.canvas.height,
            1,
            2000
          );
    matrix = m4.translate(matrix, translation.x, translation.y, translation.z);
    matrix = m4.xRotate(matrix, degToRad(rotation.x));
    matrix = m4.yRotate(matrix, degToRad(rotation.y));
    matrix = m4.zRotate(matrix, degToRad(rotation.z));
    matrix = m4.scale(matrix, scale.x, scale.y, scale.z);

    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, letterF3DVertexCount);
  }

  return loop({
    tick,
    cleanUp: () => {
      pane.dispose();
      cleanUp();
    }
  });
}
