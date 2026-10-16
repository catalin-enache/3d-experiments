#version 300 es
precision highp float;

in vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;
// true for the portal surface, which shows its plain color
uniform bool u_unlit;

out vec4 outColor;

void main() {
  if (u_unlit) {
    outColor = u_color;
    return;
  }

  vec3 normal = normalize(v_normal);

  // directional light plus a bit of ambient
  // so the faces turned away from the light are not black
  float light = max(dot(normal, u_reverseLightDirection), 0.0);
  float ambient = 0.25;

  outColor = u_color;
  outColor.rgb *= ambient + (1.0 - ambient) * light;
}
