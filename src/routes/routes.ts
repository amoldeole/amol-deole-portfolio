import { lazy } from 'react';

// Remove basePath from individual routes since it's handled by BrowserRouter basename
export const routes = [
  {
    path: "/",
    component: lazy(() => import('../components/Home')),
    exact: true
  },
  {
    path: "/about",
    component: lazy(() => import('../components/About'))
  },
  {
    path: "/skills",
    component: lazy(() => import('../components/Skills'))
  },
  {
    path: "/resume",
    component: lazy(() => import('../components/Resume'))
  },
  {
    path: "/projects",
    component: lazy(() => import('../components/Projects'))
  },
  {
    path: "/testimonials",
    component: lazy(() => import('../components/Testimonials'))
  },
  {
    path: "/certificates",
    component: lazy(() => import('../components/Certificates'))
  },
  {
    path: "/contact",
    component: lazy(() => import('../components/Contact'))
  }
];
