import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Pane } from "tweakpane";

import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";
import { Scenario } from "@components";

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
    const pane = new Pane({
      title: "Shader Flag"
    });

    const params = {
      tessellation: planeGeometry.parameters.heightSegments
    };

    pane
      .addBinding(params, "tessellation", {
        label: "Tessellation",
        min: 1,
        max: 256,
        step: 1
      })
      .on("change", ({ value }) => {
        const newGeometry = new THREE.PlaneGeometry(10, 10, value, value);

        addRandoms(newGeometry);

        planeGeometry.copy(newGeometry);
        newGeometry.dispose();
      });

    pane.addBinding(uniforms.uIntensity, "value", {
      label: "Intensity",
      min: 0,
      max: 1,
      step: 0.1
    });

    const frequencyFolder = pane.addFolder({
      title: "Frequency"
    });

    frequencyFolder.addBinding(uniforms.uFrequency.value, "x", {
      label: "X",
      min: 0,
      max: 2,
      step: 0.1
    });

    frequencyFolder.addBinding(uniforms.uFrequency.value, "y", {
      label: "Y",
      min: 0,
      max: 2,
      step: 0.1
    });

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

export default ScenarioShaderFlag;
