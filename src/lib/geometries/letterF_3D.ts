// The F is centered around the origin with +Y up (+Z towards the viewer).
// Triangles are wound so that with CULL_FACE enabled
// only the faces pointing toward the viewer are drawn
export const letterF3DVertices =
  // prettier-ignore
  new Float32Array([
    // left column front
    -50, 75, 15,
    -50, -75, 15,
    -20, 75, 15,
    -50, -75, 15,
    -20, -75, 15,
    -20, 75, 15,

    // top rung front
    -20, 75, 15,
    -20, 45, 15,
    50, 75, 15,
    -20, 45, 15,
    50, 45, 15,
    50, 75, 15,

    // middle rung front
    -20, 15, 15,
    -20, -15, 15,
    17, 15, 15,
    -20, -15, 15,
    17, -15, 15,
    17, 15, 15,

    // left column back
    -50, 75, -15,
    -20, 75, -15,
    -50, -75, -15,
    -50, -75, -15,
    -20, 75, -15,
    -20, -75, -15,

    // top rung back
    -20, 75, -15,
    50, 75, -15,
    -20, 45, -15,
    -20, 45, -15,
    50, 75, -15,
    50, 45, -15,

    // middle rung back
    -20, 15, -15,
    17, 15, -15,
    -20, -15, -15,
    -20, -15, -15,
    17, 15, -15,
    17, -15, -15,

    // top
    -50, 75, 15,
    50, 75, 15,
    50, 75, -15,
    -50, 75, 15,
    50, 75, -15,
    -50, 75, -15,

    // top rung right
    50, 75, 15,
    50, 45, 15,
    50, 45, -15,
    50, 75, 15,
    50, 45, -15,
    50, 75, -15,

    // under top rung
    -20, 45, 15,
    -20, 45, -15,
    50, 45, -15,
    -20, 45, 15,
    50, 45, -15,
    50, 45, 15,

    // between top rung and middle
    -20, 45, 15,
    -20, 15, -15,
    -20, 45, -15,
    -20, 45, 15,
    -20, 15, 15,
    -20, 15, -15,

    // top of middle rung
    -20, 15, 15,
    17, 15, -15,
    -20, 15, -15,
    -20, 15, 15,
    17, 15, 15,
    17, 15, -15,

    // right of middle rung
    17, 15, 15,
    17, -15, -15,
    17, 15, -15,
    17, 15, 15,
    17, -15, 15,
    17, -15, -15,

    // bottom of middle rung.
    -20, -15, 15,
    -20, -15, -15,
    17, -15, -15,
    -20, -15, 15,
    17, -15, -15,
    17, -15, 15,

    // right of bottom
    -20, -15, 15,
    -20, -75, -15,
    -20, -15, -15,
    -20, -15, 15,
    -20, -75, 15,
    -20, -75, -15,

    // bottom
    -50, -75, 15,
    -50, -75, -15,
    -20, -75, -15,
    -50, -75, 15,
    -20, -75, -15,
    -20, -75, 15,

    // left side
    -50, 75, 15,
    -50, 75, -15,
    -50, -75, -15,
    -50, 75, 15,
    -50, -75, -15,
    -50, -75, 15
  ]);

export const _letterF3DNormals =
  // prettier-ignore
  new Float32Array([
    // left column front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // top rung front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // middle rung front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // left column back
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,

    // top rung back
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,

    // middle rung back
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,

    // top
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // top rung right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // under top rung
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,

    // between top rung and middle
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // top of middle rung
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // right of middle rung
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // bottom of middle rung.
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,

    // right of bottom
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // bottom
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,

    // left side
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
]);

export const letterF3DVertexCount = letterF3DVertices.length / 3;

// RGB per vertex, 0-255 (use normalize: true in vertexAttribPointer)
export const letterF3DVertexColors =
  // prettier-ignore
  new Uint8Array([
    // left column front
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,

    // top rung front
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,

    // middle rung front
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,

    // left column back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

    // top rung back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

    // middle rung back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

    // top
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,

    // top rung right
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,

    // under top rung
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,

    // between top rung and middle
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,

    // top of middle rung
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,

    // right of middle rung
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,

    // bottom of middle rung.
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,

    // right of bottom
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,

    // bottom
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,

    // left side
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220
  ]);

export function letterF3DPositions(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, letterF3DVertices, gl.STATIC_DRAW);
}

export function letterF3DNormals(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, _letterF3DNormals, gl.STATIC_DRAW);
}

export function letterF3DColors(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, letterF3DVertexColors, gl.STATIC_DRAW);
}
