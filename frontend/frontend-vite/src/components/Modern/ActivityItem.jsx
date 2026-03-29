import React from "react";
import { FaCheckCircle, FaFileAlt, FaStar, FaDollarSign, FaBriefcase, FaUser } from "react-icons/fa";

const activityIcons = {
  contract: FaBriefcase,
  review: FaStar,
  payment: FaDollarSign,
  proposal: FaFileAlt,
  hire: FaUser,
  milestone: FaCheckCircle,
};

export default function ActivityItem({ activity }) {
  const IconComponent = activityIcons[activity.type] || FaCheckCircle;

  const typeColors = {
    contract: "bg-blue-50 text-blue-600",
    review: "bg-yellow-50 text-yellow-600",
    payment: "bg-green-50 text-green-600",
    proposal: "bg-purple-50 text-purple-600",
    hire: "bg-indigo-50 text-indigo-600",
    milestone: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${typeColors[activity.type] || typeColors.contract}`}>
        <IconComponent size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
      </div>

      {/* Action Badge if any */}
      {activity.badge && (
        <div className="flex-shrink-0 flex items-center">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            activity.badgeType === 'success' 
              ? 'bg-green-100 text-green-700'
              : activity.badgeType === 'warning'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {activity.badge}
          </span>
        </div>
      )}
    </div>
  );
}
