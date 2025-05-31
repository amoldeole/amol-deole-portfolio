import { lazy } from 'react';

const basePath = process.env.PUBLIC_URL || '';

export const routes = [
  {
    path: `${basePath}/`,
    component: lazy(() => import('../components/Hero')),
    exact: true
  },
  {
    path: `${basePath}/about`,
    component: lazy(() => import('../components/About'))
  },
  {
    path: `${basePath}/skills`,
    component: lazy(() => import('../components/Skills'))
  },
  {
    path: `${basePath}/resume`,
    component: lazy(() => import('../components/Resume'))
  },
  {
    path: `${basePath}/projects`,
    component: lazy(() => import('../components/Projects'))
  },
  {
    path: `${basePath}/testimonials`,
    component: lazy(() => import('../components/Testimonials'))
  },
  {
    path: `${basePath}/certificates`,
    component: lazy(() => import('../components/Certificates'))
  },
  {
    path: `${basePath}/contact`,
    component: lazy(() => import('../components/Contact'))
  }
];
