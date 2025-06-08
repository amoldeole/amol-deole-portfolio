import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import { useTheme } from '../../app/providers/ThemeContext';
import {
  Home,
  User as UserIcon,
  Award,
  FileText,
  Folder,
  MessageCircle,
  BadgeCheck,
  Mail,
  LogIn,
  Shield,
} from 'lucide-react';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme, isLoading } = useTheme();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-1" /> },
    { name: 'About', path: '/about', icon: <UserIcon className="w-4 h-4 mr-1" /> },
    { name: 'Skills', path: '/skills', icon: <Award className="w-4 h-4 mr-1" /> },
    { name: 'Resume', path: '/resume', icon: <FileText className="w-4 h-4 mr-1" /> },
    { name: 'Projects', path: '/projects', icon: <Folder className="w-4 h-4 mr-1" /> },
    { name: 'Testimonials', path: '/testimonials', icon: <MessageCircle className="w-4 h-4 mr-1" /> },
    { name: 'Certificates', path: '/certificates', icon: <BadgeCheck className="w-4 h-4 mr-1" /> },
    { name: 'Contact', path: '/contact', icon: <Mail className="w-4 h-4 mr-1" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Add your logout logic here
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`bg-white dark:bg-gray-900 shadow-lg fixed w-full z-50 transition-colors duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center flex-1 min-w-0">
            {/* Left: User/Site Name and Theme Toggle */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex-shrink-0">
                <span className="text-2xl font-bold gradient-text">Amol Deole</span>
              </Link>
              <button
                onClick={toggleTheme}
                disabled={isLoading}
                className="ml-3 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
            {/* Nav links */}
            <div className="flex items-center space-x-4 flex-1 min-w-0 justify-end">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${isActive(item.path)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              {/* Admin Panel only for admin */}
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="dark:text-gray-300 border-2 p-2 py-1 rounded-full hover:bg-primary-900 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Admin Panel
                </Link>
              )}

              {/* UserMenu for authenticated users, Login for guests */}
              {isAuthenticated ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <Link
                  to="/login"
                  className="border-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 px-6 py-2 rounded-full font-semibold hover:bg-primary-600 hover:text-white dark:hover:bg-primary-400 dark:hover:text-gray-900 transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              disabled={isLoading}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 mr-2 transition-colors disabled:opacity-50"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.path)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.name}
                  </span>
                </Link>
              ))}
              {/* Admin Panel only for admin */}
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              {/* UserMenu for authenticated users, Login for guests */}
              {isAuthenticated ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
