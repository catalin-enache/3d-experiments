import * as twgl from "twgl.js";
import type { ScenarioParams } from "@appTypes";
import { init, loop } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import {
  letterF3DVertices,
  _letterF3DNormals,
  sphereVertices,
  _sphereNormals,
  planeVertices,
  _planeNormals
} from "@lib/geometries";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";
import { createPane, type Params } from "./pane";

// https://webgl2fundamentals.org/webgl/lessons/webgl-3d-lighting-spot.html
//
// A spotlight is a point light (see LightingPoint) that only shines
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
//
// The WebGL boilerplate is done by twgl.js (https://twgljs.org), by the
// author of WebGL2Fundamentals. LightingPoint does the same things by hand:
//   - createProgramInfo: compiles and links the program and looks up all its
//     attribute and uniform locations
//   - createBufferInfoFromArrays: one buffer per attribute, the keys are
//     the attribute names in the shader
//   - createVertexArrayInfo: a VAO with those buffers bound to the attributes
//   - setUniforms: calls the right gl.uniform* for each uniform, by name
//     and by the type declared in the shader
//   - drawBufferInfo: drawArrays with the vertex count of the buffers
export function LightingSpot({
  container,
  webglContextAttributes
}: ScenarioParams) {
  const { gl, cleanUp } = init({ container, webglContextAttributes });

  const programInfo = twgl.createProgramInfo(gl, [
    vertexShaderSource,
    fragmentShaderSource
  ]);

  // one VAO per geometry, each holding its own positions and normals
  function createVao(positions: Float32Array, normals: Float32Array) {
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      a_position: { numComponents: 3, data: positions },
      a_normal: { numComponents: 3, data: normals }
    });
    return twgl.createVertexArrayInfo(gl, programInfo, bufferInfo);
  }

  const sphereRadius = 60;
  // shared by the gray sphere and the light marker
  const sphereVao = createVao(sphereVertices, _sphereNormals);
  const objects = [
    {
      vao: createVao(letterF3DVertices, _letterF3DNormals),
      position: [-70, 0, 0],
      // the F already has its real size
      size: 1,
      color: [0.8, 0.8, 0.8, 1] // light gray
    },
    {
      vao: sphereVao,
      position: [80, 0, 0],
      // the sphere geometry has radius 1
      size: sphereRadius,
      color: [0.6, 0.6, 0.6, 1] // darker gray
    }
  ];

  // DIFFERENT: a floor under the objects (the F goes down to y = -75).
  // The plane geometry faces +Z, -90 degrees around X turns it to face up.
  // It is not rotated / scaled by the pane, it only shows the cone's footprint
  const floorVao = createVao(planeVertices, _planeNormals);
  const floorSize = 600;
  let floorMatrix = m4.translation(0, -80, 0);
  floorMatrix = m4.xRotate(floorMatrix, degToRad(-90));
  floorMatrix = m4.scale(floorMatrix, floorSize, floorSize, 1);
  const floorColor = [0.7, 0.7, 0.7, 1];

  // DIFFERENT: a line from the light to its target, to see where the spot
  // points. Its 2 points change every frame, so the buffer is updated in tick.
  // It has no normals: the attribute stays disabled (normals aren't used unlit)
  const aimPoints = new Float32Array(6);
  const aimBufferInfo = twgl.createBufferInfoFromArrays(gl, {
    a_position: {
      numComponents: 3,
      data: aimPoints,
      // a hint that the data will be rewritten often
      drawType: gl.DYNAMIC_DRAW
    }
  });
  const aimVao = twgl.createVertexArrayInfo(gl, programInfo, aimBufferInfo);

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
    outerAngle: 30,
    dithering: true,
    ditherStrength: 1
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

  gl.useProgram(programInfo.program);

  // the matrices of one object
  function matrixUniforms(worldMatrix: m4.Matrix4, viewProjection: m4.Matrix4) {
    return {
      u_world: worldMatrix,
      u_worldViewProjection: m4.multiply(viewProjection, worldMatrix),
      // used to orient the normals with the object
      u_worldInverseTranspose: params.inverseTranspose
        ? m4.transpose(m4.inverse(worldMatrix))
        : worldMatrix
    };
  }

  function draw(
    vao: twgl.VertexArrayInfo,
    uniforms: Record<string, unknown>,
    type: number = gl.TRIANGLES
  ) {
    twgl.setUniforms(programInfo, uniforms);
    // binds the VAO
    twgl.setBuffersAndAttributes(gl, programInfo, vao);
    twgl.drawBufferInfo(gl, vao, type);
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
    const { lightColor } = params;
    // DIFFERENT: the cone angles are sent as cosines (see the shader).
    // The inner cone can't be wider than the outer one
    const innerAngle = Math.min(params.innerAngle, params.outerAngle);

    // the same for every object
    twgl.setUniforms(programInfo, {
      u_lightWorldPosition: lightPosition,
      u_falloffDistance: params.falloffDistance,
      u_unlit: false,
      u_viewWorldPosition: camera,
      u_shininess: params.shininess,
      u_lightColor: [lightColor.r, lightColor.g, lightColor.b],
      // DIFFERENT: the spot direction, from the light toward its target.
      // Normalized here once, the shader compares it with per pixel
      // directions through a dot product, which only gives the cosine
      // for unit vectors
      u_lightDirection: m4.normalize(
        m4.subtractVectors(lightTarget, lightPosition)
      ),
      u_innerLimit: Math.cos(degToRad(innerAngle)),
      u_outerLimit: Math.cos(degToRad(params.outerAngle)),
      u_dithering: params.dithering,
      u_ditherStrength: params.ditherStrength
    });

    for (const { vao, position, size, color } of objects) {
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
      draw(vao, {
        ...matrixUniforms(worldMatrix, viewProjectionMatrix),
        u_color: color
      });
    }

    draw(floorVao, {
      ...matrixUniforms(floorMatrix, viewProjectionMatrix),
      u_color: floorColor
    });

    // a small sphere where the light is.
    // It is unlit: the light is inside it, so lighting it would make it dark
    const markerMatrix = m4.scale(
      m4.translation(lightPosition[0], lightPosition[1], lightPosition[2]),
      markerRadius,
      markerRadius,
      markerRadius
    );
    draw(sphereVao, {
      ...matrixUniforms(markerMatrix, viewProjectionMatrix),
      // the marker shows the light color
      u_color: [lightColor.r, lightColor.g, lightColor.b, 1],
      u_unlit: true
    });

    // the aim line, already in world space: identity world matrix.
    // With an offset twgl uses bufferSubData: the buffer is only rewritten,
    // not reallocated
    aimPoints.set(lightPosition, 0);
    aimPoints.set(lightTarget, 3);
    twgl.setAttribInfoBufferFromArray(
      gl,
      aimBufferInfo.attribs!.a_position,
      aimPoints,
      0
    );
    draw(aimVao, matrixUniforms(m4.identity(), viewProjectionMatrix), gl.LINES);
  }

  return loop({
    tick,
    cleanUp: () => {
      pane.dispose();
      cleanUp();
    }
  });
}
