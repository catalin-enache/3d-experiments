import { lazy, type ComponentType, type LazyExoticComponent } from "react";

// The tree mirrors the `src/pages` folder structure.
// Each node declares only its own path `segment`; full paths are built from the ancestors.
export interface RoutePageNode {
  segment: string;
  name: string;
  component: LazyExoticComponent<ComponentType>;
}

export interface RouteGroupNode {
  segment: string;
  name: string;
  children: RouteNode[];
}

export type RouteNode = RoutePageNode | RouteGroupNode;

export interface FlatRoute {
  path: string;
  name: string;
  // names of the ancestor groups followed by the route name
  breadcrumbs: string[];
  component: LazyExoticComponent<ComponentType>;
}

export const isRouteGroup = (node: RouteNode): node is RouteGroupNode =>
  "children" in node;

export const joinPath = (parentPath: string, segment: string) =>
  `${parentPath.replace(/\/$/, "")}/${segment}`;

export const routes: RouteNode[] = [
  {
    segment: "",
    name: "Home",
    component: lazy(() => import("@pages/Home"))
  },
  {
    segment: "project-long-lat-on-sphere",
    name: "Project Long Lat On Sphere",
    component: lazy(() => import("@pages/ProjectLongLatOnSphere"))
  },
  {
    segment: "material-test",
    name: "Material Test",
    component: lazy(() => import("@pages/MaterialTest"))
  },
  {
    segment: "dot-and-cross-product",
    name: "Dot And Cross Product",
    component: lazy(() => import("@pages/DotAndCrossProduct"))
  },
  {
    segment: "matrix-inverse",
    name: "Matrix Inverse",
    component: lazy(() => import("@pages/MatrixInverse"))
  },
  {
    segment: "transform-matrices",
    name: "Transform Matrices",
    component: lazy(() => import("@pages/TransformMatrices"))
  },
  {
    segment: "line-intersections",
    name: "Line Intersections",
    component: lazy(() => import("@pages/LineIntersections"))
  },
  {
    segment: "web-gl-2",
    name: "WebGL 2",
    children: [
      {
        segment: "basic",
        name: "Basic",
        component: lazy(() => import("@pages/WebGL2/Basic"))
      },
      {
        segment: "image-processing",
        name: "Image Processing",
        component: lazy(() => import("@pages/WebGL2/ImageProcessing"))
      },
      {
        segment: "draw-images-in-rectangles",
        name: "Draw Images In Rectangles",
        component: lazy(() => import("@pages/WebGL2/DrawImagesInRectangles"))
      },
      {
        segment: "matrix-stack-squares",
        name: "Matrix Stack Squares",
        component: lazy(() => import("@pages/WebGL2/MatrixStackSquares"))
      },
      {
        segment: "projection-3d",
        name: "Projection 3D",
        component: lazy(() => import("@pages/WebGL2/Projection3D"))
      },
      {
        segment: "camera-3d",
        name: "Camera 3D",
        component: lazy(() => import("@pages/WebGL2/Camera3D"))
      },
      {
        segment: "heads-looking-at",
        name: "Heads Looking At",
        component: lazy(() => import("@pages/WebGL2/HeadsLookingAt"))
      },
      {
        segment: "lighting-directional",
        name: "Lighting Directional",
        component: lazy(() => import("@pages/WebGL2/LightingDirectional"))
      },
      {
        segment: "lighting-point",
        name: "Lighting Point",
        component: lazy(() => import("@pages/WebGL2/LightingPoint"))
      },
      {
        segment: "lighting-normal-map",
        name: "Lighting Normal Map",
        component: lazy(() => import("@pages/WebGL2/LightingNormalMap"))
      },
      {
        segment: "stencil-portal",
        name: "Stencil Portal",
        component: lazy(() => import("@pages/WebGL2/StencilPortal"))
      },
      {
        segment: "stencil-playground",
        name: "Stencil Playground",
        component: lazy(() => import("@pages/WebGL2/StencilPlayground"))
      }
    ]
  },
  {
    segment: "shaders",
    name: "Shaders",
    children: [
      {
        segment: "shapes",
        name: "Shapes",
        component: lazy(() => import("@pages/Shaders/Shapes"))
      },
      {
        segment: "flag",
        name: "Flag",
        component: lazy(() => import("@pages/Shaders/Flag"))
      },
      {
        segment: "patterns-uv",
        name: "Patterns UV",
        component: lazy(() => import("@pages/Shaders/PatternsUV"))
      },
      {
        segment: "extending-three-js-materials",
        name: "Extending Three JS Materials",
        component: lazy(
          () => import("@pages/Shaders/ExtendingThreeJSMaterials")
        )
      },
      {
        segment: "height-map-to-normal-map",
        name: "Height Map To Normal Map",
        component: lazy(() => import("@pages/Shaders/HeightMapToNormalMap"))
      }
    ]
  }
];

const flattenRoutes = (
  nodes: RouteNode[],
  parentPath = "",
  parentBreadcrumbs: string[] = []
): FlatRoute[] =>
  nodes.flatMap((node) => {
    const path = joinPath(parentPath, node.segment);
    const breadcrumbs = [...parentBreadcrumbs, node.name];

    return isRouteGroup(node)
      ? flattenRoutes(node.children, path, breadcrumbs)
      : [{ path, name: node.name, breadcrumbs, component: node.component }];
  });

export const flatRoutes = flattenRoutes(routes);
