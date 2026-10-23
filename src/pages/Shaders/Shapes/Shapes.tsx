import * as THREE from "three/webgpu";
import { useEffect } from "react";
import { Scenario } from "@components";
import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";
import { createGui } from "./gui";

const planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);

const uniforms = {
  uShape: { value: 1 },
  uVars: { value: new THREE.Vector4(0, 0, 0, 0) }
};

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  wireframe: false,
  side: THREE.DoubleSide,
  transparent: false,
  uniforms
});

export function Shapes() {
  useEffect(() => {
    const gui = createGui(uniforms);

    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <Scenario
      useCameraControls={false}
      useTransformControls={false}
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
