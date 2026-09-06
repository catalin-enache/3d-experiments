import * as THREE from "three/webgpu";
import * as THREE_WEBGL from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Inspector } from "three/addons/inspector/Inspector.js";
import Stats from "three/addons/libs/stats.module.js";
import { AxisViewportHelper } from "@native/classes/AxisViewportHelper";
import type { ScenarioParams } from "@appTypes";

interface SceneInitParams extends ScenarioParams {
  tick?: () => void;
}

export function SceneInit({
  container,
  rendererParams: _rendererParams = {},
  axesSize,
  gridConfig,
  tick: _tick = () => {
    /* pass */
  }
}: SceneInitParams) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  camera.position.z = 5;

  const { useWebGpu, options } = _rendererParams;
  const renderer = useWebGpu
    ? new THREE.WebGPURenderer({
        antialias: true,
        ...options
      })
    : new THREE_WEBGL.WebGLRenderer({
        antialias: true,
        ...options
      });

  const inspector = new Inspector();
  if (renderer instanceof THREE.WebGPURenderer) {
    {
      renderer.inspector = inspector;
    }
  }

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  const axisHelper = new AxisViewportHelper(renderer);

  const stats = new Stats();
  Object.assign(stats.dom.style, {
    position: "absolute",
    left: "110px",
    bottom: "4px",
    top: "auto",
    zIndex: "0"
  });
  container.appendChild(stats.dom);

  if (axesSize) {
    const axesHelper = new THREE.AxesHelper(axesSize);
    scene.add(axesHelper);
  }

  if (gridConfig) {
    const gridHelper = new THREE.GridHelper(
      gridConfig.size ?? 10,
      gridConfig.divisions ?? 10
    );
    scene.add(gridHelper);
  }

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const timer = new THREE.Timer();
  timer.connect(document);

  function tick() {
    timer.update();

    _tick();

    controls.update();

    stats.begin();
    renderer.render(scene, camera);
    stats.end();

    axisHelper.render(camera);
  }

  void renderer.setAnimationLoop(tick);

  function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  window.addEventListener("resize", handleResize);

  // Cleanup
  // React calls this when leaving the page
  const cleanUp = () => {
    console.log("Scene Cleaning up");
    window.removeEventListener("resize", handleResize);

    controls.dispose();
    axisHelper.dispose();

    renderer.dispose();
    timer.dispose();

    renderer.domElement.remove();
  };

  return {
    cleanUp,
    camera,
    renderer,
    scene,
    timer,
    inspector
  };
}
