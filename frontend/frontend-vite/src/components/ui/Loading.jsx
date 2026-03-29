/**
 * =====================================================
 * REUSABLE LOADING COMPONENT
 * =====================================================
 */

import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center gap-4">
        {/* SPINNER */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-gray-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
        </div>

        {/* TEXT */}
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
