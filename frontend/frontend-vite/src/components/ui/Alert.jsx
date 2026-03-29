/**
 * =====================================================
 * ALERT COMPONENT
 * =====================================================
 * Displays alert messages (success, error, warning, info)
 */

import React from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const Alert = ({ type = "info", title = "", message = "", onClose = null }) => {
  const configs = {
    success: {
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      icon: FaCheckCircle,
      iconColor: "text-green-600 dark:text-green-400",
      titleColor: "text-green-900 dark:text-green-400",
      textColor: "text-green-700 dark:text-green-300",
    },
    error: {
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      icon: FaExclamationCircle,
      iconColor: "text-red-600 dark:text-red-400",
      titleColor: "text-red-900 dark:text-red-400",
      textColor: "text-red-700 dark:text-red-300",
    },
    warning: {
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      icon: FaExclamationCircle,
      iconColor: "text-yellow-600 dark:text-yellow-400",
      titleColor: "text-yellow-900 dark:text-yellow-400",
      textColor: "text-yellow-700 dark:text-yellow-300",
    },
    info: {
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      icon: FaInfoCircle,
      iconColor: "text-blue-600 dark:text-blue-400",
      titleColor: "text-blue-900 dark:text-blue-400",
      textColor: "text-blue-700 dark:text-blue-300",
    },
  };

  const config = configs[type] || configs.info;
  const IconComponent = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex items-start gap-4`}>
      {/* ICON */}
      <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
        <IconComponent size={20} />
      </div>

      {/* CONTENT */}
      <div className="flex-1">
        {title && <h4 className={`font-semibold ${config.titleColor}`}>{title}</h4>}
        {message && <p className={`text-sm mt-1 ${config.textColor}`}>{message}</p>}
      </div>

      {/* CLOSE BUTTON */}
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${config.titleColor} hover:opacity-70 transition-opacity`}
        >
          <FaTimes size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
