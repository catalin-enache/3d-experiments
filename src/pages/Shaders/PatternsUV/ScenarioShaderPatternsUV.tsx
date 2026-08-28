import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Pane } from "tweakpane";

import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";
import { Scenario } from "@components";

const planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);

export function ScenarioShaderPatternsUV() {
  const { scene, camera, size } = useThree();

  const { material, uniforms } = useMemo(() => {
    const uniforms = {
      uPattern: {
        value: 1
      },
      uVars: {
        value: new THREE.Vector4(0, 0, 0, 0)
      },
      uTime: {
        value: 0
      },
      uResolution: {
        value: new THREE.Vector2(1, 1)
      }
    };

    const material = new THREE.ShaderMaterial({
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
  }, []);

  useEffect(() => {
    const pane = new Pane({
      title: "Shader Patterns UV"
    });

    pane.addBinding(uniforms.uPattern, "value", {
      label: "Pattern",
      min: 1,
      max: 40,
      step: 1
    });

    const varsFolder = pane.addFolder({
      title: "Vars"
    });

    varsFolder.addBinding(uniforms.uVars.value, "x", {
      label: "X",
      min: 0,
      max: 1,
      step: 0.01
    });

    varsFolder.addBinding(uniforms.uVars.value, "y", {
      label: "Y",
      min: 0,
      max: 1,
      step: 0.01
    });

    varsFolder.addBinding(uniforms.uVars.value, "z", {
      label: "Z",
      min: 0,
      max: 1,
      step: 0.01
    });

    varsFolder.addBinding(uniforms.uVars.value, "w", {
      label: "W",
      min: 0,
      max: 1,
      step: 0.01
    });

    return () => {
      pane.dispose();
    };
  }, [uniforms]);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  useEffect(() => {
    scene.background = new THREE.Color(0x000000);

    return () => {
      scene.background = null;
    };
  }, [scene]);

  useEffect(() => {
    camera.position.set(0, 0, 9);
    camera.rotation.set(0, 0, 0);

    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = 65;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

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

export default ScenarioShaderPatternsUV;
