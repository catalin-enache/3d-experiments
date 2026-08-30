import { lazy } from "react";

export const routesConfig = {
  home: {
    path: "/",
    name: "Home",
    component: lazy(() => import("@pages/Home"))
  },
  projectLongLatOnSphere: {
    path: "/project-long-lat-on-sphere",
    name: "Project Long Lat On Sphere",
    component: lazy(() => import("@pages/ProjectLongLatOnSphere"))
  },
  heighMapToNormalMap: {
    path: "/heigh-map-to-normal-map",
    name: "Heigh Map To Normal Map",
    component: lazy(() => import("@pages/HeightMapToNormalMap"))
  },
  materialTest: {
    path: "/material-test",
    name: "Material Test",
    component: lazy(() => import("@pages/MaterialTest"))
  },
  dotCrossProduct: {
    path: "/dot-cross-product",
    name: "Dot Cross Product",
    component: lazy(() => import("@pages/DotAndCrossProduct"))
  },
  matrixInverse: {
    path: "/matrix-inverse",
    name: "Matrix Inverse",
    component: lazy(() => import("@pages/MatrixInverse"))
  },
  transformMatrices: {
    path: "/transform-matrices",
    name: "Transform Matrices",
    component: lazy(() => import("@pages/TransformMatrices"))
  },
  shaderShapes: {
    path: "/shaders/shapes",
    name: "Shader Shapes",
    component: lazy(() => import("@pages/Shaders/Shapes"))
  },
  shaderFlag: {
    path: "/shaders/flag",
    name: "Shader Flag",
    component: lazy(() => import("@pages/Shaders/Flag"))
  },
  shaderPatternsUV: {
    path: "/shaders/patterns-uv",
    name: "Shader Patterns UV",
    component: lazy(() => import("@pages/Shaders/PatternsUV"))
  },
  shaderExtendingThreeJsMaterials: {
    path: "/shaders/extending-three-js-materials",
    name: "Shader Extending Three JS Materials",
    component: lazy(() => import("@pages/Shaders/ExtendingThreeJSMaterials"))
  }
};
