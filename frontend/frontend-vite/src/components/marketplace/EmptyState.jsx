import React from "react";

export default function EmptyState({ title = "No services found", message = "Try another filter or check back later." }) {
  return (
    <div className="w-full rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
      <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</p>
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}
