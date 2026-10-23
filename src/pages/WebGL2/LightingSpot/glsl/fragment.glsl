#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;
// distance at which the light is at half its brightness (as for the point light)
uniform float u_falloffDistance;
// true for the light marker and the aim line, which show their plain color
uniform bool u_unlit;
uniform float u_shininess;
uniform vec3 u_lightColor;

// DIFFERENT from the point light: the direction the spot points to
// (from the light outward, normalized on the CPU)
uniform vec3 u_lightDirection;
// DIFFERENT: the edges of the cone, as COSINES of the angles
// between the spot direction and the cone's inner / outer edge.
// Inside the inner cone the light is full, outside the outer cone it is 0,
// in between it fades out
uniform float u_innerLimit;
uniform float u_outerLimit;
// adds a tiny noise to hide the banding of slow gradients (see dither)
uniform bool u_dithering;

out vec4 outColor;

// The canvas stores 8 bits per channel: 256 levels. A slow gradient
// (the dark side of the floor drops 1 level every ~10 pixels) becomes
// flat bands with a 1 level jump between them, which the eye sees as lines.
//
// Dithering adds a different tiny offset to every pixel, between
// -0.5 and +0.5 of a level, before the color gets rounded to 8 bits.
// Near the border between two bands, some pixels then round up and some
// round down, mixed more and more as the true value moves toward the
// next level. The eye averages neighboring pixels, so it sees the
// in-between values again, and the noise itself is too faint to notice.
//
// The noise is "interleaved gradient noise" (Jorge Jimenez, Call of Duty):
// a cheap hash of the pixel position, without the clumps of plain random
// noise, so it looks like an even fine grain.
// gl_FragCoord.xy is the pixel position on the screen, so the pattern is
// fixed to the screen and doesn't crawl over the surfaces
float dither() {
  float noise = fract(
    52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))
  );
  // from 0..1 to -0.5..0.5 of one level (1 / 255)
  return (noise - 0.5) / 255.0;
}

void main() {
  if (u_unlit) {
    outColor = u_color;
    return;
  }

  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  // DIFFERENT: is this point inside the cone?
  // -surfaceToLightDirection is the direction from the light to this point.
  // Its dot product with the spot direction is the cosine of the angle
  // between them: 1 on the center line of the spot, going down
  // as the point moves away from it.
  //
  // The test compares cosines instead of angles, which avoids an acos per
  // pixel. Cosine goes DOWN when the angle goes UP, so the comparison flips:
  //   angle < limit angle   <=>   cos(angle) > cos(limit angle)
  float dotFromDirection = dot(-surfaceToLightDirection, u_lightDirection);

  // a hard edge would be step(u_outerLimit, dotFromDirection): 1 inside, 0 outside.
  // smoothstep(edge0, edge1, x) is 0 below edge0, 1 above edge1 and a smooth
  // S-curve in between, so the light fades out between the two cones.
  // edge0 must be smaller than edge1 (GLSL leaves edge0 >= edge1 undefined):
  // the outer cone is the wider angle so it has the SMALLER cosine.
  // When inner == outer the max keeps a tiny gap: a hard edge
  float inLight = smoothstep(
    u_outerLimit,
    max(u_innerLimit, u_outerLimit + 0.0001),
    dotFromDirection
  );

  // the same diffuse and specular as the point light
  float light = max(dot(normal, surfaceToLightDirection), 0.0);
  float specular = step(0.0001, light) * pow(max(dot(normal, halfVector), 0.0), u_shininess);

  // fade with distance, as for the point light
  float distanceToLight = length(v_surfaceToLight);
  float d = distanceToLight / u_falloffDistance;
  float attenuation = 1.0 / (1.0 + d * d);

  // DIFFERENT: outside the cone there is neither diffuse light nor highlight
  light *= attenuation * inLight;
  specular *= attenuation * inLight;

  outColor = u_color;
  outColor.rgb *= light * u_lightColor;
  outColor.rgb += specular * u_lightColor;

  // the same offset for r, g and b: the grays stay gray
  if (u_dithering) {
    outColor.rgb += dither();
  }
}
