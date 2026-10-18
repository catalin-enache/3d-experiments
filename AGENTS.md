# Application Description

This application is an environment
for experimenting and learning various
2d & 3d graphics principles and Math topics.


## Areas of interest in general
 - 2D and 3D graphics
 - Math and Physics simulations


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

Lives in `src` folder.
`public` folder contains the static assets (textures, models)
for the web application.

`src/pages` contains the main pages of the web application
each page being an experiment in itself.

Pages can be nested in subfolders to organize them by topic.
A page is a React component that wraps an experiment.

R3F (React Three Fiber) experiments are wrapped in a `components/Page` component.
Any other experiment (non R3F) is wrapped in a `components/NativePage` component.

The routing is defined in `src/routes.ts`
and the menu is built from them in `src/components/Menu`.

## Python area

Lives in the `python` folder and contains various Python scripts
that use PyGame and PyOpenGL to render 3D graphics.



## Coding Rules

### Web area
- Always TypeScript
- A page is defined in index.tsx file in inside its experiment folder in `src/pages`
- A page is default exported from the index.tsx file and is named after its folder name suffixing it with `Page`.