#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  // orient the normals with the object
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
}
