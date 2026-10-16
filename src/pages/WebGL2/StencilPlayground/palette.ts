// The colors of the stencil values in the stencil view:
// 0 is almost black, 1..15 are distinct colors,
// 16..247 are grays as bright as the value, 248..254 are light colors
// (the values right below 255 that DECR_WRAP and INVERT give) and 255 is white.
// All different, so a stencil value can be read back from its color

// prettier-ignore
const vividColors = [
  [24, 24, 32],
  [255, 99, 71], [60, 180, 75], [65, 105, 225], [255, 215, 0],
  [186, 85, 211], [0, 206, 209], [255, 140, 0], [255, 105, 180],
  [154, 205, 50], [30, 144, 255], [210, 180, 140], [128, 0, 128],
  [0, 128, 128], [128, 128, 0], [220, 20, 60]
];

// palette[value] is [r, g, b] in 0..255
export const palette: number[][] = [];
const valueByColor = new Map<number, number>();

const key = (r: number, g: number, b: number) => (r << 16) | (g << 8) | b;

for (let value = 0; value < 256; ++value) {
  let rgb = vividColors[value] ?? [value, value, value];
  if (value >= 248 && value < 255) {
    // 254 is a light version of the color of 1, 253 of 2, ...
    rgb = vividColors[255 - value].map((c) => Math.round((c + 255) / 2));
  }
  palette.push(rgb);
  valueByColor.set(key(rgb[0], rgb[1], rgb[2]), value);
}

// the stencil value of a pixel read from the stencil view,
// undefined for colors that aren't in the palette (the outlines)
export function stencilValueOf(pixel: Uint8Array) {
  return valueByColor.get(key(pixel[0], pixel[1], pixel[2]));
}
