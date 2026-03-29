import React from "react";

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="h-72 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse p-4" />
      ))}
    </div>
  );
}
