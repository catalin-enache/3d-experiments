# Stencil Playground

An interactive page to see what `stencilFunc`, `stencilOp` and `stencilMask` do.

## What the stencil buffer is

Next to the color and the depth, every pixel can also have a **stencil value**:
an 8-bit integer (0..255). It is never shown on screen. It is a mask that
draw calls can **test** against and **write** into.

A drawing buffer has no stencil buffer unless you ask for one when you create
the context:

```js
canvas.getContext("webgl2", { stencil: true });
```

And the test only runs while it is enabled:

```js
gl.enable(gl.STENCIL_TEST);
```

## The three calls

### `gl.stencilFunc(func, ref, mask)`: the test

A fragment passes when

```
(ref & mask)  func  (stencil & mask)
```

- **ref is on the left.** `LESS` means `ref < stencil`, not `stencil < ref`.
  This trips almost everyone up.
- `mask` is ANDed with both sides before they are compared, so it selects which
  bits take part in the test. `mask = 1` only looks at bit 0 (odd or even).
- `ref` is clamped to 0..255.
- A fragment that fails the stencil test is **not drawn**: no color and no depth.

| func       | passes when                    |
| ---------- | ------------------------------ |
| `NEVER`    | never                          |
| `LESS`     | `ref & mask <  stencil & mask` |
| `LEQUAL`   | `ref & mask <= stencil & mask` |
| `GREATER`  | `ref & mask >  stencil & mask` |
| `GEQUAL`   | `ref & mask >= stencil & mask` |
| `EQUAL`    | `ref & mask == stencil & mask` |
| `NOTEQUAL` | `ref & mask != stencil & mask` |
| `ALWAYS`   | always                         |

### `gl.stencilOp(sfail, dpfail, dppass)`: what to write in the stencil buffer

Every fragment ends up in exactly one of three cases, and each case has its own
operation:

| argument | when it is used                                |
| -------- | ---------------------------------------------- |
| `sfail`  | the stencil test failed                        |
| `dpfail` | the stencil test passed, the depth test failed |
| `dppass` | both passed (the fragment is drawn)            |

| op          | new stencil value                    |
| ----------- | ------------------------------------ |
| `KEEP`      | unchanged                            |
| `ZERO`      | 0                                    |
| `REPLACE`   | `ref`                                |
| `INCR`      | +1, stays at 255                     |
| `INCR_WRAP` | +1, 255 becomes 0                    |
| `DECR`      | -1, stays at 0                       |
| `DECR_WRAP` | -1, 0 becomes 255                    |
| `INVERT`    | all bits flipped (`~value`, 0 ↔ 255) |

### `gl.stencilMask(mask)`: which bits can be written

Only the bits that are 1 in the mask change. The others keep their old value:

```
stencil = (old & ~mask) | (new & mask)
```

`stencilMask` is the stencil version of `colorMask` and `depthMask`.
Don't confuse it with the `mask` of `stencilFunc`. That one picks the bits that
are **compared**, this one picks the bits that are **written**.

### Front and back faces

`stencilFuncSeparate`, `stencilOpSeparate` and `stencilMaskSeparate` take a first
argument (`FRONT`, `BACK` or `FRONT_AND_BACK`) and set the state for front-facing
and back-facing triangles separately. The plain versions set both. This is the
basis of stencil shadow volumes: front faces `INCR_WRAP`, back faces `DECR_WRAP`.

## Where the stencil test happens

For every fragment the shader outputs, roughly in this order:

```
fragment shader → scissor test → stencil test → depth test → blending → write
                                   │               │
                                   │ fail: sfail    │ fail: dpfail
                                   │               │ pass: dppass
```

So:

- The stencil test runs **before** the depth test. If it fails, the depth test
  never runs.
- A fragment the shader throws away with `discard` never reaches the stencil,
  so no op is applied to it. That is how you stencil the shape of a texture
  (alpha test + `discard`).
- With the depth test **disabled**, every fragment counts as passing it:
  `dpfail` never happens and `dppass` is used.
- `depthMask(false)` stops depth **writes** but the depth **test** still runs,
  so `dpfail` can still happen. The playground relies on this: the shapes don't
  write depth, but the blocker still hides them.
- `colorMask(false, ...)` doesn't stop the stencil from being written. A pass
  that only writes the stencil is the usual first step of a stencil effect.

## What the page shows

- **Left half: color buffer**, the scene as it would normally look.
- **Right half: stencil buffer**, the same scene with every stencil value
  painted in its own color:
  - 0 almost black, 1..15 distinct colors
  - 16..247 grays as bright as the value
  - 248..254 light colors (254 is a light version of 1, 253 of 2, ...) so the
    values `DECR_WRAP` gives can be told apart
  - 255 white
- **at cursor**: the stencil value under the mouse, in decimal and binary.
  Over the left half it reads the same spot on the right.
- Thin **outlines** on the right show where the circles, the rectangle and the
  blocker are, even where a pass didn't draw them.

### The scene

1. **Clear** with `clearStencil` (0 by default).
2. **Depth blocker** (optional): a gray vertical bar in front of everything.
   It writes color and depth only, the stencil test is off while it is drawn.
   It exists to make the depth test fail, so `dpfail` can be seen.
3. **Pass 1: three circles**, one draw call each. Where they overlap, a pixel
   goes through the stencil test and op **once per circle**, and each circle is
   tested against what the previous circles left.
4. **Pass 2: a rectangle**, tested against what pass 1 left in the stencil.

Each pass has its own `stencilFunc`, `stencilOp` and `stencilMask`, plus:

- **color write**: turn it off to make a pass that only writes the stencil
- **depth test**: turn it off and `dpfail` never happens for that pass
- **passes if**: the real comparison with the current values, in binary

### The depth blocker

The blocker (the gray bar, "blocker" in the Scene tab) exists only to **make
the depth test fail**, so `dpfail` can be seen.

Without it `dpfail` never happens. The circles and the rectangle are all drawn
at the same depth (`u_depth = 0`) and don't write depth (`depthMask(false)` in
`applyPass`), while the depth buffer is cleared to 1 (the far plane). So every
fragment of every shape passes the depth test.

`drawScene` draws the blocker first, right after the clear:

```js
gl.disable(gl.STENCIL_TEST); // doesn't test or write the stencil
gl.disable(gl.BLEND);
gl.enable(gl.DEPTH_TEST);
drawRect(blocker, blockerColor, false, -0.5); // closer than the shapes
```

- It writes **color**: the opaque gray bar.
- It writes **depth**: its strip of the depth buffer holds a closer depth than
  the shapes (clip z -0.5 is window depth 0.25, the shapes' z 0 is 0.5).
- It doesn't touch the **stencil**, because the stencil test is off while it is
  drawn. Anything that shows up in that strip on the right was written by the
  passes.

Where a shape is behind the bar, the default depth test (`LESS`) fails:

- the shape is not drawn there, the bar hides it on the left
- if the stencil test passed, `stencilOp` uses **`dpfail`** for those pixels,
  not `dppass`

So with the blocker on, a pass splits its pixels into three groups: `sfail`
(the stencil test failed), `dpfail` (behind the bar) and `dppass` (visible).
Turning off **depth test** for a pass makes the bar irrelevant to it: those
pixels go back to `dppass` and the shape is drawn over the bar.

The X-ray preset uses this. Pass 1 has dpfail `REPLACE` ref 1, so only the
parts of the circles **behind** the bar are marked. Pass 2 has its depth test
off, so the rectangle is drawn over the bar, but only on the marked pixels.
To try it yourself: turn the blocker on and set pass 1 dpfail to `INCR`. The
strip counts the overlaps as in "Count overlaps", but only behind the bar.

The same mechanism draws characters hidden behind walls as silhouettes in
games, and it is the basis of depth-fail ("Carmack's reverse") shadow volumes.

### Reading the two halves

The left shows the result of the stencil **test** (what was drawn), the right
shows the result of the stencil **ops** (what was stored).

**Left: which fragments passed the test?**

- Pass 1: a circle shows up only where it passed its `stencilFunc`. With
  `ALWAYS` all three are drawn. In "No overdraw" the later circles are missing
  where an earlier one already marked the stencil.
- Pass 2: the yellow rectangle never shows up whole. Only the pixels that
  passed its test turn yellow, so the yellow areas are a picture of where
  `ref func stencil` is true.
- With color write off, a pass disappears here even though it still changes
  the stencil.

**Right: what did the ops write, and which bits did the write mask keep?**

- The colored regions are the values `stencilOp` wrote. In "Count overlaps"
  they are the regions of 1, 2 and 3. Hover to read the exact value and its
  bits.
- The outlines tell which shape wrote which value. No change inside a shape's
  outline means its op was `KEEP` (or it failed with `sfail` `KEEP`).
- A pass can write without drawing: with `NEVER` and sfail `INCR` the left is
  empty but the right still counts the overlaps. In "X-ray" only the strip
  hidden by the blocker gets a value.
- Write mask effects show up here: 255 stored as 15, or `INVERT` only toggling
  between 0 and 1.

**Together:** pass 2 is tested against what pass 1 left. To see why the yellow
is where it is on the left, look at the values on the right and apply the
pass 2 rule ("passes if" in the pane). In "Count overlaps" the yellow sits
exactly on the regions that read 2.

The right shows the stencil after **both** passes. If pass 2 has an op other
than `KEEP`, the values there are no longer the ones pass 2 was tested
against. All the presets keep pass 2 at `KEEP`.

### How the stencil view is painted

WebGL 2 can't read the stencil buffer (no `readPixels` of it, no sampling it in
a shader). So the right half draws the scene again and then draws a full-screen
quad **256 times**, once per value, with:

```js
gl.stencilMask(0); // test only, never write
gl.stencilFunc(gl.EQUAL, value, 0xff);
```

Every pixel is painted only by the quad of its own value. This is a handy
debugging trick in any stencil project.

Every color in the palette is different, so the value under the cursor is found
by reading the color with `readPixels` and looking it up. Antialiasing is turned
off for this page so every pixel has exactly one stencil value. With MSAA,
edges would mix samples with different values.

## Presets

In every preset pass 2 draws the same big yellow rectangle, which covers
almost all the circles. It only shows up on the pixels that pass its stencil
test, so on the left you usually see pieces cut out by the circles, not a
rectangle. The yellow outline on the right shows the whole rectangle.

| Preset             | Setup                                                               | What to look at                                                                                               |
| ------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Count overlaps** | P1 `ALWAYS`, dppass `INCR`. P2 `EQUAL 2`                            | The stencil counts the overlaps (1, 2, 3). Only the 3 lens shapes where exactly 2 circles overlap turn yellow |
| **Mask outside**   | P1 dppass `REPLACE` ref 1. P2 `NOTEQUAL 1`                          | The rectangle is drawn everywhere except inside the circles                                                   |
| **Odd overlaps**   | P1 `INCR`. P2 `EQUAL 1` with func mask 1                            | Only bit 0 is compared: counts 1 and 3 pass, 2 doesn't                                                        |
| **XOR**            | P1 dppass `INVERT`, write mask 1. P2 `EQUAL 1`                      | Each circle flips bit 0: 1 where an odd number of circles overlap                                             |
| **Write mask**     | P1 `REPLACE` ref 255, write mask `00001111`. P2 `EQUAL 15`          | Only the low 4 bits get written: 255 is stored as 15                                                          |
| **Wrap around**    | P1 dppass `DECR_WRAP`. P2 `LESS 253`                                | 0 → 255 → 254 → 253. `LESS 253` means `253 < stencil`: 1 or 2 overlaps                                        |
| **X-ray**          | Blocker on. P1 dpfail `REPLACE` ref 1. P2 `EQUAL 1`, depth test off | Only the parts of the circles **hidden** by the blocker are marked, and the rectangle shows just those        |
| **No overdraw**    | P1 `EQUAL 0`, dppass `INCR`. P2 off                                 | A circle marks its pixels, the next circles fail there: no pixel is drawn twice                               |

## Things to try

- **Ref is on the left.** In "Count overlaps", switch pass 2 to `LESS` with
  ref 1. It draws where `1 < stencil`, i.e. 2 and 3 overlaps, not where the
  stencil is below 1.
- **`INCR` vs `INCR_WRAP`.** Set `clearStencil` to 254 and pass 1 dppass to
  `INCR`: the triple overlap stays at 255. With `INCR_WRAP` it becomes 1
  (254 → 255 → 0 → 1).
- **`DECR` vs `DECR_WRAP`.** With the clear at 0, `DECR` does nothing (it stays
  at 0), `DECR_WRAP` goes down from 255.
- **`INVERT` without a write mask.** Every circle flips all bits: 0 → 255 → 0.
  Then set the write mask to 1 and get the XOR preset.
- **sfail.** Set pass 1 to `NEVER` with sfail `INCR`. Nothing is drawn on the
  left, but the stencil still counts the overlaps on the right: a pass can
  write the stencil without drawing anything.
- **`EQUAL 0` inside pass 1.** In "No overdraw", change dppass back to `KEEP`.
  All three circles pass again, because nobody marks the stencil.
- **Func mask vs write mask.** Set the func mask to `00000010` (2) in pass 2
  with `EQUAL` ref 2. Values 2 and 3 pass (bit 1 set), 1 doesn't.
- **Color write off.** Turn it off for pass 1 of any preset. The circles
  disappear from the left but the stencil on the right is unchanged.
- **dpfail needs a failing depth test.** Set pass 1 dpfail to `REPLACE` with
  the blocker off: nothing changes. Turn the blocker on and the hidden strip
  gets `ref`. Then turn the depth test off for pass 1 and the strip goes back
  to dppass.
- **Clearing.** The clear goes through `stencilMask` too. The code resets it
  with `stencilMask(0xff)` before every `clear`. Without that, a previous
  `stencilMask(1)` would leave the upper bits of the old frame behind.

## Common gotchas

- No stencil buffer: you forgot `stencil: true` in the context attributes.
  The stencil test then always passes and nothing is stored, so every draw shows
  up everywhere.
- Nothing happens: you forgot `gl.enable(gl.STENCIL_TEST)`. While it is
  disabled there is no test **and no writes**, `stencilOp` is ignored.
- State leaks: `stencilFunc`, `stencilOp` and `stencilMask` stay set until you
  change them. Set them before every pass that cares, and reset `stencilMask`
  before clearing.
- `gl.clear` respects the scissor too. The playground uses scissor + viewport
  to clear and draw each half on its own.
- Only 8 bits: counting with `INCR` stops at 255. Use `INCR_WRAP` / `DECR_WRAP`
  when the count goes up and down (shadow volumes) so the result still comes
  out right modulo 256.

## Where it is used

- **Portals / mirrors / windows**: mark the opening, draw the other world only
  inside it (see the Stencil Portal example).
- **Outlines**: draw the object writing 1, draw a slightly bigger copy where the
  stencil is not 1.
- **Shadow volumes**: count how many volume faces are in front of each pixel.
- **Decals and UI clipping**: limit drawing to an arbitrary shape.
- **Constructive solid geometry** (showing unions and differences) with
  counting and parity, like the XOR preset.

## Files

The stencil logic is all in `StencilPlayground.tsx`. The other files hold the
surrounding setup.

- `StencilPlayground.tsx`: the scene, the passes (`applyPass`, `drawScene`),
  the stencil view (`drawStencilView`) and reading back the value under the cursor
- `settings.ts`: the stencil state of a pass (`PassSettings`), the enums the
  dropdowns pick from (`funcs`, `ops`), the defaults and the "passes if" text
- `presets.ts`: the presets and `applyPreset`
- `palette.ts`: the color of every stencil value and the reverse lookup
  (`stencilValueOf`)
- `shapes.ts`: the buffer with the quad and the circle
- `pane.ts`: the Tweakpane controls
- `overlay.ts`: the HTML labels and the legend over the canvas
- `glsl/vertex.glsl`, `glsl/fragment.glsl`: a flat-color 2D shader
- `index.tsx`: the page, with the context attributes (`stencil`, `antialias`, `alpha`)
