// A unit cube (from -0.5 to 0.5 on every axis) centered around the origin,
// as non-indexed triangles (for drawArrays). Every face has its own vertices
// so it can have its own normal, tangent and texture coordinates.
// Triangles are wound so that with CULL_FACE enabled
// only the faces pointing toward the viewer are drawn
//
// For every face the tangent points along +u of the texture and
// the bitangent (+v) is cross(normal, tangent),
// so the shader can rebuild it instead of having its own attribute
const faces = [
  // front
  { normal: [0, 0, 1], tangent: [1, 0, 0] },
  // back
  { normal: [0, 0, -1], tangent: [-1, 0, 0] },
  // right
  { normal: [1, 0, 0], tangent: [0, 0, -1] },
  // left
  { normal: [-1, 0, 0], tangent: [0, 0, 1] },
  // top
  { normal: [0, 1, 0], tangent: [1, 0, 0] },
  // bottom
  { normal: [0, -1, 0], tangent: [1, 0, 0] }
];

// two triangles per face, as (u, v) corners of the face
// prettier-ignore
const faceCorners = [
  0, 0,  1, 0,  1, 1,
  0, 0,  1, 1,  0, 1
];

function cross(a: number[], b: number[]) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function buildCube() {
  const positions: number[] = [];
  const normals: number[] = [];
  const tangents: number[] = [];
  const texcoords: number[] = [];

  for (const { normal, tangent } of faces) {
    const bitangent = cross(normal, tangent);
    for (let i = 0; i < faceCorners.length; i += 2) {
      const u = faceCorners[i];
      const v = faceCorners[i + 1];
      // start at the face center and move along the tangent (u) and bitangent (v)
      for (let k = 0; k < 3; ++k) {
        positions.push(
          normal[k] * 0.5 + tangent[k] * (u - 0.5) + bitangent[k] * (v - 0.5)
        );
      }
      normals.push(...normal);
      tangents.push(...tangent);
      texcoords.push(u, v);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texcoords: new Float32Array(texcoords)
  };
}

const cube = buildCube();

export const cubeVertices = cube.positions;
export const _cubeNormals = cube.normals;
export const _cubeTangents = cube.tangents;
export const _cubeTexcoords = cube.texcoords;

export const cubeVertexCount = cubeVertices.length / 3;

export function cubePositions(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
}

export function cubeNormals(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, _cubeNormals, gl.STATIC_DRAW);
}

export function cubeTangents(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, _cubeTangents, gl.STATIC_DRAW);
}

export function cubeTexcoords(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, _cubeTexcoords, gl.STATIC_DRAW);
}
