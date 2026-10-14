// Computes per vertex tangents from positions, normals and texture coordinates
// of non-indexed triangles (every 3 vertices form a triangle).
//
// The tangent is the direction in which u grows on the surface and the bitangent
// the direction in which v grows. For a triangle with edges
// e1 = p1 - p0,
// e2 = p2 - p0
// and uv deltas
// (du1, dv1), (du2, dv2):
//   e1 = du1 * T + dv1 * B
//   e2 = du2 * T + dv2 * B
// solving this 2x2 system gives T and B.
//
// T is then made perpendicular to the vertex normal (Gram–Schmidt) and
// a handedness sign is stored in w so the shader can rebuild the bitangent as
// cross(normal, tangent.xyz) * tangent.w, also when the uvs are mirrored.
// Returns 4 components (x, y, z, w) per vertex.
export function computeTangents(
  positions: Float32Array,
  normals: Float32Array,
  texcoords: Float32Array
) {
  const vertexCount = positions.length / 3;
  const tangents = new Float32Array(vertexCount * 4);

  const position = (i: number) => [
    positions[i * 3],
    positions[i * 3 + 1],
    positions[i * 3 + 2]
  ];
  const uv = (i: number) => [texcoords[i * 2], texcoords[i * 2 + 1]];

  for (let i = 0; i < vertexCount; i += 3) {
    const [p0, p1, p2] = [position(i), position(i + 1), position(i + 2)];
    const [uv0, uv1, uv2] = [uv(i), uv(i + 1), uv(i + 2)];

    const e1 = sub(p1, p0);
    const e2 = sub(p2, p0);
    const du1 = uv1[0] - uv0[0];
    const dv1 = uv1[1] - uv0[1];
    const du2 = uv2[0] - uv0[0];
    const dv2 = uv2[1] - uv0[1];

    // How T and B are solved for.
    //
    // Walking along an edge changes u and v. Moving 1 unit of u on the surface
    // is T, moving 1 unit of v is B, so each edge is "du of T plus dv of B":
    //   (1) e1 = du1 * T + dv1 * B
    //   (2) e2 = du2 * T + dv2 * B
    // 2 equations, 2 unknowns (T and B), solved like any school system
    // by removing one unknown at a time:
    //
    // T: multiply (1) by dv2 and (2) by dv1 so B gets the same factor in both
    //   e1 * dv2 = du1 * dv2 * T + dv1 * dv2 * B
    //   e2 * dv1 = du2 * dv1 * T + dv1 * dv2 * B
    //   subtract them, B cancels out:
    //   e1 * dv2 - e2 * dv1 = (du1 * dv2 - du2 * dv1) * T = det * T
    //   T = (e1 * dv2 - e2 * dv1) / det
    //
    // B: multiply (1) by du2 and (2) by du1 so T gets the same factor in both
    //   e1 * du2 = du1 * du2 * T + dv1 * du2 * B
    //   e2 * du1 = du1 * du2 * T + du1 * dv2 * B
    //   subtract them (2nd minus 1st), T cancels out:
    //   e2 * du1 - e1 * du2 = (du1 * dv2 - du2 * dv1) * B = det * B
    //   B = (e2 * du1 - e1 * du2) / det
    //
    // det is the same in both, so 1 / det is computed once as r.
    // A zero determinant means the triangle has no area in uv space
    // (the uvs are on a line or a single point) and T, B can't be found
    const det = du1 * dv2 - du2 * dv1;
    const r = Math.abs(det) > 1e-12 ? 1 / det : 0;
    // the same formula is applied to x, y and z one at a time:
    // axis is the index of the component being computed (0 = x, 1 = y, 2 = z),
    // e1c is "e1 component" = e1[axis], e2c is "e2 component" = e2[axis]
    const tangent = e1.map((e1c, axis) => (e1c * dv2 - e2[axis] * dv1) * r);
    const bitangent = e2.map((e2c, axis) => (e2c * du1 - e1[axis] * du2) * r);

    for (let j = i; j < i + 3; ++j) {
      const normal = [normals[j * 3], normals[j * 3 + 1], normals[j * 3 + 2]];

      // Gram–Schmidt: remove the part of the tangent that lies along the normal
      const t =
        normalize(sub(tangent, scale(normal, dot(normal, tangent)))) ??
        // degenerate uvs, any direction perpendicular to the normal will do
        normalize(
          cross(normal, Math.abs(normal[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])
        )!;
      // -1 when the uvs are mirrored and cross(normal, tangent) points against v
      const w = dot(cross(normal, t), bitangent) < 0 ? -1 : 1;

      tangents.set([...t, w], j * 4);
    }
  }

  return tangents;
}

function sub(a: number[], b: number[]) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale(v: number[], s: number) {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function dot(a: number[], b: number[]) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: number[], b: number[]) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

// returns undefined for a (near) zero length vector
function normalize(v: number[]) {
  const length = Math.hypot(v[0], v[1], v[2]);
  return length > 1e-12 ? scale(v, 1 / length) : undefined;
}
