// The stencil state of a pass, the values the pane can pick from
// and the defaults every preset starts from.
// The GL enums are constants, so they are read from WebGL2RenderingContext
// itself, no context is needed
const GL = WebGL2RenderingContext;

// the stencilFunc comparisons
export const funcs = {
  NEVER: GL.NEVER,
  LESS: GL.LESS,
  LEQUAL: GL.LEQUAL,
  GREATER: GL.GREATER,
  GEQUAL: GL.GEQUAL,
  EQUAL: GL.EQUAL,
  NOTEQUAL: GL.NOTEQUAL,
  ALWAYS: GL.ALWAYS
};

const funcSymbols: Record<number, string> = {
  [GL.NEVER]: "never",
  [GL.LESS]: "<",
  [GL.LEQUAL]: "<=",
  [GL.GREATER]: ">",
  [GL.GEQUAL]: ">=",
  [GL.EQUAL]: "==",
  [GL.NOTEQUAL]: "!=",
  [GL.ALWAYS]: "always"
};

// the stencilOp operations
export const ops = {
  KEEP: GL.KEEP,
  ZERO: GL.ZERO,
  REPLACE: GL.REPLACE,
  INCR: GL.INCR,
  INCR_WRAP: GL.INCR_WRAP,
  DECR: GL.DECR,
  DECR_WRAP: GL.DECR_WRAP,
  INVERT: GL.INVERT
};

export interface PassSettings {
  enabled: boolean;
  // write the color (colorMask), off = the pass only changes the stencil
  colorWrite: boolean;
  depthTest: boolean;
  // stencilFunc(func, ref, funcMask)
  func: number;
  ref: number;
  funcMask: number;
  // stencilMask(writeMask)
  writeMask: number;
  // stencilOp(sfail, dpfail, dppass)
  sfail: number;
  dpfail: number;
  dppass: number;
}

export type View = "split" | "color" | "stencil";

export interface Params {
  view: View;
  // index in presets
  preset: number;
  clearStencil: number;
  blocker: boolean;
  outlines: boolean;
  pass1: PassSettings;
  pass2: PassSettings;
}

// the GL defaults: the test always passes and nothing is written
export const defaultPass = (): PassSettings => ({
  enabled: true,
  colorWrite: true,
  depthTest: true,
  func: GL.ALWAYS,
  ref: 1,
  funcMask: 0xff,
  writeMask: 0xff,
  sfail: GL.KEEP,
  dpfail: GL.KEEP,
  dppass: GL.KEEP
});

export const bin = (value: number) => value.toString(2).padStart(8, "0");

// the actual comparison stencilFunc does, with the current values
export function passDescription(pass: PassSettings) {
  const symbol = funcSymbols[pass.func];
  if (pass.func === GL.NEVER || pass.func === GL.ALWAYS) {
    return symbol;
  }
  return `${bin(pass.ref & pass.funcMask)} ${symbol}\nstencil & ${bin(pass.funcMask)}`;
}
