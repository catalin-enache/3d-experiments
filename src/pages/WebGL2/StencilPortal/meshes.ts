import {
  cubePositions,
  cubeNormals,
  cubeVertexCount,
  spherePositions,
  sphereNormals,
  sphereVertexCount,
  planePositions,
  planeNormals,
  planeVertexCount
} from "@lib/geometries";

export interface Mesh {
  vao: WebGLVertexArrayObject;
  vertexCount: number;
}

// one VAO per geometry, each holding its own positions and normals
export function createMeshes(
  gl: WebGL2RenderingContext,
  positionAttributeLocation: number,
  normalAttributeLocation: number
) {
  function createVao(
    setPositions: (gl: WebGL2RenderingContext) => void,
    setNormals: (gl: WebGL2RenderingContext) => void
  ) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setPositions(gl);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    setNormals(gl);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    return vao;
  }

  const cube: Mesh = {
    vao: createVao(cubePositions, cubeNormals),
    vertexCount: cubeVertexCount
  };
  const sphere: Mesh = {
    vao: createVao(spherePositions, sphereNormals),
    vertexCount: sphereVertexCount
  };
  const plane: Mesh = {
    vao: createVao(planePositions, planeNormals),
    vertexCount: planeVertexCount
  };

  return { cube, sphere, plane };
}
