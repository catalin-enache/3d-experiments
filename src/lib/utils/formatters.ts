import * as THREE from "three";

export function formatVector3(vector: THREE.Vector3) {
  return `(${vector.x.toFixed(3)}, ${vector.y.toFixed(3)}, ${vector.z.toFixed(3)})`;
}

export function formatEulerDeg(euler: THREE.Euler) {
  return `(${THREE.MathUtils.radToDeg(euler.x).toFixed(2)}°, ${THREE.MathUtils.radToDeg(euler.y).toFixed(2)}°, ${THREE.MathUtils.radToDeg(euler.z).toFixed(2)}°)`;
}
