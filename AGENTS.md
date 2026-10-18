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

Commands:
- `npm run dev` - start the dev server (Vite runs TypeScript & ESLint checks via `vite-plugin-checker`).
- `npm run build` - type check (`tsc -b`) and build.
- `npm run lint` - ESLint.

The app is served under the `/3d-experiments/` base path (GitHub Pages).

### Folders

- `src` contains the entire web area.

- `public` contains static assets (`textures`, `models`) loaded at runtime (fetched / loaded by URL),
  never imported. Reference them with a relative path, e.g. `"textures/pbr/..."`.

- `src/pages` contains the pages of the application, each page folder being an experiment in itself.

  Pages can be nested in subfolders to organize them by topic (`WebGL2`, `Shaders`, etc.).
  The nesting is reflected in `src/routes.ts` and therefore in the Menu.

  A page is a React component that wraps an experiment.

- `src/routes.ts` defines the routing as a tree mirroring `src/pages`.
  Routes are **not** auto-discovered: every new page must be registered here
  (`segment`, `name`, `component: lazy(() => import("@pages/..."))`), inside its group node when nested.

- `src/components/Menu` renders the menu from `src/routes.ts`.

- `src/components` contains shared React components, re-exported from `src/components/index.ts`.

- `src/hooks` contains shared React hooks, re-exported from `src/hooks/index.ts`.

- `src/appTypes` defines cross/general types (e.g. `ScenarioParams`, `RendererParams`).

- `src/glsl` contains a shared GLSL library reusable throughout experiments.

  Shaders are imported as strings via `vite-plugin-glsl` and can include shared chunks
  with absolute paths: `#include /src/glsl/noise`.

  `lygia` can be used as well for reusable shader functions: `#include /node_modules/lygia/generative/voronoi`.

- `src/lib` contains shared utilities:
  - `src/lib/utils` - general helpers (`webgl.ts` holds the WebGL2 boilerplate: `init`, `createProgram`, `loop`, ...).
  - `src/lib/math` - math helpers (intersections, lerp, quaternions, ...).
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
  - experiment component / function: `<Name>` (imported in `index.tsx` under the same name, no alias)
  - page component: `<Name>Page`

  e.g. `src/pages/Shaders/Flag/` -> `Flag.tsx` exporting `Flag`, and `index.tsx` default exporting `FlagPage`.
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
