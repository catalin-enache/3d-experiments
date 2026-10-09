import { Pane } from "tweakpane";
import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import {
  letterF3D,
  letterF3DColors,
  letterF3DVertexCount
} from "@lib/geometries";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export async function Orthographic3D({
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
  letterF3D(gl);
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

  const params = {
    translation: { x: gl.canvas.width / 2, y: gl.canvas.height / 2, z: 0 },
    // in degrees
    rotation: { x: 40, y: 25, z: 325 },
    scale: { x: 1, y: 1, z: 1 }
  };

  const depth = 400;

  const pane = new Pane({ title: "Transform" });
  pane.addBinding(params, "translation", {
    x: { min: 0, max: gl.canvas.width, step: 1 },
    y: { min: 0, max: gl.canvas.height, step: 1 },
    z: { min: -depth, max: depth, step: 1 }
  });
  pane.addBinding(params, "rotation", {
    x: { min: -360, max: 360, step: 1 },
    y: { min: -360, max: 360, step: 1 },
    z: { min: -360, max: 360, step: 1 }
  });
  pane.addBinding(params, "scale", {
    x: { min: -5, max: 5, step: 0.01 },
    y: { min: -5, max: 5, step: 0.01 },
    z: { min: -5, max: 5, step: 0.01 }
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

    const { translation, rotation, scale } = params;

    // converts from pixels to clip space, z goes from depth to -depth
    let matrix = m4.orthographic(
      0,
      gl.canvas.width,
      gl.canvas.height,
      0,
      depth,
      -depth
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
