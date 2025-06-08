import { lazy } from 'react';

export const adminRoutes = [
  {
    path: '',
    element: lazy(() => import('./pages/dashboard/Dashboard')),
  },
  {
    path: 'dashboard',
    element: lazy(() => import('./pages/dashboard/Dashboard')),
  },
  {
    path: 'projects',
    element: lazy(() => import('./components/Projects')),
  },
  {
    path: 'skills',
    element: lazy(() => import('./components/Skills')),
  },
  {
    path: 'resume',
    element: lazy(() => import('./components/Resume')),
  },
  {
    path: 'testimonials',
    element: lazy(() => import('./components/Testimonials')),
  },
  {
    path: 'certificates',
    element: lazy(() => import('./components/Certificates')),
  },
  {
    path: 'users/*',
    element: lazy(() => import('./pages/users/UsersModule')),
  },
  {
    path: 'chat-management',
    element: lazy(() => import('./pages/chat-management/ChatManagement')),
  },
  {
    path: 'contact-management',
    element: lazy(() => import('./pages/chat-management/ContactManagement')),
  },
  {
    path: 'contacts',
    element: lazy(() => import('./../chat/Contacts/Contacts')),
  },
  {
    path: 'chat-widget-1',
    element: lazy(() => import('./../chat/Chat/ChatWidget')),
  },
  {
    path: 'chat-widget-2',
    element: lazy(() => import('./../chat/ChatWidget/ChatWidget')),
  },
  {
    path: 'call-window',
    element: lazy(() => import('./../chat/CallWindow/CallWindow')),
  },
  {
    path: 'chat-home',
    element: lazy(() => import('./../chat/Home/Home')),
  },
  {
    path: 'settings',
    element: lazy(() => import('./../chat/Settings/Settings')),
  },
  {
    path: 'Status',
    element: lazy(() => import('./../chat/Status/Status')),
  },
  {
    path: '*',
    element: lazy(() => import('../../shared/components/ComingSoon')),
  },
];

export default adminRoutes;