import { computeTangents } from "./tangents";

// A unit cube (from -0.5 to 0.5 on every axis) centered around the origin,
// as non-indexed triangles (for drawArrays). Every face has its own vertices
// so it can have its own normal and texture coordinates.
// Triangles are wound so that with CULL_FACE enabled
// only the faces pointing toward the viewer are drawn.
// The tangents are not defined here, they are computed from positions and uvs
//
// Every face lists its corners as seen from outside the cube:
// bottom-left, bottom-right, top-right, top-left
// which get the uvs (0, 0), (1, 0), (1, 1), (0, 1)
// prettier-ignore
const faces = [
  // front
  {
    normal: [0, 0, 1],
    corners: [
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5]]
  },
  // back
  {
    normal: [0, 0, -1],
    corners: [
      [0.5, -0.5, -0.5],
      [-0.5, -0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [0.5, 0.5, -0.5]]
  },
  // right
  {
    normal: [1, 0, 0],
    corners: [
      [0.5, -0.5, 0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [0.5, 0.5, 0.5]]
  },
  // left
  {
    normal: [-1, 0, 0],
    corners: [
      [-0.5, -0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [-0.5, 0.5, 0.5],
      [-0.5, 0.5, -0.5]]
  },
  // top
  {
    normal: [0, 1, 0],
    corners: [
      [-0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5]]
  },
  // bottom
  {
    normal: [0, -1, 0],
    corners: [
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, -0.5, 0.5],
      [-0.5, -0.5, 0.5]]
  }
];

// prettier-ignore
const cornerUvs = [[0, 0], [1, 0], [1, 1], [0, 1]];

// two triangles per face, as indices into its corners
const faceTriangles = [0, 1, 2, 0, 2, 3];

function buildCube() {
  const positions: number[] = [];
  const normals: number[] = [];
  const texcoords: number[] = [];

  for (const { normal, corners } of faces) {
    for (const corner of faceTriangles) {
      positions.push(...corners[corner]);
      normals.push(...normal);
      texcoords.push(...cornerUvs[corner]);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texcoords: new Float32Array(texcoords)
  };
}

const cube = buildCube();

export const cubeVertices = cube.positions;
export const _cubeNormals = cube.normals;
export const _cubeTexcoords = cube.texcoords;
// 4 components per vertex, w is the handedness of the bitangent
export const _cubeTangents = computeTangents(
  cubeVertices,
  _cubeNormals,
  _cubeTexcoords
);

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
