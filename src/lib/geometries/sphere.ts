// A unit sphere centered around the origin, built from latitude bands and
// longitude segments as non-indexed triangles (for drawArrays).
// Triangles are wound so that with CULL_FACE enabled
// only the faces pointing toward the viewer are drawn
const LAT_BANDS = 16;
const LON_SEGMENTS = 32;

function buildSphere() {
  const positions: number[] = [];

  // theta goes from the top pole (0) to the bottom pole (PI),
  // phi goes around the Y axis starting at +Z
  const point = (lat: number, lon: number) => {
    const theta = (lat * Math.PI) / LAT_BANDS;
    const phi = (lon * 2 * Math.PI) / LON_SEGMENTS;
    return [
      Math.sin(theta) * Math.sin(phi),
      Math.cos(theta),
      Math.sin(theta) * Math.cos(phi)
    ];
  };

  for (let lat = 0; lat < LAT_BANDS; ++lat) {
    for (let lon = 0; lon < LON_SEGMENTS; ++lon) {
      const topLeft = point(lat, lon);
      const topRight = point(lat, lon + 1);
      const bottomLeft = point(lat + 1, lon);
      const bottomRight = point(lat + 1, lon + 1);
      positions.push(
        ...topLeft,
        ...bottomLeft,
        ...topRight,
        ...topRight,
        ...bottomLeft,
        ...bottomRight
      );
    }
  }

  return new Float32Array(positions);
}

export const sphereVertices = buildSphere();

// for a unit sphere centered at the origin the normal is the position itself
export const _sphereNormals = sphereVertices;

export const sphereVertexCount = sphereVertices.length / 3;

export function spherePositions(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, sphereVertices, gl.STATIC_DRAW);
}

export function sphereNormals(gl: WebGL2RenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, _sphereNormals, gl.STATIC_DRAW);
}
