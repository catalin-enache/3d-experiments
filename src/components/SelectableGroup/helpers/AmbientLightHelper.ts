import * as THREE from "three";

export class AmbientLightHelper extends THREE.Group {
  private light: THREE.AmbientLight;
  private readonly geometry: THREE.SphereGeometry;
  private readonly material: THREE.MeshBasicMaterial;
  private readonly marker: THREE.Mesh;

  constructor(light: THREE.AmbientLight, size = 1) {
    super();

    this.light = light;

    this.geometry = new THREE.SphereGeometry(size, 12, 8);

    this.material = new THREE.MeshBasicMaterial({
      color: light.color,
      wireframe: true,
      toneMapped: false,
      depthTest: false
    });

    this.marker = new THREE.Mesh(this.geometry, this.material);

    this.add(this.marker);

    this.update();
  }

  update() {
    this.light.getWorldPosition(this.position);

    this.material.color.copy(this.light.color);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
