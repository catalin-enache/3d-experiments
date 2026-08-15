import { lazy } from 'react';

export const routesConfig = {
  home: {
    path: '/',
    name: 'Home',
    component: lazy(() => import('@pages/home'))
  },
  first: {
    path: '/first',
    name: 'First',
    component: lazy(() => import('@pages/first'))
  },
  projectLongLatOnSphere: {
    path: '/project-long-lat-on-sphere',
    name: 'Project Long Lat On Sphere',
    component: lazy(() => import('@pages/projectLongLatOnSphere'))
  }
};
