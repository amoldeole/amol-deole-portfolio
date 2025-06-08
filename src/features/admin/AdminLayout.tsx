import React, { Suspense } from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { adminRoutes } from './AdminRoutes';
import { Loading } from '../../shared/components/Loading';
import { useAuth } from '../../app/providers/AuthContext';
import { useTheme } from '../../app/providers/ThemeContext';
import { AdminMenuItem } from '../../shared/types/menu.items.types';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import menuItemsJson from '../../assets/data/adminMenu.json';
import { ChatProvider } from '../../app/providers/ChatContext';
import { CallProvider } from '../../app/providers/CallContext';

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const menuItems: AdminMenuItem[] = menuItemsJson.filter(item => item.visible);
    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <CallProvider>
            <ChatProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col w-full">
                    {/* Top Navigation */}
                    <AdminNavbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
                        theme={theme}
                        toggleTheme={toggleTheme}
                        user={user}
                        handleLogout={handleLogout} />

                    <div className="flex flex-1 w-full relative">
                        <div className="hidden md:block">
                            <AdminSidebar menuItems={menuItems} sidebarOpen={true} setSidebarOpen={setSidebarOpen} />
                        </div>
                        {/* Sidebar for mobile */}
                        {sidebarOpen && (
                            <>
                                {/* Overlay */}
                                <div className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden" onClick={() => setSidebarOpen(false)} />
                                {/* Sidebar */}
                                <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
                                    <AdminSidebar menuItems={menuItems} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                                </div>
                            </>
                        )}
                        {/* Main Content */}
                        <div className="flex-1 min-h-0 w-full overflow-x-auto">
                            <main className="p-6 w-full h-full">
                                <Suspense fallback={<Loading />}>
                                    <Routes>
                                        {adminRoutes.map(({ path, element: Element }) => (
                                            <Route key={path || 'index'} path={path} element={<Element/>}/>
                                        ))}
                                        <Route index element={React.createElement(adminRoutes[0].element)} />
                                    </Routes>
                                    <Outlet />
                                </Suspense>
                            </main>
                        </div>
                    </div>
                </div>
            </ChatProvider>
        </CallProvider>
    );
};

export default AdminLayout;