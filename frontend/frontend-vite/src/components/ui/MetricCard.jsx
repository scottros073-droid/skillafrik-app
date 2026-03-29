/**
 * =====================================================
 * METRIC CARD COMPONENT
 * =====================================================
 * Displays a key metric with icon, label, value, and trend
 */

import React from "react";

const MetricCard = ({
  icon: Icon,
  label,
  value,
  unit = "",
  trend = null,
  trendLabel = "",
  color = "blue",
}) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* ICON */}
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {Icon && <Icon size={24} />}
      </div>

      {/* CONTENT */}
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
        {unit && <span className="text-gray-600 dark:text-gray-400 text-sm">{unit}</span>}
      </div>

      {/* TREND */}
      {trend !== null && (
        <div className="mt-3 flex items-center gap-1">
          {trend > 0 && <span className="text-green-600 dark:text-green-400 text-sm font-semibold">↑</span>}
          {trend < 0 && <span className="text-red-600 dark:text-red-400 text-sm font-semibold">↓</span>}
          {trend === 0 && <span className="text-gray-400 text-sm">→</span>}
          <span className={`text-sm font-semibold ${trend > 0 ? "text-green-600 dark:text-green-400" : trend < 0 ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
            {Math.abs(trend)}% {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
