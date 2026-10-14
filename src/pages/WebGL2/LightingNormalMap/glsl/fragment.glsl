#version 300 es
precision highp float;

in vec3 v_normal;
in vec4 v_tangent;
in vec2 v_texcoord;

uniform sampler2D u_normalMap;
uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

out vec4 outColor;

void main() {
  // the surface frame (tangent space) in world space:
  // tangent = +u, bitangent = +v, normal = out of the surface
  vec3 normal = normalize(v_normal);
  // Gram–Schmidt: after interpolation and the world transform the tangent may
  // no longer be exactly perpendicular to the normal, so remove the part
  // of it that lies along the normal
  vec3 tangent = normalize(v_tangent.xyz - dot(v_tangent.xyz, normal) * normal);
  // w flips the bitangent when the uvs are mirrored
  vec3 bitangent = cross(normal, tangent) * v_tangent.w;
  mat3 tbn = mat3(tangent, bitangent, normal);

  // the normal map stores tangent space normals as colors,
  // map them from 0..1 back to -1..1 and bring them to world space
  vec3 mapNormal = texture(u_normalMap, v_texcoord).rgb * 2.0 - 1.0;
  vec3 worldNormal = normalize(tbn * mapNormal);

  float light = max(dot(worldNormal, u_reverseLightDirection), 0.0);

  outColor = vec4(u_color.rgb * light, u_color.a);
}
