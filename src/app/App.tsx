import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './providers/ThemeContext';
import { AuthProvider, useAuth } from './providers/AuthContext';
import { SocketProvider } from './providers/SocketContext';
import { ChatProvider } from './providers/ChatContext';
import { CallProvider } from './providers/CallContext';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from 'react';
import { appRoutes } from './appRoutes';
import { Loading } from '../shared/components/Loading';
import Toast from '../shared/components/Toast';
import './../assets/style/Toast.css';
import { subscribeToast, unsubscribeToast } from '../shared/utils/toastEvent';

type ToastData = {
  _id: string;
  type?: string;
  message: string;
};

// Inner App component that has access to auth context
const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const basePath = process.env.PUBLIC_URL || '';
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    subscribeToast((payload) => {
      setToasts((prev) => [
        payload,
        ...prev,
      ]);
    });
    return () => unsubscribeToast();
  }, []);

  const handleToastClose = (id: string) => {
    setToasts((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <SocketProvider isAuthenticated={isAuthenticated} user={user}>
      <ChatProvider>
        <CallProvider>
          <BrowserRouter basename={basePath}>
            {/* Toast stack */}
            <div className="toast-stack">
              {toasts.map((toast) => (
                <div key={toast._id} style={{ pointerEvents: 'auto' }}>
                  <Toast
                    id={toast._id}
                    type={toast.type as any}
                    message={toast.message}
                    onClose={handleToastClose}
                    className="toast-animate toast-in"
                  />
                </div>
              ))}
            </div>
            <Routes>
              {appRoutes.map(({ path, Component, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    element ? element : (
                      <Suspense fallback={<Loading />}>
                        <Component />
                      </Suspense>
                    )
                  }
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CallProvider>
      </ChatProvider>
    </SocketProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;