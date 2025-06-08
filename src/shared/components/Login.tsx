import React, { useState } from 'react';
import { Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import { motion } from 'framer-motion';
import { Mail, User } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth(); // Make sure user is available
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/admin';

  // Determine if this is the admin login route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Redirect logic based on role
  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to={from} replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Handler for user icon click
  const handleUserIconClick = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8"
        >
          <div className="flex flex-col items-center mb-8">
            <div
              className="relative inline-block mb-4 cursor-pointer"
              onClick={!isAdminRoute ? handleUserIconClick : undefined}
              title={!isAdminRoute ? "Go to Home" : undefined}
            >
              {isAdminRoute ? (
                <>
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                     src="/amol-deole-portfolio/assets/img/me.jpg"
                    alt="Amol Deole"
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto shadow-xl border-4 border-white dark:border-gray-700"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-20 blur-xl"
                  />
                </>
              ) : (
                <User className="w-24 h-24 md:w-28 md:h-28 text-gray-400 dark:text-gray-600 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full p-6" />
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 font-poppins">
              {isAdminRoute ? 'Admin Login' : 'Login'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAdminRoute
                ? 'Sign in to access the admin dashboard'
                : 'Sign in to your account'}
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 bg-white dark:bg-gray-800"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 bg-white dark:bg-gray-800"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200"
              >
                {isLoading ? 'Signing in...' : (
                  <>
                    <Mail size={18} className="mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>
          {/* Show sign up prompt only if NOT admin route */}
          {!isAdminRoute && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Don&apos;t have login credentials?{' '}
                <Link to="/signup" className="text-blue-500 hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Create an account to access chat and portfolio features.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Login;