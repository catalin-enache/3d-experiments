import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop, type Timer } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import {
  sphereVertices,
  sphereVertexCount,
  randomGrayColors
} from "@lib/geometries";
import { createSolarSystem } from "./solarSystem";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

// A sun, an earth and a moon moved by a scene graph.
//
// Every node of the graph has a transform relative to its parent;
// its world matrix is its parent's world matrix times its own (local) one.
// Rotating a node therefore rotates its whole subtree around the node's
// origin: an invisible "orbit" node placed at the sun and turned around y
// carries the earth (and the moon with it) around the sun,
// while a second orbit node at the earth turns the moon around the earth.
//
// Only the angles change every frame; each one is a plain number in a TRS
// (see solarSystem.ts for the hierarchy). The camera looks along y, the axis
// the orbits turn around, so they are seen face on, as circles.
//
// Ported from https://webgl2fundamentals.org/webgl/lessons/webgl-scene-graph.html
// The tutorial adds a fixed angle every frame (so it runs faster on faster
// screens); here every angle is a speed in radians per second times the time.
export async function SceneGraphPlanets({
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
  const colorMultLocation = gl.getUniformLocation(program, "u_colorMult");
  const colorOffsetLocation = gl.getUniformLocation(program, "u_colorOffset");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sphereVertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // one gray per sphere quad (6 vertices), so the spinning is visible
  const colors = randomGrayColors(sphereVertexCount, 6);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(colorAttributeLocation);
  // convert the colors from 0-255 to 0.0-1.0
  gl.vertexAttribPointer(
    colorAttributeLocation,
    4,
    gl.UNSIGNED_BYTE,
    true,
    0,
    0
  );

  const {
    root,
    bodies,
    sunTRS,
    earthOrbitTRS,
    earthTRS,
    moonOrbitTRS,
    moonTRS
  } = createSolarSystem();

  // radians per second around y
  // (the tutorial's per-frame angles at 60 frames per second)
  const speeds = {
    earthOrbit: 0.6,
    moonOrbit: 0.6,
    sunSpin: 0.3,
    earthSpin: 3,
    moonSpin: -0.6
  };

  // below the sun, looking up at it; z is up on the screen
  const camera = {
    position: [0, -200, 0],
    target: [0, 0, 0],
    up: [0, 0, 1]
  };
  const fieldOfView = degToRad(60);

  // reused every frame instead of allocating new matrices
  const viewProjectionMatrix = m4.identity();
  const bodyMatrix = m4.identity();

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  function tick({ timer }: { timer: Timer }) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = gl.canvas.width / gl.canvas.height;
    const projectionMatrix = m4.perspective(fieldOfView, aspect, 1, 2000);
    const cameraMatrix = m4.lookAt(camera.position, camera.target, camera.up);
    // the view matrix moves the world in front of the camera:
    // the inverse of the camera's own matrix
    const viewMatrix = m4.inverse(cameraMatrix);
    m4.multiply(projectionMatrix, viewMatrix, viewProjectionMatrix);

    const time = timer.getElapsed();
    earthOrbitTRS.rotation[1] = speeds.earthOrbit * time;
    moonOrbitTRS.rotation[1] = speeds.moonOrbit * time;
    sunTRS.rotation[1] = speeds.sunSpin * time;
    earthTRS.rotation[1] = speeds.earthSpin * time;
    moonTRS.rotation[1] = speeds.moonSpin * time;

    // one pass from the root updates every world matrix in the graph
    root.updateWorldMatrix();

    for (const { node, colorMult, colorOffset } of bodies) {
      m4.multiply(viewProjectionMatrix, node.worldMatrix, bodyMatrix);
      gl.uniformMatrix4fv(matrixLocation, false, bodyMatrix);
      gl.uniform4fv(colorMultLocation, colorMult);
      gl.uniform4fv(colorOffsetLocation, colorOffset);
      gl.drawArrays(gl.TRIANGLES, 0, sphereVertexCount);
    }
  }

  return loop({
    tick,
    cleanUp: () => {
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(colorBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      cleanUp();
    }
  });
}
