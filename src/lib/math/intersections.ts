import * as THREE from "three/webgpu";

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

export type IntersectionType =
  "segment_segment" | "line_line" | "segment_line" | "line_segment";

/*
 * ============================================================
 * 2D INTERSECTION
 * ============================================================
 */

export function cross2D(a: THREE.Vector2, b: THREE.Vector2): number {
  return a.x * b.y - a.y * b.x;
}
/*
t = uPerp dot c / uPerp dot v = (c × u) / (v × u)
s = vPerp dot c / uPerp dot v = (c × v) / (v × u)
* */
export function intersectLineLine2D({
  A,
  B,
  C,
  D,
  intersectionType = "segment_segment",
  epsilon = 1e-8
}: {
  A: THREE.Vector2;
  B: THREE.Vector2;
  C: THREE.Vector2;
  D: THREE.Vector2;
  intersectionType?: IntersectionType;
  epsilon?: number;
}): THREE.Vector2 | null {
  // First primitive:
  //
  // P(t) = A + t(B - A)
  //
  // Second primitive:
  //
  // Q(s) = C + s(D - C)

  const v = B.clone().sub(A);
  const u = D.clone().sub(C);

  const c = C.clone().sub(A);

  const denominator = cross2D(v, u);

  /*
   * Parallel / coincident.
   *
   * |v × u| / (|v||u|) = |sin(theta)|
   */
  const lengthProduct = v.length() * u.length();

  if (lengthProduct < epsilon) {
    return null;
  }

  if (Math.abs(denominator) / lengthProduct < epsilon) {
    return null;
  }

  /*
   * Parameter on AB:
   *
   * t = (c × u) / (v × u)
   */
  const t = cross2D(c, u) / denominator;

  /*
   * Parameter on CD:
   *
   * s = (c × v) / (v × u)
   */
  const s = cross2D(c, v) / denominator;

  const firstIsSegment =
    intersectionType === "segment_segment" ||
    intersectionType === "segment_line";

  const secondIsSegment =
    intersectionType === "segment_segment" ||
    intersectionType === "line_segment";

  if (firstIsSegment && (t < 0 || t > 1)) {
    return null;
  }

  if (secondIsSegment && (s < 0 || s > 1)) {
    return null;
  }

  return A.clone().addScaledVector(v, t);
}

/*
 * ============================================================
 * 3D INTERSECTION
 * ============================================================
 */

export function intersectLineLine3D({
  p,
  v,
  q,
  u,
  intersectionType = "segment_segment",
  tolerance = 0.01,
  epsilon = 1e-8
}: {
  p: THREE.Vector3;
  v: THREE.Vector3;
  q: THREE.Vector3;
  u: THREE.Vector3;
  intersectionType?:
    "segment_segment" | "line_line" | "segment_line" | "line_segment";
  tolerance?: number;
  epsilon?: number;
}): THREE.Vector3 | null {
  const c = new THREE.Vector3().subVectors(q, p);

  const vLength = v.length();
  const uLength = u.length();

  // Degenerate direction vectors
  if (vLength < epsilon || uLength < epsilon) {
    return null;
  }

  // n = v × u
  const n = new THREE.Vector3().crossVectors(v, u);

  const nLengthSq = n.lengthSq();
  const nLength = Math.sqrt(nLengthSq);

  // Scale-independent parallel test:
  //
  // |v × u| / (|v||u|) = |sin(theta)|
  const sinAngle = nLength / (vLength * uLength);

  if (sinAngle < epsilon) {
    return null;
  }

  // Perpendicular distance between the two 3D lines'
  // supporting planes.
  //
  //      |c · n|
  // d = ----------
  //         |n|
  const skewDistance = Math.abs(c.dot(n)) / nLength;

  // For interactive geometry, allow lines that are
  // sufficiently close to count as intersecting.
  if (skewDistance > tolerance) {
    return null;
  }

  // Parameter on first line
  const cCrossU = new THREE.Vector3().crossVectors(c, u);

  const t = cCrossU.dot(n) / nLengthSq;

  // Parameter on second line
  const cCrossV = new THREE.Vector3().crossVectors(c, v);

  const s = cCrossV.dot(n) / nLengthSq;

  const firstIsSegment =
    intersectionType === "segment_segment" ||
    intersectionType === "segment_line";

  const secondIsSegment =
    intersectionType === "segment_segment" ||
    intersectionType === "line_segment";

  if (firstIsSegment && (t < 0 || t > 1)) {
    return null;
  }

  if (secondIsSegment && (s < 0 || s > 1)) {
    return null;
  }

  return p.clone().addScaledVector(v, t);
}

/*
 * Line: A + w*t
 *
 * Plane: B + v*a + u*e
 *
 * Intersection: A + w*t = B + v*a + u*e | A + w*t = planePoint + planeV*a + planeU*e
 */
export function intersectLinePlane({
  A,
  w,
  planePoint,
  planeU,
  planeV,
  epsilon = 1e-8
}: {
  A: THREE.Vector3;
  w: THREE.Vector3;

  // Any known point B on the plane
  planePoint: THREE.Vector3;

  // Two non-parallel vectors spanning the plane
  planeU: THREE.Vector3;
  planeV: THREE.Vector3;

  epsilon?: number;
}): THREE.Vector3 | null {
  /*
   * Plane normal:
   *
   * n = u × v
   */
  const n = new THREE.Vector3().crossVectors(planeU, planeV);

  const nLength = n.length();

  /*
   * If u and v are parallel (or one is zero),
   * they do not define a valid plane.
   */
  if (nLength < epsilon) {
    return null;
  }

  /*
   * denominator = n · w
   *
   * If n · w = 0, w is perpendicular to n,
   * therefore w is parallel to the plane.
   */
  const denominator = n.dot(w);

  /*
  n · w = 0

  1. Line parallel to plane, outside plane
   → no intersection

  2. Line lies inside plane
   → infinitely many intersections
 */
  if (Math.abs(denominator) < epsilon) {
    return null;
  }

  /*
   * Start from:
   *
   * A + w*t = B + v*a + u*e
   *
   * Dot with n:
   *
   * n·A + t(n·w)
   * =
   * n·B + a(n·v) + e(n·u)
   *
   * Since:
   *
   * n·v = 0
   * n·u = 0
   *
   * we get:
   *
   * n·A + t(n·w) = n·B
   *
   * t(n·w) = n·(B - A)
   *
   *             n·(B - A)
   * t = -------------------------
   *                 n·w
   */

  const planePointMinusA = new THREE.Vector3().subVectors(planePoint, A);

  const t = n.dot(planePointMinusA) / denominator;

  /*
   * Intersection:
   *
   * H = A + w*t
   */
  return A.clone().addScaledVector(w, t);
}
