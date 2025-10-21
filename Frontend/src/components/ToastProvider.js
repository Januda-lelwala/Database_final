import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import './ToastProvider.css';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback((message, options = {}) => {
    toastIdCounter += 1;
    const id = toastIdCounter;
    const toast = {
      id,
      message,
      type: options.type || 'info'
    };
    const duration = options.duration ?? 5000;

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      const timeout = setTimeout(() => removeToast(id), duration);
      timeoutsRef.current.set(id, timeout);
    }

    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <span>{toast.message}</span>
            <button type="button" onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

