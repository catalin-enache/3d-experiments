import { Pane } from "tweakpane";
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
  sphereVertexCount
} from "@lib/geometries";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

// https://webgl2fundamentals.org/webgl/lessons/webgl-3d-lighting-point.html
export async function LightingPoint({
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

  // DIFFERENT from the directional light: the shader needs the world matrix
  // to compute where each vertex is in the world
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
  // DIFFERENT: a light position instead of a light direction
  const lightWorldPositionLocation = gl.getUniformLocation(
    program,
    "u_lightWorldPosition"
  );
  // DIFFERENT: a point light gets dimmer the farther the surface is from it
  const falloffDistanceLocation = gl.getUniformLocation(
    program,
    "u_falloffDistance"
  );
  // the light marker is drawn with its plain color, without any lighting
  const unlitLocation = gl.getUniformLocation(program, "u_unlit");
  // the specular highlight depends on where the camera is
  const viewWorldPositionLocation = gl.getUniformLocation(
    program,
    "u_viewWorldPosition"
  );
  const shininessLocation = gl.getUniformLocation(program, "u_shininess");
  const lightColorLocation = gl.getUniformLocation(program, "u_lightColor");
  const specularColorLocation = gl.getUniformLocation(
    program,
    "u_specularColor"
  );

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
  // shared by the orange sphere and the light marker
  const sphereVao = createVao(spherePositions, sphereNormals);
  const objects = [
    {
      vao: createVao(letterF3DPositions, letterF3DNormals),
      vertexCount: letterF3DVertexCount,
      position: [-70, 0, 0],
      // the F already has its real size
      size: 1,
      color: [0.2, 1, 0.2, 1] // green
    },
    {
      vao: sphereVao,
      vertexCount: sphereVertexCount,
      position: [80, 0, 0],
      // the sphere geometry has radius 1
      size: sphereRadius,
      color: [1, 0.6, 0.2, 1] // orange
    }
  ];

  const params = {
    // in degrees
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    // when off, normals are transformed by the world matrix itself
    // so their distortion under non-uniform scaling can be observed
    inverseTranspose: true,
    // DIFFERENT from the directional light: the light is a point in the world.
    // Between the F and the sphere, above and in front of them, so the F gets lit
    // from its right and the sphere from its left
    lightX: 0,
    lightY: 80,
    lightZ: 120,
    // DIFFERENT: distance at which the light is at half its brightness
    falloffDistance: 200,
    // 0..1 per channel
    lightColor: { r: 1, g: 1, b: 1 },
    specularColor: { r: 1, g: 1, b: 1 },
    shininess: 150
  };

  const pane = new Pane({ title: "Lighting Point" });
  pane.addBinding(params, "rotation", {
    min: -360,
    max: 360,
    step: 1
  });
  // non-uniform scaling is where normals break if they are
  // transformed by the world matrix instead of its inverse transpose.
  // min > 0 keeps the world matrix invertible
  for (const key of ["scaleX", "scaleY", "scaleZ"] as const) {
    pane.addBinding(params, key, { min: 0.1, max: 3, step: 0.1 });
  }
  pane.addBinding(params, "inverseTranspose", { label: "inverse transpose" });
  // DIFFERENT: the light can be moved around the scene
  const lightFolder = pane.addFolder({ title: "Light position" });
  for (const key of ["lightX", "lightY", "lightZ"] as const) {
    lightFolder.addBinding(params, key, { min: -300, max: 300, step: 1 });
  }
  lightFolder.addBinding(params, "falloffDistance", {
    label: "half brightness at",
    min: 10,
    max: 1000,
    step: 1
  });
  lightFolder.addBinding(params, "lightColor", {
    label: "light color",
    color: { type: "float" }
  });
  lightFolder.addBinding(params, "specularColor", {
    label: "specular color",
    color: { type: "float" }
  });
  lightFolder.addBinding(params, "shininess", { min: 1, max: 500, step: 1 });

  const camera = [100, 150, 250];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const markerRadius = 5;

  // only draw the faces pointing toward the viewer
  gl.enable(gl.CULL_FACE);
  // only draw pixels closer than what's already been drawn
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);

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

    // the light is the same for every object.
    // DIFFERENT from the directional light: only its position is sent,
    // the direction toward it is worked out in the shader for every point
    // of the surface. Nothing is normalized here, a position has no "length 1"
    const lightPosition = [params.lightX, params.lightY, params.lightZ];
    gl.uniform3fv(lightWorldPositionLocation, lightPosition);
    gl.uniform1f(falloffDistanceLocation, params.falloffDistance);
    gl.uniform1i(unlitLocation, 0);
    gl.uniform3fv(viewWorldPositionLocation, camera);
    gl.uniform1f(shininessLocation, params.shininess);
    const { lightColor, specularColor } = params;
    gl.uniform3fv(lightColorLocation, [
      lightColor.r,
      lightColor.g,
      lightColor.b
    ]);
    gl.uniform3fv(specularColorLocation, [
      specularColor.r,
      specularColor.g,
      specularColor.b
    ]);

    for (const { vao, vertexCount, position, size, color } of objects) {
      // move each object to its place, rotate it around its own center
      // and scale it in its local space (scale first, then rotation).
      // The F's normals are axis-aligned so non-uniform scaling only changes
      // their length (which normalize fixes), but the sphere's normals point
      // in every direction so wrong normals are visible on it
      let worldMatrix = m4.translation(position[0], position[1], position[2]);
      worldMatrix = m4.yRotate(worldMatrix, degToRad(params.rotation));
      worldMatrix = m4.scale(
        worldMatrix,
        params.scaleX * size,
        params.scaleY * size,
        params.scaleZ * size
      );
      const worldViewProjectionMatrix = m4.multiply(
        viewProjectionMatrix,
        worldMatrix
      );
      // used to orient the normals with the object
      const worldInverseTransposeMatrix = params.inverseTranspose
        ? m4.transpose(m4.inverse(worldMatrix))
        : worldMatrix;

      gl.uniformMatrix4fv(worldLocation, false, worldMatrix);
      gl.uniformMatrix4fv(
        worldViewProjectionLocation,
        false,
        worldViewProjectionMatrix
      );
      gl.uniformMatrix4fv(
        worldInverseTransposeLocation,
        false,
        worldInverseTransposeMatrix
      );
      gl.uniform4fv(colorLocation, color);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    // a small sphere where the light is.
    // It is unlit: the light is inside it, so lighting it would make it dark
    const markerMatrix = m4.scale(
      m4.translation(lightPosition[0], lightPosition[1], lightPosition[2]),
      markerRadius,
      markerRadius,
      markerRadius
    );
    gl.uniformMatrix4fv(worldLocation, false, markerMatrix);
    gl.uniformMatrix4fv(
      worldViewProjectionLocation,
      false,
      m4.multiply(viewProjectionMatrix, markerMatrix)
    );
    gl.uniformMatrix4fv(
      worldInverseTransposeLocation,
      false,
      m4.transpose(m4.inverse(markerMatrix))
    );
    // the marker shows the light color
    gl.uniform4fv(colorLocation, [lightColor.r, lightColor.g, lightColor.b, 1]);
    gl.uniform1i(unlitLocation, 1);
    gl.bindVertexArray(sphereVao);
    gl.drawArrays(gl.TRIANGLES, 0, sphereVertexCount);
  }

  return loop({
    tick,
    cleanUp: () => {
      pane.dispose();
      cleanUp();
    }
  });
}
