import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import GUI from "lil-gui";

import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";
import { Scenario } from "@components";
import { useFrame } from "@react-three/fiber";

const planeGeometry = new THREE.PlaneGeometry(10, 10, 64, 64);

const addRandoms = (geometry: THREE.BufferGeometry) => {
  const count = geometry.attributes.position.count;
  const randoms = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    randoms[i] = Math.random();
  }

  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
};

addRandoms(planeGeometry);

export function ScenarioShaderFlag() {
  const flagTexture = useTexture(
    "/textures/pbr/floors/FloorsCheckerboard_S_Diffuse.jpg"
  );

  const material = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        wireframe: false,
        side: THREE.DoubleSide,
        transparent: false,
        uniforms: {
          uIntensity: { value: 0.5 },
          uFrequency: {
            value: new THREE.Vector2(0.5, 0.5)
          },
          uTime: { value: 0 },
          uTexture: { value: flagTexture }
        }
      }),
    [flagTexture]
  );

  useEffect(() => {
    const gui = new GUI();

    const params = {
      tessellation: planeGeometry.parameters.heightSegments
    };

    gui
      .add(params, "tessellation", 1, 256, 1)
      .name("Tessellation")
      .onChange((value: number) => {
        const newGeometry = new THREE.PlaneGeometry(10, 10, value, value);

        addRandoms(newGeometry);

        planeGeometry.copy(newGeometry);

        newGeometry.dispose();
      });

    gui.add(material.uniforms.uIntensity, "value", 0, 1, 0.1).name("Intensity");

    const frequencyFolder = gui.addFolder("Frequency");

    const frequency = material.uniforms.uFrequency.value as THREE.Vector2;

    frequencyFolder.add(frequency, "x", 0, 2, 0.1).name("X");

    frequencyFolder.add(frequency, "y", 0, 2, 0.1).name("Y");

    return () => {
      gui.destroy();
    };
  }, [material]);

  useFrame((_rootState, _delta, _frame) => {
    material.uniforms.uTime.value = _rootState.clock.elapsedTime;
  });

  return (
    <Scenario
      selectableChildren={
        <mesh
          position={[0, 0, 0]}
          name="mesh"
          geometry={planeGeometry}
          material={material}
        />
      }
    />
  );
}

export default ScenarioShaderFlag;
