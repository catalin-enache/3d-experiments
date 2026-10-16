import { defaultPass, type Params } from "./settings";

const GL = WebGL2RenderingContext;

// each preset starts from the defaults and changes a few things
export const presets: {
  title: string;
  apply: (params: Params) => void;
}[] = [
  {
    // every circle adds 1 where it is drawn: the stencil counts the overlaps.
    // Pass 2 is drawn only where exactly 2 circles overlap
    title: "Count overlaps (INCR)",
    apply: ({ pass1, pass2 }) => {
      Object.assign(pass1, { dppass: GL.INCR });
      Object.assign(pass2, { func: GL.EQUAL, ref: 2 });
    }
  },
  {
    // the circles stamp 1, pass 2 is drawn everywhere else
    title: "Mask outside (REPLACE + NOTEQUAL)",
    apply: ({ pass1, pass2 }) => {
      Object.assign(pass1, { ref: 1, dppass: GL.REPLACE });
      Object.assign(pass2, { func: GL.NOTEQUAL, ref: 1 });
    }
  },
  {
    // the func mask only looks at bit 0: odd counts (1 and 3) pass
    title: "Odd overlaps (func mask)",
    apply: ({ pass1, pass2 }) => {
      Object.assign(pass1, { dppass: GL.INCR });
      Object.assign(pass2, { func: GL.EQUAL, ref: 1, funcMask: 1 });
    }
  },
  {
    // INVERT flips all bits every time a circle is drawn: 0 -> 255 -> 0 ...
    // Only bit 0 is writable so it toggles between 0 and 1: XOR of the circles
    title: "XOR (INVERT + write mask)",
    apply: ({ pass1, pass2 }) => {
      Object.assign(pass1, { dppass: GL.INVERT, writeMask: 1 });
      Object.assign(pass2, { func: GL.EQUAL, ref: 1 });
    }
  },
  {
    // REPLACE writes ref, but the write mask only lets the low 4 bits through:
    // 255 & 0b00001111 = 15
    title: "Write mask (REPLACE 255 -> 15)",
    apply: ({ pass1, pass2 }) => {
      Object.assign(pass1, {
        ref: 255,
        dppass: GL.REPLACE,
        writeMask: 0b00001111
      });
      Object.assign(pass2, { func: GL.EQUAL, ref: 15 });
    }
  },
  {
    // 0 - 1 wraps to 255, then 254, 253. Remember ref is on the left:
    // LESS with ref 253 means 253 < stencil, so 1 or 2 overlaps pass
    title: "Wrap around (DECR_WRAP + LESS)",
    apply: ({ pass1, pass2 }) => {
      Object.assign(pass1, { dppass: GL.DECR_WRAP });
      Object.assign(pass2, { func: GL.LESS, ref: 253 });
    }
  },
  {
    // where the circles are hidden by the blocker the depth test fails:
    // dpfail marks them with 1. Pass 2 ignores the depth and is drawn
    // only there, like an x-ray view of what is hidden
    title: "X-ray (depth fail)",
    apply: (params) => {
      params.blocker = true;
      Object.assign(params.pass1, { ref: 1, dpfail: GL.REPLACE });
      Object.assign(params.pass2, {
        func: GL.EQUAL,
        ref: 1,
        depthTest: false
      });
    }
  },
  {
    // the circles are drawn only where the stencil is 0.
    // A circle stamps 1 where it is drawn, so the next circles fail there:
    // the first circle drawn covers the others, nothing is drawn twice
    title: "No overdraw (EQUAL 0 + INCR)",
    apply: ({ pass1, pass2 }) => {
      Object.assign(pass1, { func: GL.EQUAL, ref: 0, dppass: GL.INCR });
      pass2.enabled = false;
    }
  }
];

// resets everything to the defaults, then applies the preset
export function applyPreset(params: Params, index: number) {
  params.clearStencil = 0;
  params.blocker = false;
  Object.assign(params.pass1, defaultPass());
  Object.assign(params.pass2, defaultPass());
  presets[index].apply(params);
}
