import { Pane } from "tweakpane";
import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop, type Timer } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import {
  cubePositions,
  cubeNormals,
  cubeVertexCount,
  spherePositions,
  sphereNormals,
  sphereVertexCount,
  planePositions,
  planeNormals,
  planeVertexCount
} from "@lib/geometries";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

// A portal made with the stencil buffer.
//
// The stencil buffer is one more value per pixel (8 bits), next to the color
// and the depth. It is never shown, it is only a mask: every draw can write
// into it and every draw can be told to only touch the pixels whose stencil
// value passes a test.
//
// The portal is a plane. Wherever the plane is visible the stencil is set to 1,
// then the "inside world" is drawn only where the stencil is 1.
// The inside world is ordinary geometry placed behind the plane,
// it is the stencil test that keeps it from showing anywhere else
// (turn "use stencil" off to see it).
export async function StencilPortal({
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

  const worldViewProjectionLocation = gl.getUniformLocation(
    program,
    "u_worldViewProjection"
  );
  const worldInverseTransposeLocation = gl.getUniformLocation(
    program,
    "u_worldInverseTranspose"
  );
  const colorLocation = gl.getUniformLocation(program, "u_color");
  const reverseLightDirectionLocation = gl.getUniformLocation(
    program,
    "u_reverseLightDirection"
  );
  const unlitLocation = gl.getUniformLocation(program, "u_unlit");

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

  const cube = {
    vao: createVao(cubePositions, cubeNormals),
    vertexCount: cubeVertexCount
  };
  const sphere = {
    vao: createVao(spherePositions, sphereNormals),
    vertexCount: sphereVertexCount
  };
  const plane = {
    vao: createVao(planePositions, planeNormals),
    vertexCount: planeVertexCount
  };

  // the portal is a plane standing on the floor at the origin, facing +Z
  const floorY = -80;
  const portalWidth = 140;
  const portalHeight = 180;
  const portalCenterY = floorY + portalHeight / 2;
  const frameThickness = 10;

  interface Drawable {
    shape: typeof cube;
    color: number[];
    // the world matrix, recomputed every frame so things can move
    world: (time: number) => m4.Matrix4;
  }

  // the outside world, seen around the portal
  const outsideWorld: Drawable[] = [
    // the floor, a big plane turned to face up
    {
      shape: plane,
      color: [0.55, 0.55, 0.6, 1],
      world: () =>
        m4.scale(
          m4.xRotate(m4.translation(0, floorY, 0), degToRad(-90)),
          1000,
          1000,
          1
        )
    },
    // the frame around the portal: left, right and top bars
    ...[
      [
        -(portalWidth + frameThickness) / 2,
        portalCenterY,
        frameThickness,
        portalHeight
      ],
      [
        (portalWidth + frameThickness) / 2,
        portalCenterY,
        frameThickness,
        portalHeight
      ],
      [
        0,
        floorY + portalHeight + frameThickness / 2,
        portalWidth + frameThickness * 2,
        frameThickness
      ]
    ].map(([x, y, width, height]) => ({
      shape: cube,
      color: [0.45, 0.3, 0.2, 1], // brown
      world: () =>
        m4.scale(m4.translation(x, y, 0), width, height, frameThickness)
    })),
    // in front of the portal, it covers part of it.
    // It is drawn before the portal so the portal plane fails the depth test
    // behind it and doesn't mark the stencil there
    {
      shape: cube,
      color: [0.9, 0.6, 0.2, 1], // orange
      world: () => m4.scale(m4.translation(70, floorY + 20, 90), 40, 40, 40)
    },
    // behind the portal, in the outside world. It is in the same place as
    // the inside world but never shows through the portal, only around it
    {
      shape: sphere,
      color: [0.9, 0.9, 0.9, 1], // white
      world: () => m4.scale(m4.translation(-30, floorY + 40, -220), 40, 40, 40)
    }
  ];

  // the inside world, only seen through the portal
  const insideWorld: Drawable[] = [
    {
      shape: sphere,
      color: [0.2, 0.8, 0.4, 1], // green
      world: (time) =>
        m4.scale(
          m4.translation(
            -30 + Math.sin(time) * 40,
            floorY + 50 + Math.abs(Math.sin(time * 2)) * 40,
            -120
          ),
          35,
          35,
          35
        )
    },
    // big enough to stick out of the portal's sides, where it gets cut off
    {
      shape: cube,
      color: [0.9, 0.2, 0.5, 1], // pink
      world: (time) => {
        let world = m4.translation(10, portalCenterY, -200);
        world = m4.yRotate(world, time * 0.6);
        world = m4.xRotate(world, time * 0.4);
        return m4.scale(world, 130, 130, 130);
      }
    }
  ];

  // what is seen through the portal where nothing of the inside world is,
  // like the sky of another world
  const insideBackground = [0.1, 0.15, 0.35, 1]; // dark blue
  const portalWorld = m4.scale(
    m4.translation(0, portalCenterY, 0),
    portalWidth,
    portalHeight,
    1
  );

  const params = {
    useStencil: true,
    // in degrees, the camera turns around the portal
    cameraAngle: 25,
    animateCamera: true,
    cameraHeight: 80
  };

  const pane = new Pane({ title: "Stencil Portal" });
  pane.addBinding(params, "useStencil", { label: "use stencil" });
  pane.addBinding(params, "animateCamera", { label: "animate camera" });
  pane.addBinding(params, "cameraAngle", {
    label: "camera angle",
    min: -180,
    max: 180,
    step: 1
  });
  pane.addBinding(params, "cameraHeight", {
    label: "camera height",
    min: -60,
    max: 300,
    step: 1
  });

  const cameraDistance = 420;
  const target = [0, portalCenterY - 20, -60];
  const up = [0, 1, 0];
  const lightDirection = m4.normalize([0.5, 0.7, 1]);

  // only draw the faces pointing toward the viewer.
  // The portal plane is one-sided too: from behind there is no portal
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);

  function draw(
    { shape, color }: { shape: typeof cube; color: number[] },
    world: m4.Matrix4,
    viewProjectionMatrix: m4.Matrix4
  ) {
    gl.uniformMatrix4fv(
      worldViewProjectionLocation,
      false,
      m4.multiply(viewProjectionMatrix, world)
    );
    gl.uniformMatrix4fv(
      worldInverseTransposeLocation,
      false,
      m4.transpose(m4.inverse(world))
    );
    gl.uniform4fv(colorLocation, color);
    gl.bindVertexArray(shape.vao);
    gl.drawArrays(gl.TRIANGLES, 0, shape.vertexCount);
  }

  function tick({ timer }: { timer: Timer }) {
    const time = timer.getElapsed();

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // the stencil is cleared to 0 like the color and the depth
    gl.clearColor(0, 0, 0, 0);
    gl.clearStencil(0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    if (params.animateCamera) {
      params.cameraAngle = Math.sin(time * 0.3) * 50;
      pane.refresh();
    }
    const angle = degToRad(params.cameraAngle);
    const camera = [
      Math.sin(angle) * cameraDistance,
      params.cameraHeight,
      Math.cos(angle) * cameraDistance
    ];

    const projectionMatrix = m4.perspective(
      degToRad(60),
      gl.canvas.width / gl.canvas.height,
      1,
      3000
    );
    const viewMatrix = m4.inverse(m4.lookAt(camera, target, up));
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    gl.uniform3fv(reverseLightDirectionLocation, lightDirection);
    gl.uniform1i(unlitLocation, 0);

    // 1. the outside world, as usual, the stencil is not involved
    gl.disable(gl.STENCIL_TEST);
    for (const drawable of outsideWorld) {
      draw(drawable, drawable.world(time), viewProjectionMatrix);
    }

    if (params.useStencil) {
      gl.enable(gl.STENCIL_TEST);

      // 2. mark the portal in the stencil.
      // stencilFunc(test, ref, mask): ALWAYS passes, ref is the value to write.
      // stencilOp(stencil fails, stencil passes but depth fails, both pass):
      // only where the plane is actually visible (passes the depth test)
      // its pixels get the ref value (REPLACE), elsewhere they stay 0 (KEEP).
      // Nothing is written to the color or depth, the plane is invisible,
      // it only leaves its shape in the stencil
      gl.stencilFunc(gl.ALWAYS, 1, 0xff);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
      gl.colorMask(false, false, false, false);
      gl.depthMask(false);
      // the color doesn't matter, nothing reaches the color buffer
      draw(
        { shape: plane, color: insideBackground },
        portalWorld,
        viewProjectionMatrix
      );
      gl.colorMask(true, true, true, true);
      gl.depthMask(true);

      // from now on only the pixels where the stencil equals 1 are drawn,
      // and the stencil itself is left as it is
      gl.stencilFunc(gl.EQUAL, 1, 0xff);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

      // 3. open the portal: inside it, wipe what the outside world left
      // (the floor and the white sphere behind the plane) by drawing the plane
      // again with the inside background color.
      // depthRange(1, 1) pushes it to the far end of the depth buffer and
      // ALWAYS makes it pass, so inside the portal the depth is reset to "far"
      // and the inside world, which is behind the plane, can be drawn there
      gl.depthFunc(gl.ALWAYS);
      gl.depthRange(1, 1);
      gl.uniform1i(unlitLocation, 1);
      draw(
        { shape: plane, color: insideBackground },
        portalWorld,
        viewProjectionMatrix
      );
      gl.uniform1i(unlitLocation, 0);
      gl.depthRange(0, 1);
      gl.depthFunc(gl.LESS);
    }

    // 4. the inside world, only where the stencil is 1 (when the stencil is on).
    // Without the stencil it is just more objects in the outside world
    for (const drawable of insideWorld) {
      draw(drawable, drawable.world(time), viewProjectionMatrix);
    }

    gl.disable(gl.STENCIL_TEST);
  }

  return loop({
    tick,
    cleanUp: () => {
      pane.dispose();
      cleanUp();
    }
  });
}
