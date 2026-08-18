import { lazy } from 'react';

export const routesConfig = {
  home: {
    path: '/',
    name: 'Home',
    component: lazy(() => import('@pages/Home'))
  },
  first: {
    path: '/Native',
    name: 'First',
    component: lazy(() => import('@pages/Native'))
  },
  projectLongLatOnSphere: {
    path: '/project-long-lat-on-sphere',
    name: 'Project Long Lat On Sphere',
    component: lazy(() => import('@pages/ProjectLongLatOnSphere'))
  },
  heighMapToNormalMap: {
    path: '/heigh-map-to-normal-map',
    name: 'Heigh Map To Normal Map',
    component: lazy(() => import('@pages/HeightMapToNormalMap'))
  }
};
