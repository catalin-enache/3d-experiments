import * as THREE from "three/webgpu";

export function getAxisAngle(q: THREE.Quaternion): {
  axis: THREE.Vector3;
  angle: number;
} {
  // Clamp to avoid NaN errors from floating point precision
  const w = Math.min(Math.max(q.w, -1), 1);
  const angle = 2 * Math.acos(w);
  // x^2 + y^2 + z^2 + w^2 = 1
  const s = Math.sqrt(1 - w * w);

  const axis = new THREE.Vector3();

  if (s < 0.0001) {
    // If s is close to zero, the axis direction doesn't matter
    axis.set(1, 0, 0);
  } else {
    axis.set(q.x / s, q.y / s, q.z / s);
  }

  return { axis, angle };
}
