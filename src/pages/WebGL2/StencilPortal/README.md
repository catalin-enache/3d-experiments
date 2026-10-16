# Stencil Portal

A portal made with the stencil buffer: a plane in a frame that shows another
world through it.
Route: `#/web-gl-2/stencil-portal`

To see what each stencil setting does on its own, open the
[Stencil Playground](../StencilPlayground/README.md) first. This page uses the
same calls to build a real effect.

## The idea

The stencil buffer holds one 8-bit value per pixel, next to the color and the
depth. It is never shown on screen. It is a mask that draws can **test**
against and **write** into.

The portal works in two moves:

1. **Mark** the pixels where the portal plane is visible by writing 1 in the
   stencil there.
2. **Draw the inside world** only where the stencil is 1.

The inside world is ordinary geometry placed **behind** the plane. Nothing about
it is special. Only the stencil test keeps it from showing anywhere else. Turn
**use stencil** off and you'll see all of it.

## The scene

```
side view (the camera is on the right, looking left)

  inside world             portal
  pink cube ■             │      ■ orange cube        camera
       ● green sphere     │                             <
  ○ white sphere          │
  (outside world)       frame
─────────────────────────── floor ───────────────────────────
         -Z  (behind)     0      (in front)  +Z
```

- **Outside world:** the floor, the brown frame, an orange cube **in front of**
  the portal, and a white sphere **behind** it.
- **Portal:** a plane inside the frame, facing the camera (+Z).
- **Inside world:** a bouncing green sphere and a large spinning pink cube,
  both behind the plane. The cube is bigger than the opening, so you can see it
  being cut off at the frame.

The white sphere and the inside world share the same space behind the plane.
The white sphere only shows **around** the portal, and the inside world only
shows **through** it. That's the stencil at work.

## How a frame is drawn

All of it is in `tick` in `StencilPortal.tsx`.

### 0. Clear

```js
gl.clearStencil(0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
```

The stencil is cleared to 0 every frame, like the color and the depth.
Otherwise last frame's portal shape would still be there.

### 1. The outside world

The stencil test is off and everything is drawn as usual. This fills the depth
buffer, which matters for the next step.

### 2. Mark the portal

```js
gl.enable(gl.STENCIL_TEST);
gl.stencilFunc(gl.ALWAYS, 1, 0xff); // always pass, ref = 1
gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE); // write ref only when depth passes too
gl.colorMask(false, false, false, false); // invisible
gl.depthMask(false); // leaves no depth
draw(portal);
```

- `ALWAYS` means the stencil test never rejects the plane. `ref = 1` is the
  value `REPLACE` will write.
- `stencilOp(sfail, dpfail, dppass)`: only `dppass` writes. A pixel gets 1 only
  where the plane **passes the depth test**, meaning where it is actually
  visible. Where the orange cube is in front, the plane fails the depth test
  (`dpfail` = `KEEP`) and the stencil stays 0. That's why the cube still covers
  the portal correctly.
- The color and depth masks are off, so the plane draws nothing visible. It
  only leaves its shape in the stencil.
  - If it wrote **depth**, the inside world (which is behind the plane) would
    fail the depth test against it.

### 3. Open the portal

```js
gl.stencilFunc(gl.EQUAL, 1, 0xff); // only where the portal was marked
gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP); // and don't change the stencil any more

gl.depthFunc(gl.ALWAYS);
gl.depthRange(1, 1);
draw(portal); // unlit, in the dark blue "sky" color
gl.depthRange(0, 1);
gl.depthFunc(gl.LESS);
```

Inside the portal the color and depth buffers still hold what the outside world
left there: the floor, and the white sphere behind the plane. Drawing the plane
again with `EQUAL 1` fixes both, inside the portal only:

- **Color:** it paints the inside world's background (dark blue) over the
  outside world.
- **Depth:** `depthRange(1, 1)` maps every depth the plane produces to 1.0, the
  far end of the depth buffer. `depthFunc(ALWAYS)` makes it pass even where
  something nearer was drawn. Together they **reset the depth to "far"** inside
  the portal.

Without the depth reset, outside geometry behind the plane (the white sphere,
the floor) would still be in the depth buffer and could hide parts of the inside
world through the depth test.

### 4. The inside world

```js
// the stencil test is still EQUAL 1
for (const drawable of insideWorld) draw(drawable);
```

It is drawn with the normal depth test. The depth test sorts the inside objects
among themselves, and the stencil test keeps them inside the portal shape.

With **use stencil** off, steps 2 and 3 are skipped and the stencil test is off.
The inside world is then just more objects in the outside world.

## Setup the stencil needs

- **Ask for a stencil buffer.** The default drawing buffer has none.
  `index.tsx` passes `stencil: true` in the context attributes. Without it the
  stencil test always passes and nothing is stored, so the inside world would
  show everywhere.
- **Enable the test.** `gl.enable(gl.STENCIL_TEST)`. While it is disabled there
  is no test and no writes.
- **Reset state you changed.** `colorMask`, `depthMask`, `depthFunc` and
  `depthRange` are global. Step 2 and step 3 put them back when they finish,
  otherwise the next frame would start broken.

## Controls

- **use stencil:** off shows the inside world as regular geometry behind the
  plane.
- **animate camera:** swings the camera left and right in front of the portal.
- **camera angle:** moves the camera around the portal by hand. It's disabled
  while **animate camera** is on. When the animation stops, the slider takes
  over from the angle the camera had. The animated angle isn't stored in the
  slider's value: Tweakpane rounds a bound value to its `step` (1°) on every
  `refresh()` and writes it back, which made the camera move in visible 1°
  jumps.
- **camera height:** look at the portal from above or below.

## Things to try

- **Turn the stencil off.** The pink cube sticks out far past the frame, and the
  green sphere sits in the same space as the white sphere. With it on, each one
  stays in its own world.
- **Walk around the portal.** Turn **animate camera** off and drag
  **camera angle** past ±90°. The white sphere in the outside world is plain to
  see from the side, but the inside world is never drawn outside the frame.
- **Go behind it.** At an angle near 180° you're looking at the back of the
  plane. Back faces are culled (`CULL_FACE`), so the plane draws nothing, the
  stencil stays 0 everywhere, and the inside world disappears completely. The
  portal is one-sided.
- **Hide it behind the orange cube.** Move the camera so the orange cube covers
  part of the opening. Those pixels fail the depth test in step 2, never get
  marked, and show the cube instead of the inside world.

### In the code

- **Skip step 3.** Comment out the second `draw(portal, ...)`. Through the
  portal you'll see the outside floor and white sphere where the blue
  background was, mixed with the inside objects. The white sphere can also hide
  parts of the pink cube.
- **Write color in step 2.** Set `colorMask(true, ...)`. Nothing changes,
  because step 3 paints over the same pixels. It's off to show that the marking
  pass alone is invisible.
- **Write depth in step 2** and remove step 3. Now the plane's depth sits in
  front of the inside world and hides all of it. That's why the depth has to
  stay untouched in step 2 and be reset to far in step 3.
- **Change `REPLACE` to `INCR`** in step 2. Same result here, because the plane
  only covers each pixel once. It starts to matter with several portals (see
  below).
- **Use `NOTEQUAL 1` in step 4.** The inside world shows everywhere **except**
  through the portal: the opposite mask.

## Going further

- **Several portals:** mark each with its own `ref` (1, 2, 3...) and draw each
  world with `EQUAL` and that ref.
- **Portal inside a portal:** while drawing a world, mark its portals with
  `INCR` where the stencil already equals the current depth. Each level of
  nesting then has its own stencil value, up to 255.
- **Real portals:** this demo shows a fixed world behind the plane. A game
  portal draws the other side from a **virtual camera**: the main camera moved
  through the portal's transform. It also uses an oblique near plane clipped to
  the portal, so things between the virtual camera and the exit portal don't
  get in the way.
- **Mirrors** use the same mask. The world is drawn mirrored across the mirror
  plane (flip the winding, or switch `cullFace`), and only where the mirror was
  marked.

## Files

The stencil logic is all in `StencilPortal.tsx`. The other files hold the
setup around it.

- `StencilPortal.tsx`: the program and uniforms, `draw`, the camera, and the
  four stencil steps in `tick`
- `scene.ts`: the layout: the outside world, the inside world and the portal
- `meshes.ts`: one VAO each for the cube, the sphere and the plane
- `pane.ts`: the Tweakpane controls
- `glsl/vertex.glsl`, `glsl/fragment.glsl`: a directional light with some
  ambient, and an unlit mode for the portal's background
- `index.tsx`: the page, with the context attributes (`stencil: true`)
