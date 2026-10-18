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

- `src` folder contains entire web area.

- `public` folder (related to web area) contains the static assets (textures, models) for the web application.
   
   They are to be loaded by fetching them at runtime.

- `src/pages` contains the main pages of the web application
   each page (folder or subfolder) being an experiment in itself.

   Pages can be nested in subfolders to organize them by topic (WebGL2, Shaders, etc.).
   
   The nesting is reflected in Menu as well.

   A page is a React component that wraps an experiment.

- `src/routes` defines the routing of the web application.

- `src/components/Menu` defines the menu of the web application (built from routes).

- `src/appTypes` defines cross/general types.

- `src/components` folder contains the React components used in the application.

- `src/glsl` folder contains shared GLSL shaders library that can be reused throughout experiments.
  
  `lygia` library can be used as well when appropriate for shaders reusable functions.

- `src/hooks` folder contains shared React hooks.

- `src/lib` folder contains shared utility functions.

- `src/lib/webgl2fundamentals` folder contains math functions imported from [WebGL2Fundamentals](https://webgl2fundamentals.org/) tutorial website.
  
  These functions are mostly used in WebGL2 experiments, but they are not to be used exclusively.
  
  `three.js` and `babylon.js` have their own math libraries that can be used instead of these functions when appropriate,
  especially when using these libraries.
  
  The WebGL2Fundamentals functions are to be used in WebGL2 experiments only.

- `src/lib/geometries` folder defines reusable geometries as TS objects.
  It is complementary to `public/models` folder that contains static assets (models) for the web application.

- `src/native/classes` defines classes to be used with (native) ThreeJS non R3F experiments.

## Python area

Lives in the `python` folder and contains various Python scripts
that use PyGame and PyOpenGL to render 3D graphics.



# Coding Rules

## Web area
- Always TypeScript
- A page is defined in index.tsx file in inside its experiment folder in `src/pages`
- A page is default exported from the index.tsx file and is named after its folder name suffixed it with `Page`.
- The experiment is a sibling of index.tsx and is used inside the page component.
- R3F (React Three Fiber) experiments are wrapped in a `components/Page` component.

  Any other experiment (non R3F) is wrapped in a `components/NativePage` component.

