import { SGNode, TRS } from "@lib/sceneGraph";

export interface Body {
  node: SGNode;
  trs: TRS;
  // tint applied in the fragment shader: color * colorMult + colorOffset
  colorMult: [number, number, number, number];
  colorOffset: [number, number, number, number];
}

// The @lib/geometries sphere has a radius of 1, the tutorial's has 10:
// the scales below are multiplied by it to keep the tutorial's sizes.
const sphereRadius = 10;

// Builds the solar system scene graph:
//
//   solarSystem
//   ├── sun                     spins, scaled up
//   └── earthOrbit              pivot at the sun: rotating it moves the earth
//       └── earthSystem         100 units from the sun
//           ├── earth           spins, scaled up
//           └── moonOrbit       pivot at the earth
//               └── moon        30 units from the earth, spins, scaled down
//
// The orbits and earthSystem are never drawn, they only carry their children.
// They are what keeps the moon away from the earth's scale and spin:
// the moon is a child of the earth's position (earthSystem),
// not of the earth itself.
export function createSolarSystem() {
  const node = (trs: TRS, parent: SGNode | null) => {
    const sgNode = new SGNode(trs);
    sgNode.setParent(parent);
    return sgNode;
  };

  const solarSystem = node(new TRS(), null);

  const sunTRS = new TRS({ scale: uniformScale(5 * sphereRadius) });
  const sun = node(sunTRS, solarSystem);

  const earthOrbitTRS = new TRS();
  const earthOrbit = node(earthOrbitTRS, solarSystem);

  const earthSystem = node(new TRS({ translation: [100, 0, 0] }), earthOrbit);

  const earthTRS = new TRS({ scale: uniformScale(2 * sphereRadius) });
  const earth = node(earthTRS, earthSystem);

  const moonOrbitTRS = new TRS();
  const moonOrbit = node(moonOrbitTRS, earthSystem);

  const moonTRS = new TRS({
    translation: [30, 0, 0],
    scale: uniformScale(0.4 * sphereRadius)
  });
  const moon = node(moonTRS, moonOrbit);

  const bodies: Body[] = [
    {
      node: sun,
      trs: sunTRS,
      colorMult: [0.4, 0.4, 0, 1],
      colorOffset: [0.6, 0.6, 0, 1] // yellow
    },
    {
      node: earth,
      trs: earthTRS,
      colorMult: [0.8, 0.5, 0.2, 1],
      colorOffset: [0.2, 0.5, 0.8, 1] // blue-green
    },
    {
      node: moon,
      trs: moonTRS,
      colorMult: [0.1, 0.1, 0.1, 1],
      colorOffset: [0.6, 0.6, 0.6, 1] // gray
    }
  ];

  return {
    root: solarSystem,
    bodies,
    sunTRS,
    earthOrbitTRS,
    earthTRS,
    moonOrbitTRS,
    moonTRS
  };
}

function uniformScale(s: number): [number, number, number] {
  return [s, s, s];
}
