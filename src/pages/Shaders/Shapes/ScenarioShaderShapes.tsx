import * as THREE from "three";
import { useEffect } from "react";
import GUI from "lil-gui";
import { Scenario } from "@components";
import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";

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

interface Params {
  shape: number;
  vars: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
}

export function ScenarioShaderShapes() {
  useEffect(() => {
    const gui = new GUI();

    const params: Params = {
      shape: uniforms.uShape.value,

      vars: {
        x: uniforms.uVars.value.x,
        y: uniforms.uVars.value.y,
        z: uniforms.uVars.value.z,
        w: uniforms.uVars.value.w
      }
    };

    gui
      .add(params, "shape", 1, 30, 1)
      .name("Shape")
      .onChange((value: number) => {
        uniforms.uShape.value = value;
      });

    const varsFolder = gui.addFolder("Vars");

    varsFolder
      .add(params.vars, "x", 0, 1, 0.01)
      .name("X")
      .onChange((value: number) => {
        uniforms.uVars.value.x = value;
      });

    varsFolder
      .add(params.vars, "y", 0, 1, 0.01)
      .name("Y")
      .onChange((value: number) => {
        uniforms.uVars.value.y = value;
      });

    varsFolder
      .add(params.vars, "z", 0, 1, 0.01)
      .name("Z")
      .onChange((value: number) => {
        uniforms.uVars.value.z = value;
      });

    varsFolder
      .add(params.vars, "w", 0, 1, 0.01)
      .name("W")
      .onChange((value: number) => {
        uniforms.uVars.value.w = value;
      });

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

export default ScenarioShaderShapes;
