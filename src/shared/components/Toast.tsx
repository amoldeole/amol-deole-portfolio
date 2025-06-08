import React, { useEffect } from 'react';
import {
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
} from 'lucide-react';
import '../../assets/style/Toast.css';

type ToastType = 'notification' | 'success' | 'warning' | 'error' | 'info';

interface ToastProps {
  id: string;
  type?: ToastType;
  onClose: (id: string) => void;
  duration?: number;
  message?: string;
  className?: string;
}

const iconBgColors: Record<ToastType, string> = {
  notification: '#fff7e6',
  success: '#e6f9f0',
  warning: '#fffbe6',
  error: '#fdeaea',
  info: '#e6f0fa',
};

const iconColors: Record<ToastType, string> = {
  notification: '#e58e13',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
};

const cardBorderColors: Record<ToastType, string> = {
  notification: '#e58e13',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
};

const cardShadow = '0 2px 8px rgba(0,0,0,0.15)';

const icons: Record<ToastType, React.ReactNode> = {
  notification: <BarChart2 size={28} color={iconColors.notification} />,
  success: <CheckCircle2 size={28} color={iconColors.success} />,
  warning: <AlertTriangle size={28} color={iconColors.warning} />,
  error: <XCircle size={28} color={iconColors.error} />,
  info: <Info size={28} color={iconColors.info} />,
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'notification',
  onClose,
  duration = 3000,
  message,
  className,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [onClose, duration, id]);

  return (
    <div
      className={className}
      style={{
        marginBottom: 12,
        minWidth: 320,
        maxWidth: 400,
        width: '90vw',
        fontFamily: 'Roboto, Arial, sans-serif',
      }}
    >
      <div
        className="card"
        style={{
          borderLeft: `6px solid ${cardBorderColors[type]}`,
          boxShadow: cardShadow,
          background: '#fff',
          minHeight: 20,
          padding: 0,
          position: 'relative',
        }}
      >
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={() => onClose(id)}
          style={{
            position: 'absolute',
            right: 14,
            top: 6,
            fontSize: 22,
            color: '#888',
            background: 'none',
            border: 'none',
            opacity: 0.7,
            zIndex: 2,
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        <div className="card-body d-flex align-items-center" style={{ padding: '5px', minHeight: 20 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 40 }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: iconBgColors[type],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              {icons[type]}
            </span>
            <span style={{ fontWeight: 500, fontSize: 15, color: '#222' }}>
              {message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;