#version 300 es
precision highp float;

// passed in and varied from the vertex shader
in vec3 v_normal;
// DIFFERENT from the directional light: the direction toward the light
// comes per pixel from the vertex shader instead of one uniform for everything
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;
// DIFFERENT: distance at which the light is at half its brightness
uniform float u_falloffDistance;
// true for the light marker, which shows its plain color
uniform bool u_unlit;
// how focused the specular highlight is, the bigger the smaller and sharper
uniform float u_shininess;
// color of the light, tints the diffuse part (the surface color is multiplied by it)
// and is the color of the highlight too
uniform vec3 u_lightColor;

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
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);

  // the half vector points halfway between the light and the eye.
  // When the normal points that way the surface is tilted just right to
  // mirror the light into the eye, which is where the highlight shows up
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  // same as the directional light: the dot product of the normal
  // and the direction toward the light.
  // Faces pointing away from the light give a negative value, clamp it to 0
  float light = max(dot(normal, surfaceToLightDirection), 0.0);

  // specular (Blinn-Phong): 1 when the normal matches the half vector,
  // going down as they move apart. Raising it to the shininess power
  // keeps the peak at 1 but makes it fall off faster around it:
  // low shininess = wide soft highlight, high shininess = small sharp spot.
  //
  // Why pow does that: dot(normal, halfVector) is between 0 and 1.
  // Multiplying a number below 1 by itself makes it smaller, and the further
  // it is below 1 the faster it shrinks. 1 stays 1 no matter the power.
  // So the power keeps the very center of the highlight and eats its edges:
  //
  //   angle between normal and halfVector:    0     5    10    20    45 deg
  //   dot = cos(angle):                     1.00  0.996 0.985 0.94  0.71
  //   pow(dot, 1)   (no shininess)          1.00  1.00  0.98  0.94  0.71
  //   pow(dot, 10)                          1.00  0.96  0.86  0.54  0.03
  //   pow(dot, 150) (the default)           1.00  0.56  0.10  0.00  0.00
  //
  // With power 1 the highlight still has 71% at 45 degrees, so it covers
  // most of the lit side. With 150 it is almost gone already at 10 degrees,
  // so only the small spot where the surface mirrors the light remains.
  // pow never changes the peak (1 at 0 degrees), only how wide the spot is
  //
  // Only where the light actually reaches the surface, otherwise the half
  // vector could still give a highlight on a side facing away from the light
  float specular = 0.0;
  if (light > 0.0) {
    specular = pow(max(dot(normal, halfVector), 0.0), u_shininess);
  }

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
  // the farther the light the dimmer both the diffuse and the highlight
  light *= attenuation;
  specular *= attenuation;

  outColor = u_color;

  // diffuse: the surface color tinted by the light color.
  // Multiplying means a surface only reflects the colors the light has,
  // a green surface under a red light gets dark
  outColor.rgb *= light * u_lightColor;

  // specular: added on top with the light color, not the surface color,
  // a highlight is the light itself mirrored into the eye
  // (like the white highlight on a colored plastic under a white light)
  outColor.rgb += specular * u_lightColor;
}
