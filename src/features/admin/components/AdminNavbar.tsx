import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Mail, UserCircle, Settings, LogOut, User, ExternalLink } from 'lucide-react';

interface AdminNavbarProps {
  onSidebarToggle: () => void;
  theme: string;
  toggleTheme: () => void;
  user: { firstName?: string; lastName?: string; email?: string } | null;
  handleLogout: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onSidebarToggle,
  theme,
  toggleTheme,
  user,
  handleLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Left: Admin Panel brand and sidebar toggle */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={onSidebarToggle}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link
              to="/admin"
              className="ml-4 text-xl font-bold text-gray-900 dark:text-white hidden sm:inline"
            >
              Admin Panel
            </Link>
          </div>

          {/* Center: Spacer */}
          <div className="flex-1" />

          {/* Right: Bell, Mail, Theme, User Name, User Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle (keep your previous icon logic) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark'
                ? <span className="inline-block w-5 h-5">🌙</span>
                : <span className="inline-block w-5 h-5">☀️</span>
              }
            </button>
            {/* Bell icon */}
            <Link to="/admin/notifications" className="relative flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">11</span>
            </Link>
            {/* Mail icon */}
            <Link to="/admin/messages" className="relative flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <Mail className="w-6 h-6" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">11</span>
            </Link>
            {/* User name (desktop only) */}
            <span
              className="text-sm text-gray-700 dark:text-gray-300 font-medium hidden sm:inline cursor-pointer"
              onClick={() => navigate('/admin/profile')}
            >
              {user?.firstName} {user?.lastName}
            </span>
            {/* User avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex items-center focus:outline-none"
                aria-label="User menu"
              >
                <UserCircle className="w-9 h-9 text-gray-400 dark:text-gray-300" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 py-1">
                  {/* Username on mobile */}
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center sm:hidden"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/admin/profile');
                    }}
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    {user?.firstName} {user?.lastName}
                  </button>
                  <Link
                    to="/admin/profile"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" /> Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </Link>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Portfolio
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;