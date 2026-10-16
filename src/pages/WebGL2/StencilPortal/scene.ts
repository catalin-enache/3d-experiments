import * as m4 from "@lib/webgl2fundamentals/m4";
import { degToRad } from "@lib/webgl2fundamentals/m3";
import type { Mesh } from "./meshes";

export interface Drawable {
  mesh: Mesh;
  color: number[];
  // the world matrix, recomputed every frame so things can move
  world: (time: number) => m4.Matrix4;
}

// the portal is a plane standing on the floor at the origin, facing +Z
const floorY = -80;
const portalWidth = 140;
const portalHeight = 180;
export const portalCenterY = floorY + portalHeight / 2;
const frameThickness = 10;

export function createScene({
  cube,
  sphere,
  plane
}: {
  cube: Mesh;
  sphere: Mesh;
  plane: Mesh;
}) {
  // the outside world, seen around the portal
  const outsideWorld: Drawable[] = [
    // the floor, a big plane turned to face up
    {
      mesh: plane,
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
      mesh: cube,
      color: [0.45, 0.3, 0.2, 1], // brown
      world: () =>
        m4.scale(m4.translation(x, y, 0), width, height, frameThickness)
    })),
    // in front of the portal, it covers part of it.
    // It is drawn before the portal so the portal plane fails the depth test
    // behind it and doesn't mark the stencil there
    {
      mesh: cube,
      color: [0.9, 0.6, 0.2, 1], // orange
      world: () => m4.scale(m4.translation(70, floorY + 20, 90), 40, 40, 40)
    },
    // behind the portal, in the outside world. It is in the same place as
    // the inside world but never shows through the portal, only around it
    {
      mesh: sphere,
      color: [0.9, 0.9, 0.9, 1], // white
      world: () => m4.scale(m4.translation(-30, floorY + 40, -220), 40, 40, 40)
    }
  ];

  // the inside world, only seen through the portal
  const insideWorld: Drawable[] = [
    {
      mesh: sphere,
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
      mesh: cube,
      color: [0.9, 0.2, 0.5, 1], // pink
      world: (time) => {
        let world = m4.translation(10, portalCenterY, -200);
        world = m4.yRotate(world, time * 0.6);
        world = m4.xRotate(world, time * 0.4);
        return m4.scale(world, 130, 130, 130);
      }
    }
  ];

  // the portal itself, drawn twice by the stencil passes.
  // Its color is what is seen through the portal where nothing of the
  // inside world is, like the sky of another world
  const portal = {
    mesh: plane,
    color: [0.1, 0.15, 0.35, 1], // dark blue
    world: m4.scale(
      m4.translation(0, portalCenterY, 0),
      portalWidth,
      portalHeight,
      1
    )
  };

  return { outsideWorld, insideWorld, portal };
}
