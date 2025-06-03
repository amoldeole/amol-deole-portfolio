import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LazyComponent } from './components/common/LazyComponent';
import { routes } from './routes/routes';
import Navbar from './components/Navbar';

// Import admin components
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';

// Layout component for public routes
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <footer className="bg-gray-900 dark:bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              © 2024 Amol Deole. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Designed by Amol Deole | Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

function App() {
  const basePath = process.env.PUBLIC_URL || '';

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename={basePath}>
          <Routes>
            {/* Admin Login Route (Public) */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<div className="p-6">Projects Management - Coming Soon</div>} />
              <Route path="skills" element={<div className="p-6">Skills Management - Coming Soon</div>} />
              <Route path="experience" element={<div className="p-6">Experience Management - Coming Soon</div>} />
              <Route path="education" element={<div className="p-6">Education Management - Coming Soon</div>} />
              <Route path="certificates" element={<div className="p-6">Certificates Management - Coming Soon</div>} />
              <Route path="testimonials" element={<div className="p-6">Testimonials Management - Coming Soon</div>} />
              <Route path="contacts" element={<div className="p-6">Contacts Management - Coming Soon</div>} />
            </Route>

            {/* Public Routes */}
            {routes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PublicLayout>
                    <LazyComponent>
                      <Component />
                    </LazyComponent>
                  </PublicLayout>
                }
              />
            ))}

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;