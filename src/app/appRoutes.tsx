import { lazy } from 'react';
import ProtectedRoute from '../features/admin/ProtectedRoute';
import AdminLayout from '../features/admin/AdminLayout';

export const appRoutes = [
  {
    path: '/login',
    Component: lazy(() => import('../shared/components/Login')),
  },
  {
    path: 'signup',
    Component: lazy(() => import('../shared/components/SignUpWizard')),
  },
  {
    path: '/admin/login',
    Component: lazy(() => import('../shared/components/Login')),
  },
  {
    path: '/admin/*',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/*',
    Component: lazy(() => import('../features/portfolio/PortfolioLayout')),
  },
];