#version 300 es
precision highp float;

in vec3 v_normal;
in vec4 v_tangent;
in vec2 v_texcoord;

uniform sampler2D u_normalMap;
uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

out vec4 outColor;

// Spaces of every value, [local] / [world] / [tangent]:
//
//  Tangent space is just much more local than local space:
//  a whole object has one local space,
//  but every point on the surface has its own tangent space.
//
// VERTEX SHADER (per vertex)
//
//   a_normal  [local] --(inverse transpose)--> v_normal  [world]
//   a_tangent [local] --(world matrix)-------> v_tangent [world]
//
// FRAGMENT SHADER (per pixel)
//
//   v_normal  [world] --(normalize)----------> normal    [world]
//   v_tangent [world] --(Gram-Schmidt)-------> tangent   [world]
//   cross(normal, tangent) * w --------------> bitangent [world]
//
//   tbn = mat3(tangent, bitangent, normal)
//         the face's axes in world space, converts [tangent] -> [world]
//   note: transpose(tbn) converts [world] -> [tangent]
//         tbn * transpose(tbn) = identity
//         TBN space is is also called surface space or texture space
//
//   normal map pixel --(* 2.0 - 1.0)--> mapNormal   [tangent]
//   tbn * mapNormal ------------------> worldNormal [world]
//
//   dot(worldNormal [world], u_reverseLightDirection [world]) --> light
//   (a dot product needs both vectors in the same space)

void main() {
  // build the surface frame (tangent space) in world space:
  // tangent = +u, bitangent = +v, normal = out of the surface

  // interpolation between vertices can shorten the normal, make it length 1 again
  vec3 normal = normalize(v_normal);
  // Gram–Schmidt: interpolation can also leave the tangent not exactly
  // perpendicular to the normal, so remove the part of it that lies along the normal
  vec3 tangent = normalize(v_tangent.xyz - dot(v_tangent.xyz, normal) * normal);
  // w flips the bitangent when the uvs are mirrored
  vec3 bitangent = cross(normal, tangent) * v_tangent.w;
  // columns are the frame's axes, so tbn * v turns a tangent space vector into world space
  // tbn describes how the face sits in the world
  // tbn * transpose(tbn) = identity
  // transpose(tbn) convertes a world space vector into tangent space
  mat3 tbn = mat3(tangent, bitangent, normal);

  // the normal map stores tangent space normals as colors,
  // map them from 0..1 back to -1..1 and bring them to world space

  vec3 mapNormal = texture(u_normalMap, v_texcoord).rgb * 2.0 - 1.0;
  vec3 worldNormal = normalize(tbn * mapNormal);

  float light = max(dot(worldNormal, u_reverseLightDirection), 0.0);

  outColor = vec4(u_color.rgb * light, u_color.a);
}
