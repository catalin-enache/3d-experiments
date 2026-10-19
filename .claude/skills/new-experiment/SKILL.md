---
name: new-experiment
description: Scaffold a new experiment page in src/pages (folder, <Name>.tsx, index.tsx, glsl shaders, route in src/routes.ts) following the AGENTS.md rules. Use when the user asks to create / start / add a new experiment, page, demo or tutorial in the web area.
---

# New experiment

Creates a new experiment following the rules in `AGENTS.md` (Coding Rules → Web area). Read those rules first; this skill only adds the concrete steps and templates.

## 1. Settle the inputs

Get these from the request; **ask** for any that is missing (one question, all items together):

- **Name**: PascalCase folder name, e.g. `NormalMapping`. All other names derive from it.
- **Topic folder** (optional): an existing group (`Math`, `ThreeJs`, `WebGL2`, `Shaders`) or a new one, or top level.
- **Kind**:
  - `r3f` – React Three Fiber, wrapped in `Page`.
  - `native-three` – plain Three.js via `SceneInit` (`@lib/nativeThreeJs/SceneInit`), wrapped in `NativePage`.
  - `webgl2` – raw WebGL2 via `@lib/utils/webgl`, wrapped in `NativePage`.
- **Renderer** (r3f / native-three): WebGL or WebGPU (`rendererParams: { useWebGpu: true }`).
- **GUI**: Tweakpane or lil-gui (never pick one yourself, see AGENTS.md).
- **Concept**: what the experiment demonstrates (used for the header comment).

Check `src/pages/<Topic>/<Name>` does not exist yet.

## 2. Derive the names

For `<Name>` (e.g. `NormalMapping`):

| what | value |
|---|---|
| folder | `src/pages[/<Topic>]/<Name>/` |
| experiment file / export | `<Name>.tsx` / `export function <Name>` (named export only) |
| page | `index.tsx` / `export default function <Name>Page` |
| route segment | kebab-case, acronyms and numbers are words: `normal-mapping`, `Projection3D` → `projection-3d` |
| route name | words with spaces: `Normal Mapping` |

## 3. Create the files

Look at a sibling experiment of the same kind before writing, and match it:

- `r3f`: `src/pages/Shaders/Flag/` (`Page` + `Scenario`, shaders in `glsl/`).
- `native-three`: `src/pages/Home/` (`SceneInit`, `NativePage` with `rendererParams`).
- `webgl2`: `src/pages/WebGL2/Basic/` (`init`, `createProgram`, `loop`; `#version 300 es` shaders in `glsl/`).
  Use `@lib/webgl2fundamentals` (`m3`/`m4`) for math, `@lib/geometries` for vertex data.

### `index.tsx`

```tsx
// r3f
import { Page } from "@components";
import { <Name> } from "./<Name>";

export default function <Name>Page() {
  return (
    <Page /* cameraProps, rendererParams, gridConfig... as needed */>
      <<Name> />
    </Page>
  );
}
```

```tsx
// native-three / webgl2
import { NativePage } from "@components";
import { <Name> } from "./<Name>";

export default function <Name>Page() {
  return (
    <NativePage
      nativeScenario={<Name>}
      options={{
        // native-three: rendererParams, axesSize, gridConfig
        // webgl2:       webglContextAttributes (add `stencil: true` if the stencil buffer is used)
      }}
    />
  );
}
```

### `<Name>.tsx`

Starts with a comment explaining the concept and how the experiment shows it (see `src/pages/WebGL2/StencilPortal/StencilPortal.tsx`). Keep the explanatory comments through the code, especially for math and GL state.

Native experiments (`native-three`, `webgl2`):
- signature `export function <Name>(params: ScenarioParams)` (or `async` when it awaits, e.g. `createProgram`),
- everything is created inside `params.container`,
- the returned cleanup destroys the GUI, listeners, GL objects and stops the loop (StrictMode mounts twice).

R3F: in JSX use `<threeLine>` / `<threePath>` instead of `<line>` / `<path>` (see `src/threeExtensions.ts`).

Shaders: `glsl/vertex.glsl` and `glsl/fragment.glsl`, imported as strings. Shared chunks via `#include /src/glsl/<file>`, lygia via `#include /node_modules/lygia/<path>`.

## 4. Register the route

Add to `src/routes.ts`, inside the topic group when there is one (create the group node if the topic is new):

```ts
{
  segment: "<kebab-name>",
  name: "<Spaced Name>",
  component: lazy(() => import("@pages/[<Topic>/]<Name>"))
}
```

## 5. Verify

1. `npx tsc -b` and `npm run lint` pass (Prettier runs automatically on edited files through the project hook).
2. Ask the user whether to run the smoke test for the new page (see `AGENTS.md` → Agent Behavior); if yes, run it and look at the screenshot:
   `npm run smoke -- -g "<Spaced Name>"` → `screenshots/<route path, "/" as "__">.png`
   (e.g. `screenshots/web-gl-2__basic.png`). Read the image to check the render.
   If the page uses WebGPU and the canvas stays blank, retry with `HEADED=1`.
3. Report what was created, the route URL (`/#/<path>`), and the smoke test result if it was run.
