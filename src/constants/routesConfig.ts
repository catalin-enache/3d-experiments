import { lazy } from 'react';

export const routesConfig = {
  home: {
    path: '/',
    name: 'Home',
    component: lazy(() => import('@pages/home'))
  },
  first: {
    path: '/native',
    name: 'First',
    component: lazy(() => import('@pages/native'))
  },
  projectLongLatOnSphere: {
    path: '/project-long-lat-on-sphere',
    name: 'Project Long Lat On Sphere',
    component: lazy(() => import('@pages/projectLongLatOnSphere'))
  },
  heighMapToNormalMap: {
    path: '/heigh-map-to-normal-map',
    name: 'Heigh Map To Normal Map',
    component: lazy(() => import('@pages/heightMapToNormalMap'))
  }
};
