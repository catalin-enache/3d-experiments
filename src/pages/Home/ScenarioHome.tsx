import * as THREE from "three/webgpu";
import type { ScenarioParams } from "@appTypes";
import { SceneInit } from "@native/classes/SceneInit";
import { isWebGPURenderer } from "@lib/utils";

export function ScenarioHome({
  container,
  rendererParams: _rendererParams = {},
  axesSize,
  gridConfig
}: ScenarioParams) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(geometry, material);

  function tick() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  const { cleanUp, scene, renderer, inspector } = SceneInit({
    container,
    rendererParams: _rendererParams,
    axesSize,
    gridConfig,
    tick
  });

  scene.add(cube);

  if (isWebGPURenderer(renderer)) {
    const gui = inspector.createParameters("Params");

    gui.add(material, "wireframe").onChange((value) => {
      console.log("wireframe", value);
    });

    scene.background = new THREE.Color(0x111111);

    const params = {
      background: scene.background.getHex()
    };

    gui.addColor(params, "background").onChange((value) => {
      (scene.background as THREE.Color).set(value);
    });
  }

  return () => {
    cleanUp();
    geometry.dispose();
    material.dispose();
  };
}
