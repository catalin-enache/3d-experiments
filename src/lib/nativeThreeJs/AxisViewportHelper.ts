import * as THREE from "three/webgpu";
import * as THREE_WEBGL from "three";

export class AxisViewportHelper {
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.OrthographicCamera;
  private readonly axes: THREE.AxesHelper;

  private readonly renderer: THREE.WebGPURenderer | THREE_WEBGL.WebGLRenderer;

  private readonly size: number;
  private readonly marginX: number;
  private readonly marginY: number;

  constructor(
    renderer: THREE.WebGPURenderer | THREE_WEBGL.WebGLRenderer,
    axisLength = 1,
    size = 100,
    marginX = 0,
    marginY = -10
  ) {
    this.renderer = renderer;
    this.size = size;
    this.marginX = marginX;
    this.marginY = marginY;

    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 0.1, 10);

    this.camera.position.set(0, 0, 3);

    this.axes = new THREE.AxesHelper(axisLength);
    this.scene.add(this.axes);
  }

  render(mainCamera: THREE.Camera) {
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;

    const x = this.marginX;

    const y =
      this.renderer instanceof THREE.WebGPURenderer
        ? height - this.size - this.marginY
        : this.marginY;

    const previousAutoClear = this.renderer.autoClear;

    this.renderer.autoClear = false;

    this.renderer.setScissorTest(true);

    this.renderer.setViewport(x, y, this.size, this.size);

    this.renderer.setScissor(x, y, this.size, this.size);

    // Clear depth only, not color
    this.renderer.clearDepth();

    this.axes.quaternion.copy(mainCamera.quaternion).invert();

    this.renderer.render(this.scene, this.camera);

    // Restore renderer state
    this.renderer.setScissorTest(false);
    this.renderer.setViewport(0, 0, width, height);

    this.renderer.autoClear = previousAutoClear;
  }

  dispose() {
    this.axes.geometry.dispose();

    if (Array.isArray(this.axes.material)) {
      this.axes.material.forEach((material) => {
        material.dispose();
      });
    } else {
      this.axes.material.dispose();
    }
  }
}
