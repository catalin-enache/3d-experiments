import { Pane } from "tweakpane";
import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import {
  centeredLetterF3D,
  letterF3DColors,
  letterF3DVertexCount
} from "@lib/geometries";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

export async function Camera3D({
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
  centeredLetterF3D(gl);
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
    // in degrees
    cameraAngle: 0
  };

  const pane = new Pane({ title: "Camera" });
  pane.addBinding(params, "cameraAngle", {
    label: "angle",
    min: -360,
    max: 360,
    step: 1
  });

  const numFs = 5;
  const radius = 200;
  const up = [0, 1, 0];
  // the camera always looks at the first F
  const fPosition = [radius, 0, 0];

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

    const projectionMatrix = m4.perspective(
      degToRad(60),
      gl.canvas.width / gl.canvas.height,
      1,
      2000
    );

    // orbit the camera around the origin, slightly above and outside the circle of Fs
    let cameraMatrix = m4.yRotation(degToRad(params.cameraAngle));
    cameraMatrix = m4.translate(cameraMatrix, 0, 50, radius * 1.5);
    const cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14]
    ];

    // point the camera at the first F
    cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);

    // the view matrix moves the world so the camera is effectively at the origin
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // draw 'F's in a circle
    for (let i = 0; i < numFs; ++i) {
      const angle = (i * Math.PI * 2) / numFs;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const matrix = m4.translate(viewProjectionMatrix, x, 0, z);

      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      gl.drawArrays(gl.TRIANGLES, 0, letterF3DVertexCount);
    }
  }

  return loop({
    tick,
    cleanUp: () => {
      pane.dispose();
      cleanUp();
    }
  });
}
