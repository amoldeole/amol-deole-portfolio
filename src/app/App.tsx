import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './providers/ThemeContext';
import { AuthProvider } from './providers/AuthContext';
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

function App() {
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
    <ThemeProvider>
      <AuthProvider>
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;