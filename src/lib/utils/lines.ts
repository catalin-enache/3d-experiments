import * as THREE from "three";

export function makeLineGeometry() {
  return new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(),
    new THREE.Vector3()
  ]);
}

export function setLinePoints(
  line: THREE.Line,
  start: THREE.Vector3,
  end: THREE.Vector3
) {
  const positions = line.geometry.attributes.position;

  positions.setXYZ(0, start.x, start.y, start.z);
  positions.setXYZ(1, end.x, end.y, end.z);

  positions.needsUpdate = true;

  line.geometry.computeBoundingSphere();

  if (line.material instanceof THREE.LineDashedMaterial) {
    line.computeLineDistances();
  }
}
