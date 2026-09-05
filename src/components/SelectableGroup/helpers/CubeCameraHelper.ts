import * as THREE from "three/webgpu";

export class CubeCameraHelper extends THREE.Group {
  private helpers: THREE.CameraHelper[] = [];

  constructor(camera: THREE.CubeCamera) {
    super();
    for (const child of camera.children) {
      if (child instanceof THREE.PerspectiveCamera) {
        const helper = new THREE.CameraHelper(child);
        helper.update();
        this.helpers.push(helper);
        this.add(helper);
      }
    }
  }

  update() {
    for (const helper of this.helpers) {
      helper.update();
    }
  }

  dispose() {
    for (const helper of this.helpers) {
      helper.dispose();
    }
  }
}
