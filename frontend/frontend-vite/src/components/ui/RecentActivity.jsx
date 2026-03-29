/**
 * =====================================================
 * RECENT ACTIVITY COMPONENT
 * =====================================================
 * Displays a list of recent user activities
 */

import React from "react";
import { FaBriefcase, FaCheckCircle, FaDollarSign, FaComments } from "react-icons/fa";

const activityIcons = {
  job: FaBriefcase,
  completed: FaCheckCircle,
  payment: FaDollarSign,
  message: FaComments,
};

const RecentActivity = ({ activities = [], onActivityClick = null }) => {
  // Demo activities if none provided
  const displayActivities = activities.length > 0 ? activities : [
    {
      id: 1,
      type: "job",
      title: "New job posted: React Developer",
      time: "2 hours ago",
      description: "Web Development",
    },
    {
      id: 2,
      type: "completed",
      title: "Job completed successfully",
      time: "5 hours ago",
      description: "UI Design Project",
    },
    {
      id: 3,
      type: "payment",
      title: "Payment received: $500",
      time: "1 day ago",
      description: "From: John Smith",
    },
    {
      id: 4,
      type: "message",
      title: "New message from client",
      time: "1 day ago",
      description: "About the design project",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {displayActivities.map((activity) => {
          const IconComponent = activityIcons[activity.type] || FaBriefcase;

          return (
            <div
              key={activity.id}
              onClick={() => onActivityClick?.(activity)}
              className={`flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 ${onActivityClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition" : "p-2"}`}
            >
              {/* ICON */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <IconComponent size={18} />
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
              </div>

              {/* TIME */}
              <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                {activity.time}
              </div>
            </div>
          );
        })}
      </div>

      {displayActivities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activities</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
