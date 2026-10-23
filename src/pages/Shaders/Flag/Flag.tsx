import * as THREE from "three/webgpu";
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";
import { Scenario } from "@components";

import { createPane, type Params } from "./pane";

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

export function Flag() {
  const flagTexture = useTexture(
    "textures/pbr/floors/FloorsCheckerboard_S_Diffuse.jpg"
  );

  const { material, uniforms } = useMemo(() => {
    const uniforms = {
      uIntensity: {
        value: 0.5
      },
      uFrequency: {
        value: new THREE.Vector2(0.5, 0.5)
      },
      uTime: {
        value: 0
      },
      uTexture: {
        value: flagTexture
      }
    };

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      wireframe: false,
      side: THREE.DoubleSide,
      transparent: false,
      uniforms
    });

    return {
      material,
      uniforms
    };
  }, [flagTexture]);

  useEffect(() => {
    const params: Params = {
      tessellation: planeGeometry.parameters.heightSegments
    };

    const onTessellationChange = (value: number) => {
      const newGeometry = new THREE.PlaneGeometry(10, 10, value, value);

      addRandoms(newGeometry);

      planeGeometry.copy(newGeometry);
      newGeometry.dispose();
    };

    const pane = createPane(params, uniforms, { onTessellationChange });

    return () => {
      pane.dispose();
    };
  }, [uniforms]);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <Scenario
      unselectableChildren={
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
