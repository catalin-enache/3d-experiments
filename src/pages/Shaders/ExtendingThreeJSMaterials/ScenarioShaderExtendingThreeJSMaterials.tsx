import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { Environment, useGLTF } from "@react-three/drei";
import { Pane } from "tweakpane";

import { Scenario } from "@components";

import {
  addUniforms,
  declarations,
  distortNormals,
  distortPositions
} from "./glsl/includes.glsl";

const modelPath =
  "models/FromThreeRepo/gltf_glb/DamagedHelmet/glTF/DamagedHelmet.gltf";

const cubeFiles = ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"];
const cubeFilesPath = "textures/background/cube/Park3Med/";

const planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
const planeMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide
});

export function ScenarioShaderExtendingThreeJSMaterials() {
  const gltf = useGLTF(modelPath);

  const { object, objectMaterial, depthMaterial, uniforms } = useMemo(() => {
    const uniforms = {
      uVars: {
        value: new THREE.Vector4(0, 0, 0, 0)
      }
    };

    /*
     * Clone because useGLTF() caches its result.
     * We don't want this scenario to modify the cached original.
     */
    const object = gltf.scene.clone(true);

    const mesh = object.children[0] as THREE.Mesh;

    /*
     * Clone the material too, otherwise we'd still be modifying
     * the cached GLTF material.
     */
    const objectMaterial = (
      mesh.material as THREE.MeshStandardMaterial
    ).clone();

    mesh.material = objectMaterial;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    objectMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uVars = uniforms.uVars;

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
${addUniforms}`
        )
        .replace(
          "void main() {",
          `void main() {
${declarations}`
        )
        .replace(
          "#include <beginnormal_vertex>",
          `#include <beginnormal_vertex>
${distortNormals}`
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
${distortPositions}`
        );
    };

    /*
     * Tell Three that this material has a custom shader variant.
     */
    objectMaterial.customProgramCacheKey = () => "damaged-helmet-distortion";

    const depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking
    });

    depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uVars = uniforms.uVars;

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
${addUniforms}`
        )
        .replace(
          "void main() {",
          `void main() {
${declarations}`
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
${distortPositions}`
        );
    };

    depthMaterial.customProgramCacheKey = () =>
      "damaged-helmet-distortion-depth";

    mesh.customDepthMaterial = depthMaterial;

    return {
      object,
      objectMaterial,
      depthMaterial,
      uniforms
    };
  }, [gltf.scene]);

  /*
   * Tweakpane
   */
  useEffect(() => {
    const pane = new Pane({
      title: "Material Distortion"
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
    return () => {
      objectMaterial.dispose();
      depthMaterial.dispose();
    };
  }, [objectMaterial, depthMaterial]);

  return (
    <Scenario
      selectableChildren={
        <>
          <Environment files={cubeFiles} path={cubeFilesPath} background />
          <directionalLight
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-radius={4}
            shadow-camera-right={15}
            shadow-camera-left={-15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
            shadow-bias={-0.0014}
            castShadow
            position={[-20, 20, 20]}
            intensity={4.5}
            color="white"
          />

          <spotLight
            castShadow
            position={[20, 20, 20]}
            intensity={6}
            power={20}
            distance={70}
            color="white"
            angle={Math.PI / 8}
            penumbra={0.5}
            decay={0.4}
          />

          <ambientLight color="#ffffff" intensity={0.1} position={[0, 20, 0]} />

          <mesh
            position={[0, 0, -2]}
            name="plane"
            receiveShadow
            geometry={planeGeometry}
            material={planeMaterial}
          />

          <primitive object={object} />
        </>
      }
    />
  );
}

useGLTF.preload(modelPath);

export default ScenarioShaderExtendingThreeJSMaterials;
