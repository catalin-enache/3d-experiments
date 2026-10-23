import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import { head3D, head3DColors, headVertexCount } from "@lib/geometries";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";
import { createPane, type Params } from "./pane";

// https://webgl2fundamentals.org/webgl/lessons/webgl-3d-camera.html
export async function HeadsLookingAt({
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
  head3D(gl);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  head3DColors(gl);
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
    targetAngle: 0,
    targetHeight: 200
  };

  const pane = createPane(params);

  const targetRadius = 300;
  const up = [0, 1, 0];
  const cameraPosition = [500, 300, 500];
  const cameraTarget = [0, -100, 0];
  // heads in a grid
  const deep = 5;
  const across = 5;

  // only draw the faces pointing toward the viewer
  gl.enable(gl.CULL_FACE);
  // only draw pixels closer than what's already been drawn
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  function drawHead(matrix: m4.Matrix4, viewProjectionMatrix: m4.Matrix4) {
    gl.uniformMatrix4fv(
      matrixLocation,
      false,
      m4.multiply(viewProjectionMatrix, matrix)
    );
    gl.drawArrays(gl.TRIANGLES, 0, headVertexCount);
  }

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

    // the camera is fixed, looking down at the grid of heads
    const cameraMatrix = m4.lookAt(cameraPosition, cameraTarget, up);
    // the view matrix moves the world so the camera is effectively at the origin
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // the target orbits around the grid
    const targetAngle = degToRad(params.targetAngle);
    const target = [
      Math.sin(targetAngle) * targetRadius,
      params.targetHeight,
      Math.cos(targetAngle) * targetRadius
    ];

    // every head in the grid turns to look at the target
    for (let zz = 0; zz < deep; ++zz) {
      const v = zz / (deep - 1);
      const z = (v - 0.5) * deep * 150;
      for (let xx = 0; xx < across; ++xx) {
        const u = xx / (across - 1);
        const x = (u - 0.5) * across * 150;
        drawHead(m4.lookAt([x, 0, z], target, up), viewProjectionMatrix);
      }
    }

    // draw a head at the target itself
    drawHead(
      m4.translation(target[0], target[1], target[2]),
      viewProjectionMatrix
    );
  }

  return loop({
    tick,
    cleanUp: () => {
      pane.dispose();
      cleanUp();
    }
  });
}
