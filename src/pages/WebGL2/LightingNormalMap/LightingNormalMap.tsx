import { Pane } from "tweakpane";
import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import {
  cubePositions,
  cubeNormals,
  cubeTangents,
  cubeTexcoords,
  cubeVertexCount
} from "@lib/geometries";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

const normalMapSrc = "textures/normals/Test2.png";

export async function LightingNormalMap({
  container,
  webglContextAttributes
}: ScenarioParams) {
  const { gl, cleanUp } = init({ container, webglContextAttributes });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = normalMapSrc;
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
  });

  const program = await createProgram({
    gl,
    vertexShaderSource,
    fragmentShaderSource
  });

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
  const tangentAttributeLocation = gl.getAttribLocation(program, "a_tangent");
  const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

  const worldViewProjectionLocation = gl.getUniformLocation(
    program,
    "u_worldViewProjection"
  );
  const worldLocation = gl.getUniformLocation(program, "u_world");
  const worldInverseTransposeLocation = gl.getUniformLocation(
    program,
    "u_worldInverseTranspose"
  );
  const normalMapLocation = gl.getUniformLocation(program, "u_normalMap");
  const reverseLightDirectionLocation = gl.getUniformLocation(
    program,
    "u_reverseLightDirection"
  );
  const colorLocation = gl.getUniformLocation(program, "u_color");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const attributes = [
    { location: positionAttributeLocation, size: 3, setData: cubePositions },
    { location: normalAttributeLocation, size: 3, setData: cubeNormals },
    { location: tangentAttributeLocation, size: 3, setData: cubeTangents },
    { location: texcoordAttributeLocation, size: 2, setData: cubeTexcoords }
  ];
  for (const { location, size, setData } of attributes) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    setData(gl);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // images have their first row at the top but v = 0 is the bottom of the texture.
  // Flipping keeps +v (the bitangent) pointing up the image,
  // which is where the green channel of an OpenGL style normal map points
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.generateMipmap(gl.TEXTURE_2D);

  const params = {
    // in degrees
    rotationX: 20,
    rotationY: -30,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    // where the light comes from, in degrees:
    // horizontal goes left (-) / right (+), vertical goes bottom (-) / top (+)
    lightHorizontal: 30,
    lightVertical: 30
  };

  const pane = new Pane({ title: "Lighting Normal Map" });
  const cubeFolder = pane.addFolder({ title: "Cube" });
  for (const key of ["rotationX", "rotationY"] as const) {
    cubeFolder.addBinding(params, key, { min: -180, max: 180, step: 1 });
  }
  // min > 0 keeps the world matrix invertible
  for (const key of ["scaleX", "scaleY", "scaleZ"] as const) {
    cubeFolder.addBinding(params, key, { min: 0.1, max: 3, step: 0.1 });
  }
  const lightFolder = pane.addFolder({ title: "Light" });
  lightFolder.addBinding(params, "lightHorizontal", {
    label: "left/right",
    min: -180,
    max: 180,
    step: 1
  });
  lightFolder.addBinding(params, "lightVertical", {
    label: "bottom/top",
    min: -90,
    max: 90,
    step: 1
  });

  const cubeSize = 150;
  const camera = [0, 0, 400];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const color = [1, 1, 1, 1]; // white

  // only draw the faces pointing toward the viewer
  gl.enable(gl.CULL_FACE);
  // only draw pixels closer than what's already been drawn
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(normalMapLocation, 0);

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

    // scale first (in the cube's local space), then rotate
    let worldMatrix = m4.xRotation(degToRad(params.rotationX));
    worldMatrix = m4.yRotate(worldMatrix, degToRad(params.rotationY));
    worldMatrix = m4.scale(
      worldMatrix,
      params.scaleX * cubeSize,
      params.scaleY * cubeSize,
      params.scaleZ * cubeSize
    );
    const worldViewProjectionMatrix = m4.multiply(
      viewProjectionMatrix,
      worldMatrix
    );
    const worldInverseTransposeMatrix = m4.transpose(m4.inverse(worldMatrix));

    // direction pointing toward the light, 0/0 means straight from the front (+Z)
    const horizontal = degToRad(params.lightHorizontal);
    const vertical = degToRad(params.lightVertical);
    const reverseLightDirection = [
      Math.cos(vertical) * Math.sin(horizontal),
      Math.sin(vertical),
      Math.cos(vertical) * Math.cos(horizontal)
    ];

    gl.uniformMatrix4fv(
      worldViewProjectionLocation,
      false,
      worldViewProjectionMatrix
    );
    gl.uniformMatrix4fv(worldLocation, false, worldMatrix);
    gl.uniformMatrix4fv(
      worldInverseTransposeLocation,
      false,
      worldInverseTransposeMatrix
    );
    gl.uniform3fv(reverseLightDirectionLocation, reverseLightDirection);
    gl.uniform4fv(colorLocation, color);

    gl.drawArrays(gl.TRIANGLES, 0, cubeVertexCount);
  }

  return loop({
    tick,
    cleanUp: () => {
      pane.dispose();
      cleanUp();
    }
  });
}
