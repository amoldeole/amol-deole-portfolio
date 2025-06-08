import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, Settings, LogOut, User, Bell, Mail, ExternalLink } from 'lucide-react';

interface UserMenuProps {
  user: { firstName?: string; lastName?: string; email?: string; role?: string } | null;
  onLogout: () => void;
  notificationsCount?: number;
  messagesCount?: number;
  isAdmin?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogout,
  notificationsCount = 0,
  messagesCount = 0,
  isAdmin = false,
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
    <div className="flex items-center space-x-4">
      {/* Notification Icon */}
      <Link to={isAdmin ? "/admin/notifications" : "/notifications"} className="relative flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
        <Bell className="w-6 h-6" />
        {notificationsCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">{notificationsCount}</span>
        )}
      </Link>
      {/* Mail Icon */}
      <Link to={isAdmin ? "/admin/messages" : "/messages"} className="relative flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
        <Mail className="w-6 h-6" />
        {messagesCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{messagesCount}</span>
        )}
      </Link>
      {/* User name (desktop only) */}
      <span
        className="text-sm text-gray-700 dark:text-gray-300 font-medium hidden sm:inline cursor-pointer"
        onClick={() => navigate(isAdmin ? '/admin/profile' : '/profile')}
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
                navigate(isAdmin ? '/admin/profile' : '/profile');
              }}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              {user?.firstName} {user?.lastName}
            </button>
            <Link
              to={isAdmin ? "/admin/profile" : "/profile"}
              className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <User className="w-4 h-4 mr-2" /> Profile
            </Link>
            <Link
              to={isAdmin ? "/admin/settings" : "/settings"}
              className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Link>
            {isAdmin && (
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Portfolio
              </Link>
            )}
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;