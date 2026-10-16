import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop, type Timer } from "@lib/utils/webgl";
import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import { createMeshes, type Mesh } from "./meshes";
import { createScene, portalCenterY } from "./scene";
import { createPane, type Params } from "./pane";

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

  const meshes = createMeshes(
    gl,
    positionAttributeLocation,
    normalAttributeLocation
  );
  const { outsideWorld, insideWorld, portal } = createScene(meshes);

  const params: Params = {
    useStencil: true,
    cameraAngle: 25,
    animateCamera: true,
    cameraHeight: 80
  };
  const pane = createPane(params);

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
    { mesh, color }: { mesh: Mesh; color: number[] },
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
    gl.bindVertexArray(mesh.vao);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
  }

  // only advances while animating, so the animation resumes where it stopped
  let animationTime = 0;
  let animatedAngle = 0;
  let wasAnimating = false;

  function tick({ timer }: { timer: Timer }) {
    const time = timer.getElapsed();

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // the stencil is cleared to 0 like the color and the depth
    gl.clearColor(0, 0, 0, 0);
    gl.clearStencil(0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    // the animated angle is kept out of params: the pane rounds a bound value
    // to its slider step (1 degree) and writes it back on refresh, which made
    // the camera move in visible 1 degree jumps
    if (params.animateCamera) {
      animationTime += Math.min(0.1, timer.getDelta());
      animatedAngle = Math.sin(animationTime * 0.3) * 50;
    } else if (wasAnimating) {
      // hand the angle over to the slider once, when the animation stops
      params.cameraAngle = Math.round(animatedAngle);
      pane.refresh();
    }
    wasAnimating = params.animateCamera;
    const angle = degToRad(
      params.animateCamera ? animatedAngle : params.cameraAngle
    );
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
      draw(portal, portal.world, viewProjectionMatrix);
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
      draw(portal, portal.world, viewProjectionMatrix);
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
