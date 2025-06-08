import { lazy } from 'react';

export const portfolioRoutes = [
  {
    path: '',
    element: lazy(() => import('./pages/PortfolioHome')),
  },
  {
    path: 'about',
    element: lazy(() => import('./pages/About')),
  },
  {
    path: 'certificates',
    element: lazy(() => import('./pages/Certificates')),
  },
  {
    path: 'contact',
    element: lazy(() => import('./pages/Contact')),
  },
  {
    path: 'experience',
    element: lazy(() => import('./pages/Experience')),
  },
  {
    path: 'projects',
    element: lazy(() => import('./pages/Projects')),
  },
  {
    path: 'resume',
    element: lazy(() => import('./pages/Resume')),
  },
  {
    path: 'skills',
    element: lazy(() => import('./pages/Skills')),
  },
  {
    path: 'technologies',
    element: lazy(() => import('./pages/Technologies')),
  },
  {
    path: 'testimonials',
    element: lazy(() => import('./pages/Testimonials')),
  },
];
