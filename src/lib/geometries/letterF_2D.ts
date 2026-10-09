// Triangles are wound so that with CULL_FACE enabled
// only the faces pointing toward the viewer are drawn
export const letterF2DVertices =
  // prettier-ignore
  new Float32Array([
    // left column
    0, 0, 0,
    0, 150, 0,
    30, 0, 0,
    0, 150, 0,
    30, 150, 0,
    30, 0, 0,

    // top rung
    30, 0, 0,
    30, 30, 0,
    100, 0, 0,
    30, 30, 0,
    100, 30, 0,
    100, 0, 0,

    // middle rung
    30, 60, 0,
    30, 90, 0,
    67, 60, 0,
    30, 90, 0,
    67, 90, 0,
    67, 60, 0
  ]);

export const letterF2DVertexCount = letterF2DVertices.length / 3;

export function letterF2D(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, letterF2DVertices, gl.STATIC_DRAW);
}
