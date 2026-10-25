import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop, type Timer } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import { cubeVertices, cubeVertexCount } from "@lib/geometries";
import { createBlockGuy, type Part, type PartName } from "./blockGuy";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

// A walking "block guy" built with a scene graph.
//
// A scene graph is a tree of nodes. Every node only knows its transform
// relative to its parent (its local matrix); its place in the world
// is its parent's world matrix times its own local matrix.
// So rotating the upper arm swings the forearm and the hand with it,
// and moving the root moves the whole body, without any of them knowing.
//
// Every body part is the same unit cube drawn with its node's world matrix.
// Each local matrix is rebuilt every frame from a TRS
// (translation / rotation / scale), which is what the animation changes:
// it only sets a few angles per part and the hierarchy does the rest.
//
// Ported from https://webgl2fundamentals.org/webgl/lessons/webgl-scene-graph.html
export async function SceneGraph({
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
  gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, createFaceColors(), gl.STATIC_DRAW);
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

  const { root, parts, drawnParts } = createBlockGuy();

  const camera = {
    position: [4, 3.5, 10],
    target: [0, 3.5, 0],
    up: [0, 1, 0]
  };
  const fieldOfView = degToRad(60);

  // reused every frame instead of allocating new matrices
  const viewProjectionMatrix = m4.identity();
  const partMatrix = m4.identity();

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  // the same tint for every part: the gray face colors become blue shades
  gl.uniform4fv(colorMultLocation, [0.4, 0.4, 0.4, 1]);
  gl.uniform4fv(colorOffsetLocation, [0, 0, 0.6, 0]);

  function tick({ timer }: { timer: Timer }) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = gl.canvas.width / gl.canvas.height;
    const projectionMatrix = m4.perspective(fieldOfView, aspect, 1, 200);
    const cameraMatrix = m4.lookAt(camera.position, camera.target, camera.up);
    // the view matrix moves the world in front of the camera:
    // the inverse of the camera's own matrix
    const viewMatrix = m4.inverse(cameraMatrix);
    m4.multiply(projectionMatrix, viewMatrix, viewProjectionMatrix);

    animate(parts, timer.getElapsed());

    // one pass from the root updates every world matrix in the graph
    root.updateWorldMatrix();

    for (const { node } of drawnParts) {
      m4.multiply(viewProjectionMatrix, node.worldMatrix, partMatrix);
      gl.uniformMatrix4fv(matrixLocation, false, partMatrix);
      gl.drawArrays(gl.TRIANGLES, 0, cubeVertexCount);
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

// One random gray (128-255) per cube face, as RGBA bytes for every vertex.
// The cube in @lib/geometries lists its faces one after the other,
// 6 vertices (2 triangles) each.
function createFaceColors() {
  const verticesPerFace = 6;
  const colors = new Uint8Array(cubeVertexCount * 4);
  for (let vertex = 0; vertex < cubeVertexCount; vertex++) {
    if (vertex % verticesPerFace === 0) {
      const gray = (128 + Math.random() * 128) | 0;
      colors.set([gray, gray, gray, 255], vertex * 4);
    } else {
      // same color as the face's first vertex
      colors.copyWithin(vertex * 4, (vertex - 1) * 4, vertex * 4);
    }
  }
  return colors;
}

// The walk cycle: every part only gets its own angles (relative to its
// parent); the scene graph adds up the parents' movements.
// The small phase offsets (c + 0.1...) make the children lag a bit
// behind their parents, which looks less robotic.
function animate(parts: Record<PartName, Part>, time: number) {
  const c = time * 3;
  const rotation = (name: PartName) => parts[name].trs.rotation;

  // bounce: twice per walk cycle, never below the floor
  parts["point between feet"].trs.translation[1] = Math.abs(Math.sin(c));

  // legs swing around x, in opposite directions
  rotation("left-leg")[0] = Math.sin(c);
  rotation("right-leg")[0] = -Math.sin(c);
  rotation("left-calf")[0] = -Math.sin(c + 0.1) * 0.4;
  rotation("right-calf")[0] = Math.sin(c + 0.1) * 0.4;
  rotation("left-foot")[0] = -Math.sin(c + 0.1) * 0.4;
  rotation("right-foot")[0] = Math.sin(c + 0.1) * 0.4;

  // arms flap around z (up and down)
  rotation("left-arm")[2] = Math.sin(c) * 0.4;
  rotation("right-arm")[2] = Math.sin(c) * 0.4;
  rotation("left-forearm")[2] = Math.sin(c + 0.1) * 0.4;
  rotation("right-forearm")[2] = Math.sin(c + 0.1) * 0.4;
  rotation("left-hand")[2] = Math.sin(c - 0.1) * 0.4;
  rotation("right-hand")[2] = Math.sin(c - 0.1) * 0.4;

  // the body twists around y; each part adds to the twist of its parent
  rotation("waist")[1] = Math.sin(c) * 0.4;
  rotation("torso")[1] = Math.sin(c) * 0.4;
  rotation("neck")[1] = Math.sin(c + 0.25) * 0.4;
  rotation("head")[1] = Math.sin(c + 0.5) * 0.4;
  // nodding
  rotation("head")[0] = Math.cos(c * 2) * 0.4;
}
