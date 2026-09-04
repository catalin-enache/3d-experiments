import * as THREE from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Inspector } from "three/addons/inspector/Inspector.js";

export function scenarioHome(container: HTMLElement) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  camera.position.z = 5;

  const renderer = new THREE.WebGPURenderer({
    antialias: true,
    forceWebGL: false
  });

  renderer.inspector = new Inspector();

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  // Cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  const timer = new THREE.Timer();
  timer.connect(document);

  function tick() {
    timer.update();

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update();

    renderer.render(scene, camera);
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
  return () => {
    window.removeEventListener("resize", handleResize);

    controls.dispose();

    geometry.dispose();
    material.dispose();
    renderer.dispose();
    timer.dispose();

    renderer.domElement.remove();
  };
}
