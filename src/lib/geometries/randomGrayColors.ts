// One random gray (128-255) for every group of `verticesPerColor`
// consecutive vertices, as RGBA bytes for every vertex
// (for a normalized UNSIGNED_BYTE attribute: 0-255 becomes 0.0-1.0).
//
// The cube and the sphere in @lib/geometries are non-indexed and list
// their faces / quads one after the other, 6 vertices (2 triangles) each,
// so verticesPerColor = 6 gives every face / quad its own flat color.
// Tinted in the shader (color * mult + offset) it shows the shape's facets.
export function randomGrayColors(
  vertexCount: number,
  verticesPerColor: number
) {
  const colors = new Uint8Array(vertexCount * 4);
  let gray = 0;
  for (let vertex = 0; vertex < vertexCount; vertex++) {
    if (vertex % verticesPerColor === 0) {
      gray = (128 + Math.random() * 128) | 0;
    }
    colors.set([gray, gray, gray, 255], vertex * 4);
  }
  return colors;
}
