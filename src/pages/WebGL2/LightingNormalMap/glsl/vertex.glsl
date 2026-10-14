#version 300 es

in vec4 a_position;
in vec3 a_normal;
// xyz = tangent, w = handedness of the bitangent (+1 or -1)
in vec4 a_tangent;
in vec2 a_texcoord;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;
// u_worldInverseTranspose is also called the normalMatrix,
// it transforms normals from local space to world space
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;
out vec4 v_tangent;
out vec2 v_texcoord;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  // normals are perpendicular to the surface so they need the inverse transpose,
  // which keeps the rotation as is but inverts the scale (1 / scale):
  // stretching a surface along an axis flattens it there, so its normal
  // must lean away from that axis  (to stay perpendicular to the flatter surface)
  // instead of being stretched with it.
  // tangents lie along the surface so they transform in the same way as the surface itself
  v_normal = mat3(u_worldInverseTranspose) * a_normal; // a_normal [local] -> v_normal [world]
  v_tangent = vec4(mat3(u_world) * a_tangent.xyz, a_tangent.w); // a_tangent [local] -> v_tangent [world]
  v_texcoord = a_texcoord;
}
