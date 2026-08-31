import * as THREE from "three";

export function formatVector3(vector: THREE.Vector3) {
  return `(${vector.x.toFixed(3)}, ${vector.y.toFixed(3)}, ${vector.z.toFixed(3)})`;
}

export function formatEulerDeg(euler: THREE.Euler) {
  return `(${THREE.MathUtils.radToDeg(euler.x).toFixed(2)}°, ${THREE.MathUtils.radToDeg(euler.y).toFixed(2)}°, ${THREE.MathUtils.radToDeg(euler.z).toFixed(2)}°)`;
}

export function formatMatrix4(matrix: THREE.Matrix4) {
  /*
   * THREE.Matrix4.elements is stored column-major internally,
   * but we display it in the usual mathematical row layout.
   */
  const e = matrix.elements;

  const rows = [
    [e[0], e[4], e[8], e[12]],
    [e[1], e[5], e[9], e[13]],
    [e[2], e[6], e[10], e[14]],
    [e[3], e[7], e[11], e[15]]
  ];

  return rows
    .map(
      (row) =>
        `[ ${row.map((value) => value.toFixed(3).padStart(7)).join(" ")} ]`
    )
    .join("\n");
}
