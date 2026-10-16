// One buffer for both 2D shapes:
// the quad (-1..1, 4 vertices, drawn as a fan or as an outline)
// then the unit circle (center + rim, drawn as a fan, the rim alone is its outline)
const circleSegments = 64;

export interface ShapeRange {
  first: number;
  count: number;
}

export function createShapes(
  gl: WebGL2RenderingContext,
  positionAttributeLocation: number
) {
  const vertices = [-1, -1, 1, -1, 1, 1, -1, 1];
  const quad: ShapeRange = { first: 0, count: 4 };

  const circleFirst = vertices.length / 2;
  vertices.push(0, 0);
  for (let i = 0; i <= circleSegments; ++i) {
    const angle = (i / circleSegments) * Math.PI * 2;
    vertices.push(Math.cos(angle), Math.sin(angle));
  }
  // center + rim + the first rim point again to close the fan
  const circle: ShapeRange = { first: circleFirst, count: circleSegments + 2 };
  // the rim only, without the center and the closing point
  const circleRim: ShapeRange = {
    first: circleFirst + 1,
    count: circleSegments
  };

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  return { vao, quad, circle, circleRim };
}
