#version 300 es

in vec4 a_position;
in vec3 a_normal;
// xyz = tangent, w = handedness of the bitangent (+1 or -1)
in vec4 a_tangent;
in vec2 a_texcoord;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;
out vec4 v_tangent;
out vec2 v_texcoord;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  // normals are perpendicular to the surface so they need the inverse transpose,
  // tangents lie along the surface so they move with the surface itself
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
  v_tangent = vec4(mat3(u_world) * a_tangent.xyz, a_tangent.w);
  v_texcoord = a_texcoord;
}
