import React, { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration,
    };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const error = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const warning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  const info = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full sm:w-auto pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const Toast = ({ toast, removeToast }) => {
  const { message, type, id } = toast;

  const typeConfig = {
    success: {
      icon: FaCheckCircle,
      bgColor: 'bg-green-500/90',
      borderColor: 'border-green-400',
      textColor: 'text-white',
      iconColor: 'text-green-100',
    },
    error: {
      icon: FaTimesCircle,
      bgColor: 'bg-red-500/90',
      borderColor: 'border-red-400',
      textColor: 'text-white',
      iconColor: 'text-red-100',
    },
    warning: {
      icon: FaExclamationTriangle,
      bgColor: 'bg-yellow-500/90',
      borderColor: 'border-yellow-400',
      textColor: 'text-white',
      iconColor: 'text-yellow-100',
    },
    info: {
      icon: FaInfoCircle,
      bgColor: 'bg-blue-500/90',
      borderColor: 'border-blue-400',
      textColor: 'text-white',
      iconColor: 'text-blue-100',
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border-2 rounded-lg shadow-2xl p-4
        flex items-start gap-3
        animate-slide-in-right
        pointer-events-auto
        backdrop-blur-sm
        min-w-[300px] sm:min-w-[350px]
        max-w-full
      `}
      role="alert"
    >
      <Icon className={`${config.iconColor} text-xl flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm sm:text-base break-words">{message}</p>
      </div>
      <button
        onClick={() => removeToast(id)}
        className="flex-shrink-0 text-white/80 hover:text-white transition ml-2"
        aria-label="Close notification"
      >
        <FaTimes className="text-sm" />
      </button>
    </div>
  );
};

export default ToastProvider;

