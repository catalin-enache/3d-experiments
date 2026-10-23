import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import {
  letterF3DPositions,
  letterF3DNormals,
  letterF3DVertexCount,
  spherePositions,
  sphereNormals,
  sphereVertexCount,
  planePositions,
  planeNormals,
  planeVertexCount
} from "@lib/geometries";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";
import { createPane, type Params } from "./pane";

// https://webgl2fundamentals.org/webgl/lessons/webgl-3d-lighting-spot.html
//
// A spot light is a point light (see LightingPoint) that only shines
// inside a cone, like a flashlight or a stage light.
// It has a position, like the point light, plus:
//   - a direction: where the cone points (here aimed at a target point)
//   - a limit: the angle between the center line of the cone and its edge
//
// For every pixel the fragment shader takes the direction from the light
// to the surface and its angle with the spot direction. The dot product of
// the two (normalized) directions is the cosine of that angle, so the pixel
// is inside the cone when that dot product is bigger than cos(limit).
// The cosines of the limits are computed once on the CPU, so the shader
// never needs an acos.
//
// A single limit gives a hard edge. Two limits (an inner and an outer cone)
// give a soft edge: full light inside the inner cone, nothing outside the
// outer one, and a smooth fade (smoothstep) in between.
//
// Everything else (diffuse, specular, attenuation) is the point light's,
// multiplied by how much the pixel is inside the cone.
// A floor is added so the circle of light the cone draws on it is visible.
export async function LightingSpot({
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
  const normalAttributeLocation = gl.getAttribLocation(program, "a_normal");

  const worldLocation = gl.getUniformLocation(program, "u_world");
  const worldViewProjectionLocation = gl.getUniformLocation(
    program,
    "u_worldViewProjection"
  );
  const worldInverseTransposeLocation = gl.getUniformLocation(
    program,
    "u_worldInverseTranspose"
  );
  const colorLocation = gl.getUniformLocation(program, "u_color");
  const lightWorldPositionLocation = gl.getUniformLocation(
    program,
    "u_lightWorldPosition"
  );
  const falloffDistanceLocation = gl.getUniformLocation(
    program,
    "u_falloffDistance"
  );
  const unlitLocation = gl.getUniformLocation(program, "u_unlit");
  const viewWorldPositionLocation = gl.getUniformLocation(
    program,
    "u_viewWorldPosition"
  );
  const shininessLocation = gl.getUniformLocation(program, "u_shininess");
  const lightColorLocation = gl.getUniformLocation(program, "u_lightColor");
  // DIFFERENT from the point light: where the spot points
  const lightDirectionLocation = gl.getUniformLocation(
    program,
    "u_lightDirection"
  );
  // DIFFERENT: the cosines of the inner and outer cone angles
  const innerLimitLocation = gl.getUniformLocation(program, "u_innerLimit");
  const outerLimitLocation = gl.getUniformLocation(program, "u_outerLimit");

  // one VAO per geometry, each holding its own positions and normals
  function createVao(
    setPositions: (gl: WebGL2RenderingContext) => void,
    setNormals: (gl: WebGL2RenderingContext) => void
  ) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setPositions(gl);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    setNormals(gl);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    return vao;
  }

  const sphereRadius = 60;
  // shared by the gray sphere and the light marker
  const sphereVao = createVao(spherePositions, sphereNormals);
  const objects = [
    {
      vao: createVao(letterF3DPositions, letterF3DNormals),
      vertexCount: letterF3DVertexCount,
      position: [-70, 0, 0],
      // the F already has its real size
      size: 1,
      color: [0.8, 0.8, 0.8, 1] // light gray
    },
    {
      vao: sphereVao,
      vertexCount: sphereVertexCount,
      position: [80, 0, 0],
      // the sphere geometry has radius 1
      size: sphereRadius,
      color: [0.6, 0.6, 0.6, 1] // darker gray
    }
  ];

  // DIFFERENT: a floor under the objects (the F goes down to y = -75).
  // The plane geometry faces +Z, -90 degrees around X turns it to face up.
  // It is not rotated / scaled by the pane, it only shows the cone's footprint
  const floorVao = createVao(planePositions, planeNormals);
  const floorSize = 600;
  let floorMatrix = m4.translation(0, -80, 0);
  floorMatrix = m4.xRotate(floorMatrix, degToRad(-90));
  floorMatrix = m4.scale(floorMatrix, floorSize, floorSize, 1);
  const floorColor = [0.7, 0.7, 0.7, 1];

  // DIFFERENT: a line from the light to its target, to see where the spot
  // points. Its 2 points change every frame, so the buffer is updated in tick.
  // It has no normals: the attribute stays disabled (normals aren't used unlit)
  const aimVao = gl.createVertexArray();
  gl.bindVertexArray(aimVao);
  const aimBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, aimBuffer);
  // DYNAMIC_DRAW: a hint that the data will be rewritten often
  gl.bufferData(gl.ARRAY_BUFFER, 6 * 4, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  const aimPoints = new Float32Array(6);

  const params: Params = {
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    inverseTranspose: true,
    // above and in front of the scene, looking down at it
    lightX: 0,
    lightY: 180,
    lightZ: 150,
    // farther than for the point light: the spot is farther from the objects
    falloffDistance: 400,
    lightColor: { r: 1, g: 1, b: 1 },
    shininess: 150,
    // between the F and the sphere, so the cone catches both and the floor
    targetX: 0,
    targetY: -30,
    targetZ: 0,
    innerAngle: 20,
    outerAngle: 30
  };

  const pane = createPane(params);

  const camera = [100, 150, 250];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const markerRadius = 5;

  // only draw the faces pointing toward the viewer
  gl.enable(gl.CULL_FACE);
  // only draw pixels closer than what's already been drawn
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);

  function setMatrices(worldMatrix: m4.Matrix4, viewProjection: m4.Matrix4) {
    gl.uniformMatrix4fv(worldLocation, false, worldMatrix);
    gl.uniformMatrix4fv(
      worldViewProjectionLocation,
      false,
      m4.multiply(viewProjection, worldMatrix)
    );
    // used to orient the normals with the object
    gl.uniformMatrix4fv(
      worldInverseTransposeLocation,
      false,
      params.inverseTranspose
        ? m4.transpose(m4.inverse(worldMatrix))
        : worldMatrix
    );
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

    const cameraMatrix = m4.lookAt(camera, target, up);

    // the view matrix moves the world so the camera is effectively at the origin
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    const lightPosition = [params.lightX, params.lightY, params.lightZ];
    const lightTarget = [params.targetX, params.targetY, params.targetZ];
    gl.uniform3fv(lightWorldPositionLocation, lightPosition);
    gl.uniform1f(falloffDistanceLocation, params.falloffDistance);
    gl.uniform1i(unlitLocation, 0);
    gl.uniform3fv(viewWorldPositionLocation, camera);
    gl.uniform1f(shininessLocation, params.shininess);
    const { lightColor } = params;
    gl.uniform3fv(lightColorLocation, [
      lightColor.r,
      lightColor.g,
      lightColor.b
    ]);

    // DIFFERENT: the spot direction, from the light toward its target.
    // Normalized here once, the shader compares it with per pixel directions
    // through a dot product, which only gives the cosine for unit vectors
    gl.uniform3fv(
      lightDirectionLocation,
      m4.normalize(m4.subtractVectors(lightTarget, lightPosition))
    );
    // DIFFERENT: the cone angles are sent as cosines (see the shader).
    // The inner cone can't be wider than the outer one
    const innerAngle = Math.min(params.innerAngle, params.outerAngle);
    gl.uniform1f(innerLimitLocation, Math.cos(degToRad(innerAngle)));
    gl.uniform1f(outerLimitLocation, Math.cos(degToRad(params.outerAngle)));

    for (const { vao, vertexCount, position, size, color } of objects) {
      // move each object to its place, rotate it around its own center
      // and scale it in its local space (scale first, then rotation)
      let worldMatrix = m4.translation(position[0], position[1], position[2]);
      worldMatrix = m4.yRotate(worldMatrix, degToRad(params.rotation));
      worldMatrix = m4.scale(
        worldMatrix,
        params.scaleX * size,
        params.scaleY * size,
        params.scaleZ * size
      );
      setMatrices(worldMatrix, viewProjectionMatrix);
      gl.uniform4fv(colorLocation, color);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    setMatrices(floorMatrix, viewProjectionMatrix);
    gl.uniform4fv(colorLocation, floorColor);
    gl.bindVertexArray(floorVao);
    gl.drawArrays(gl.TRIANGLES, 0, planeVertexCount);

    // a small sphere where the light is.
    // It is unlit: the light is inside it, so lighting it would make it dark
    const markerMatrix = m4.scale(
      m4.translation(lightPosition[0], lightPosition[1], lightPosition[2]),
      markerRadius,
      markerRadius,
      markerRadius
    );
    setMatrices(markerMatrix, viewProjectionMatrix);
    // the marker shows the light color
    gl.uniform4fv(colorLocation, [lightColor.r, lightColor.g, lightColor.b, 1]);
    gl.uniform1i(unlitLocation, 1);
    gl.bindVertexArray(sphereVao);
    gl.drawArrays(gl.TRIANGLES, 0, sphereVertexCount);

    // the aim line, already in world space: identity world matrix
    aimPoints.set(lightPosition, 0);
    aimPoints.set(lightTarget, 3);
    gl.bindBuffer(gl.ARRAY_BUFFER, aimBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, aimPoints);
    setMatrices(m4.identity(), viewProjectionMatrix);
    gl.bindVertexArray(aimVao);
    gl.drawArrays(gl.LINES, 0, 2);
  }

  return loop({
    tick,
    cleanUp: () => {
      pane.dispose();
      cleanUp();
    }
  });
}
