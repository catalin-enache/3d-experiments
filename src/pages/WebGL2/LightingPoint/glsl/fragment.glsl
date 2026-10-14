#version 300 es
precision highp float;

// passed in and varied from the vertex shader
in vec3 v_normal;
// DIFFERENT from the directional light: the direction toward the light
// comes per pixel from the vertex shader instead of one uniform for everything
in vec3 v_surfaceToLight;

uniform vec4 u_color;
// DIFFERENT: distance at which the light is at half its brightness
uniform float u_falloffDistance;
// true for the light marker, which shows its plain color
uniform bool u_unlit;

out vec4 outColor;

void main() {
  if (u_unlit) {
    outColor = u_color;
    return;
  }

  // because v_normal is a varying it's interpolated
  // so it will not be a unit vector. Normalizing it
  // will make it a unit vector again
  vec3 normal = normalize(v_normal);

  // DIFFERENT: the directional light was normalized once on the CPU,
  // here every pixel has its own direction toward the light
  // so it is normalized per pixel
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);

  // same as the directional light: the dot product of the normal
  // and the direction toward the light.
  // Faces pointing away from the light give a negative value, clamp it to 0
  float light = max(dot(normal, surfaceToLightDirection), 0.0);

  // DIFFERENT: fade with distance (attenuation).
  // A directional light is infinitely far away so the distance is the same
  // everywhere and it never fades. A point light spreads its light over
  // a bigger and bigger sphere as it goes out, so it gets dimmer.
  // Real light fades as 1 / distance^2, which is infinite at the light itself,
  // so 1 is added: 1 at the light, 0.5 at u_falloffDistance, then going
  // down like 1 / distance^2 far away.
  // v_surfaceToLight was not normalized so its length is still the distance
  float distanceToLight = length(v_surfaceToLight);
  float d = distanceToLight / u_falloffDistance;
  float attenuation = 1.0 / (1.0 + d * d);
  light *= attenuation;

  outColor = u_color;

  // multiply just the color portion (not the alpha) by the light
  outColor.rgb *= light;
}
