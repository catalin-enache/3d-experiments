// A unit plane (from -0.5 to 0.5 on X and Y) centered around the origin,
// lying in the XY plane and facing +Z, as 2 non-indexed triangles (for drawArrays).
// Triangles are wound so that with CULL_FACE enabled
// only the side facing +Z is drawn
// prettier-ignore
export const planeVertices = new Float32Array([
  -0.5, -0.5, 0,
  0.5, -0.5, 0,
  0.5, 0.5, 0,
  -0.5, -0.5, 0,
  0.5, 0.5, 0,
  -0.5, 0.5, 0
]);

// prettier-ignore
export const _planeNormals = new Float32Array([
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1
]);

export const planeVertexCount = planeVertices.length / 3;

export function planePositions(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, planeVertices, gl.STATIC_DRAW);
}

export function planeNormals(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, _planeNormals, gl.STATIC_DRAW);
}
