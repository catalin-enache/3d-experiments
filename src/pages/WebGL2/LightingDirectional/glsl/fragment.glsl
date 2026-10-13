#version 300 es
precision highp float;

// passed in and varied from the vertex shader
in vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

out vec4 outColor;

void main() {
  // because v_normal is a varying it's interpolated
  // so it will not be a unit vector. Normalizing it
  // will make it a unit vector again
  vec3 normal = normalize(v_normal);

  // compute the light by taking the dot product
  // of the normal to the light's reverse direction.
  // Faces pointing away from the light give a negative value, clamp it to 0
  float light = max(dot(normal, u_reverseLightDirection), 0.0);

  outColor = u_color;

  // multiply just the color portion (not the alpha) by the light
  outColor.rgb *= light;
}
