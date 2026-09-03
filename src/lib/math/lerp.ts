import * as THREE from "three";

export const lerp = (a: number, b: number, t: number) => {
  return a + t * (b - a);
};

export const inverseLerp = (
  minValue: number,
  maxValue: number,
  value: number
) => {
  if (minValue === maxValue) {
    return 0;
  }
  const val = (value - minValue) / (maxValue - minValue);
  return Math.max(0, Math.min(1, val));
};

export const remap = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
) => {
  const t = inverseLerp(fromMin, fromMax, value);
  return lerp(toMin, toMax, t);
};

/*
vec3 Slerp(vec3 startVec, vec3 endVec, float t) {
  startVec = normalize(startVec);
  endVec = normalize(endVec);
  float cosTheta = clamp(dot(startVec, endVec), -1.0, 1.0);
  float theta = acos(cosTheta) * t;

  vec3 p = normalize(endVec - startVec * cosTheta);

  return startVec * cos(theta) + p * sin(theta);
}
* */
export function slerpVector3(
  startVec: THREE.Vector3,
  endVec: THREE.Vector3,
  t: number
): THREE.Vector3 {
  const start = startVec.clone().normalize();
  const end = endVec.clone().normalize();

  const cosTheta = THREE.MathUtils.clamp(start.dot(end), -1, 1);
  const theta = Math.acos(cosTheta) * t;

  // Nearly identical vectors
  if (cosTheta > 0.999999) {
    return start.clone().lerp(end, t).normalize();
  }
  // start.dot(end) ≈ -1 // Opposite vectors // handle the case where the vectors are opposite eventually
  else if (cosTheta < -0.999999) {
    throw new Error(
      `Cannot slerp between opposite vectors.
      Consider using a different method or perturbing one of the vectors slightly.`
    );
  }

  const p = end.clone().sub(start.clone().multiplyScalar(cosTheta)).normalize();
  // const p = end.clone().addScaledVector(start, -cosTheta).normalize();

  return start
    .clone()
    .multiplyScalar(Math.cos(theta))
    .add(p.multiplyScalar(Math.sin(theta)));
}

// better for scaling objects
export function logLerp(a: number, b: number, t: number) {
  const logA = Math.log(a);
  const logB = Math.log(b);
  const logResult = lerp(logA, logB, t);
  return Math.exp(logResult);
}
