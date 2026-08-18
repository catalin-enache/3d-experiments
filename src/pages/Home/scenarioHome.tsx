import * as THREE from 'three';

export function scenarioHome(container: HTMLElement) {
  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  // Cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshNormalMaterial();

  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  // Animation
  let animationId: number;

  function animate() {
    animationId = requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();

  // Resize
  function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  window.addEventListener('resize', handleResize);

  // React calls this when leaving the page
  return () => {
    console.log('Cleaning up Three.js scene...');
    cancelAnimationFrame(animationId);

    window.removeEventListener('resize', handleResize);

    geometry.dispose();
    material.dispose();
    renderer.dispose();

    renderer.domElement.remove();
  };
}
