# Application Description

This application is an environment
for experimenting and learning various
2d & 3d graphics principles and Math topics (mostly graphics related).


## Areas of interest in general
 - 2D and 3D graphics
 - Math (mostly graphics related)
 - Physics simulations (planned)


## Areas of interest in particular
 - Linear Algebra
 - WebGL2
 - WebGpu
 - OpenGL (with Python)
 - Shaders
 - Three.js 
 - Babylon.js (planned)


# Structure

## Web area

Stack: React 19 + TypeScript, Vite, React Router, Three.js (WebGL & WebGPU renderers),
React Three Fiber (R3F) + drei, raw WebGL2, Tweakpane / lil-gui for controls.
`wesl` (WGSL with imports, via `wesl-plugin` in `vite.config.ts`) is set up for WebGPU experiments:
use it for WGSL shaders when an experiment needs them; nothing uses it yet.

Commands:
- `npm run dev` - start the dev server (Vite runs TypeScript & ESLint checks via `vite-plugin-checker`).
- `npm run build` - type check (`tsc -b`) and build.
- `npm run lint` - ESLint.
- `npm run smoke` - Playwright smoke test (`tests/smoke.spec.ts`): opens every route in Chrome, fails on console/page errors
  and saves a screenshot per page in `screenshots/`. One page: `npm run smoke -- -g "<Route Name>"`; `HEADED=1` to watch it (needed for WebGPU if headless fails).

The app is served under the `/3d-experiments/` base path (GitHub Pages).

### Folders

- `src` contains the entire web area.

- `public` contains static assets (`textures`, `models`) loaded at runtime (fetched / loaded by URL).
  Reference them with a relative path, e.g. `"textures/pbr/..."`.

  Assets (images, textures, models, data files) **always** live in `public` and are loaded at runtime
  (`fetch`, `TextureLoader`, `useTexture`, `GLTFLoader`...). Never import them in code
  (`import url from "./x.png"`, `?url`, `?raw`, `new URL(..., import.meta.url)`) and never put them in `src`.
  Shaders are not assets: they live in the experiment's `glsl` folder and are imported.

- `src/pages` contains the pages of the application, each page folder being an experiment in itself.

  Pages can be nested in subfolders to organize them by topic (`Math`, `ThreeJs`, `WebGL2`, `Shaders`, etc.).
  The nesting is reflected in `src/routes.ts` and therefore in the Menu.

  A page is a React component that wraps an experiment.

- `src/routes.ts` defines the routing as a tree mirroring `src/pages`.
  Routes are **not** auto-discovered: every new page must be registered here
  (`segment`, `name`, `component: lazy(() => import("@pages/..."))`), inside its group node when nested.

- `src/components/Menu` renders the menu from `src/routes.ts`.

- `src/components` contains shared React components, re-exported from `src/components/index.ts`.

- `src/hooks` contains shared React hooks, re-exported from `src/hooks/index.ts`.

- `src/appTypes` defines cross/general types (e.g. `ScenarioParams`, `RendererParams`).

- `src/threeExtensions.ts` (imported once in `main.tsx`) registers some Three.js classes in R3F under
  prefixed names, because their default JSX tags clash with DOM element types.
  In R3F use `<threeLine>`, `<threePath>`, `<threeAudio>`, `<threeSource>` instead of `<line>`, `<path>`, `<audio>`, `<source>`.

- `src/sharedClasses.css` holds global CSS classes (loaded through `src/index.css`).
  Component / page specific styles go in a `*.module.css` next to the component.

- `src/glsl` contains a shared GLSL library reusable throughout experiments.

  Shaders are imported as strings via `vite-plugin-glsl` and can include shared chunks
  with absolute paths: `#include /src/glsl/noise`.

  `lygia` can be used as well for reusable shader functions: `#include /node_modules/lygia/generative/voronoi`.

- `src/lib` contains shared utilities:
  - `src/lib/utils` - general helpers (`webgl.ts` holds the WebGL2 boilerplate: `init`, `createProgram`, `loop`, ...).
  - `src/lib/math` - math helpers (intersections, lerp, quaternions, ...).
  - `src/lib/constants.ts` - shared constants (e.g. `EPSILON` for float comparisons).
  - `src/lib/geometries` - reusable geometries as TS objects (vertex data),
    complementary to the `public/models` static models.
  - `src/lib/webgl2fundamentals` - math functions (`m3`, `m4`, `matrixStack`) taken from
    [WebGL2Fundamentals](https://webgl2fundamentals.org/).

    Use them in raw WebGL2 experiments. When working with `three.js` (or `babylon.js`)
    use that library's own math instead.

- `src/native/classes` defines classes used by native (non R3F) Three.js experiments.

### Path aliases (tsconfig)

`@src/*`, `@pages/*`, `@lib/*`, `@native/*`, `@components`, `@hooks`, `@appTypes`.
Prefer them over long relative imports when reaching outside the experiment folder.

## Python area

Lives in the `python` folder and contains various Python scripts
that use PyGame and PyOpenGL to render 3D graphics.



# Coding Rules

## Web area
- Always TypeScript.
- Every experiment lives in its own folder in `src/pages` (optionally nested in a topic folder).
- The page is defined in the `index.tsx` file of that folder.
- The page is default exported from `index.tsx` and is named after its folder name suffixed with `Page`
  (e.g. `src/pages/WebGL2/StencilPortal/index.tsx` -> `StencilPortalPage`).
- The experiment is a sibling of `index.tsx` and is used inside the page component.
- Naming: the folder name is the single source for all names, with no extra prefixes/suffixes
  (e.g. no `Shader`, `Scenario`) other than `Page`. For a folder `<Name>`:
  - experiment file: `<Name>.tsx`
  - experiment component / function: `<Name>`, a **named export only** (no default export),
    imported in `index.tsx` as `import { <Name> } from "./<Name>";` (no alias, no file extension)
  - page component: `<Name>Page`, the only default export of the folder
  - route `segment`: the folder name in kebab-case. Words are split at case changes,
    acronyms and numbers being words of their own
    (`DotAndCrossProduct` -> `dot-and-cross-product`, `PatternsUV` -> `patterns-uv`,
    `Projection3D` -> `projection-3d`, `WebGL2` -> `web-gl-2`)
  - route `name` (shown in the Menu): the same words separated by spaces
    (`Dot And Cross Product`, `Patterns UV`, `Projection 3D`), product names written as usual (`WebGL 2`, `Three.js`)

  e.g. `src/pages/Shaders/Flag/` -> `Flag.tsx` exporting `Flag`, `index.tsx` default exporting `FlagPage`,
  route `{ segment: "flag", name: "Flag" }`. Topic folders (route groups) follow the same segment/name rule.
  The only exception is `Home`, whose segment is `""` (the site root).
- Experiment specific files (shaders in a `glsl` subfolder, meshes, scene, GUI pane, README.md) stay in the same folder.
- R3F (React Three Fiber) experiments are wrapped in a `components/Page` component
  (it owns the `<Canvas>`, camera, renderer - WebGL or WebGPU via `rendererParams` - grid, stats and gizmo).
- Any other experiment (native Three.js, raw WebGL2, WebGPU) is wrapped in a `components/NativePage` component.

  The native experiment is a function `(params: ScenarioParams) => cleanup` (sync or async)
  passed as `nativeScenario`. It must create everything inside `params.container`
  and return a cleanup function that releases all resources (listeners, GUI, GL objects, animation loop),
  since React StrictMode mounts it twice.
- Register every new page in `src/routes.ts`.
- When using Three.js with WebGPU import from `three/webgpu`; for the WebGL renderer import from `three`.
- GUI controls: both Tweakpane and `lil-gui` are fine, neither is preferred.
  The choice is made per experiment when it is started: use the one requested,
  ask if none was specified, and keep using the one an existing experiment already uses.
  In R3F experiments, to inspect/edit a Three.js object there is also
  the `Inspector` component (Tweakpane based, `<Inspector object={...} />`).
- Shared code: keep code inside the experiment folder until a second experiment needs it,
  then move it to `src/lib` (TS utilities, math, geometries), `src/glsl` (shader chunks),
  `src/components` or `src/hooks`, and re-export it from the barrel `index.ts` where there is one.
- This is a learning project: every new experiment starts with a comment explaining the concept
  it demonstrates and how it works (see `StencilPortal.tsx`). Non obvious math and GL state changes are commented.
  Larger experiments may add a `README.md` in their folder.
- Formatting follows `.prettierrc.json` (double quotes, semicolons, no trailing commas, 2 spaces, 80 columns).
- Before finishing a task, run Prettier on the changed files and make sure `npm run lint` and `npx tsc -b` pass.

# Agent Behavior
- Do not add, remove or upgrade dependencies without asking first.
- Do not edit `dist/` (build output) or commit generated files (e.g. Python `__pycache__`).
- Renaming a page folder or route `segment` changes its public URL on GitHub Pages; mention it when doing so.
- **Ask before running the Playwright smoke test** (`npm run smoke`), saying which pages and why.
  The type check and lint already run automatically (Stop hook); the smoke test is an extra, deliberate step.

  When it is worth proposing:

  | Change | Smoke test |
  |---|---|
  | New experiment | That page, and look at its screenshot |
  | Rendering / shader / scene code of one experiment | That page; the screenshot when the visual result matters |
  | Shared code: `Page`, `NativePage`, `SceneInit`, `lib/utils/webgl.ts`, `src/glsl`, `vite.config.ts`, dependency upgrades | Full run; screenshots only for failures or a sample of 2-3 pages |
  | Route / folder renames | Full run (confirms every route still loads) |
  | `AGENTS.md`, docs, config without runtime effect, comments | Not needed |
  | Pure TS refactors already covered by `tsc -b` + lint | Usually not needed |
  | Math helpers | Only if the change affects what is drawn |

  Keep it cheap: read only the pass/fail lines and failure details of the output,
  and open only the screenshots that are needed (each costs ~800 tokens), never all of them.
