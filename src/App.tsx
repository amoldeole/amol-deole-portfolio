import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Dashboard from './components/admin/Dashboard';
import ChatManagement from './components/admin/ChatManagement';
import ContactsManagement from './components/admin/ContactsManagement';
import Login from './components/admin/Login';
import LazyComponent from './components/common/LazyComponent';
import Loading from './components/common/Loading';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home/Home'));
const Auth = React.lazy(() => import('./pages/Auth/Auth'));

// Public routes configuration
const publicRoutes = [
  { path: '/', component: Home },
  { path: '/auth', component: Auth },
];

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <Routes>
                          <Route index element={<Navigate to="/admin/dashboard" replace />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="chat" element={<ChatManagement />} />
                          <Route path="contacts" element={<ContactsManagement />} />
                        </Routes>
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Admin Login Route */}
                <Route path="/admin/login" element={<Login />} />

                {/* Public Routes */}
                {publicRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Suspense fallback={<Loading />}>
                        <LazyComponent>
                          <route.component />
                        </LazyComponent>
                      </Suspense>
                    }
                  />
                ))}

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;