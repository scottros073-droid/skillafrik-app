/**
 * Toast Notification System
 * Global notification management with React Context
 */

import React, { createContext, useCallback, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

// Create Toast Context
export const ToastContext = createContext();

/**
 * Toast Types
 */
const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = 5000) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    addToast,
    removeToast,
    success: (msg, duration) => addToast(msg, TOAST_TYPES.SUCCESS, duration),
    error: (msg, duration) => addToast(msg, TOAST_TYPES.ERROR, duration),
    info: (msg, duration) => addToast(msg, TOAST_TYPES.INFO, duration),
    warning: (msg, duration) => addToast(msg, TOAST_TYPES.WARNING, duration),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * Toast Container Component
 */
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

/**
 * Individual Toast Component
 */
function Toast({ id, message, type, onClose }) {
  const colors = {
    success: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200",
    error: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200",
    info: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200",
    warning: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200",
  };

  const icons = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    info: FaInfoCircle,
    warning: FaExclamationCircle,
  };

  const Icon = icons[type];

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border pointer-events-auto
        animate-slide-in-up shadow-lg
        ${colors[type]}
      `}
      role="alert"
    >
      <Icon className="flex-shrink-0 w-5 h-5 mt-0.5" />
      <div className="flex-1 leading-relaxed">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Hook to use Toast notifications
 */
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}

export { TOAST_TYPES };
export default { ToastProvider, useToast, TOAST_TYPES };
