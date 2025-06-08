// Example ToastManager.tsx
import React, { useEffect, useState } from 'react';
import Toast from './Toast';

type ToastType = 'notification' | 'success' | 'warning' | 'error' | 'info';

interface ToastData {
  id: string;
  type?: ToastType;
  message?: string;
  duration?: number;
  className?: string;
}

const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      setToasts((prev) => [
        ...prev,
        { id: Date.now().toString(), ...customEvent.detail },
      ]);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);

  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          className={toast.className}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastManager;