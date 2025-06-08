import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AdminMenuItem, AdminSidebarProps } from './../../../shared/types/menu.items.types';


const AdminSidebar: React.FC<AdminSidebarProps> = ({ menuItems, sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`h-full w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 transition-colors duration-200`}>
      <div className="h-full px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`${isActive(item.path)
                ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md transition-colors`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;