// Dithering: hides the banding of slow gradients.
//
// The canvas stores 8 bits per channel: 256 levels. A slow gradient
// (the dark side of the floor drops 1 level every ~10 pixels) becomes
// flat bands with a 1 level jump between them, which the eye sees as lines.
//
// Dithering adds a different tiny offset to every pixel before the color
// gets rounded to 8 bits. Near the border between two bands, some pixels
// then round up and some round down, mixed more and more as the true value
// moves toward the next level. The eye averages neighboring pixels, so it
// sees the in-between values again, and the noise itself is too faint to notice.
//
// Why +-1 level and not +-0.5 (just enough to cover one rounding):
// - the shader's rounding is not the last one. The browser / OS converts
//   the canvas colors to the display's color profile (e.g. Display P3) and
//   rounds them to 8 bits AGAIN, which can turn the dark steps into 2 levels.
//   A +-0.5 noise is too small to bridge those steps
// - triangular noise (the sum of 2 uniform ones) instead of uniform:
//   with uniform noise how visible the grain is depends on the value
//   (none where the true value is exactly on a level, the most halfway
//   between two), which leaves faint bands of grain. Triangular noise
//   spanning +-1 level gives the same grain everywhere

float interleavedGradientNoise(vec2 p) {
  // "interleaved gradient noise" (Jorge Jimenez, Call of Duty):
  // a cheap hash of the pixel position, without the clumps of plain random
  // noise, so it looks like an even fine grain
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

float sineHash(vec2 p) {
  // the classic one-liner hash, a second noise independent of the first.
  // (interleaved gradient noise at a shifted position would not do:
  // it is the same pattern shifted, so the two would not be independent)
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// the offset to add to a color in 0..1, for the pixel at p.
// Pass gl_FragCoord.xy: the pattern is then fixed to the screen
// and doesn't crawl over the surfaces.
// strength is in 8-bit levels: the offset goes from -strength to +strength levels
float dither(vec2 p, float strength) {
  // 2 uniform noises 0..1 summed: 0..2 with a triangle shape (values near 1
  // are the most likely), -1 centers it: -1..1
  float noise = interleavedGradientNoise(p) + sineHash(p) - 1.0;
  // in levels: one level is 1 / 255
  return noise * strength / 255.0;
}
