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

export const routesConfig: RouteNode[] = [
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
    segment: "dot-cross-product",
    name: "Dot Cross Product",
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
    segment: "lines-intersections",
    name: "Lines Intersections",
    component: lazy(() => import("@pages/LineIntersections"))
  },
  {
    segment: "web-gl-2",
    name: "WebGL 2",
    children: [
      {
        segment: "basic",
        name: "Basic",
        component: lazy(() => import("@pages/WebGL2/WebGL2Basic"))
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

export const flatRoutes = flattenRoutes(routesConfig);
