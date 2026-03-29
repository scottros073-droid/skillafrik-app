/**
 * StatsSection.jsx - Display freelancer statistics and achievements
 */

import React from "react";
import {
  FaBriefcase,
  FaDollarSign,
  FaClock,
  FaThumbsUp,
} from "react-icons/fa";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

export default function StatsSection({ profile }) {
  const stats = [
    {
      icon: FaBriefcase,
      label: "Jobs Completed",
      value: profile?.completedJobs || 0,
    },
    {
      icon: FaDollarSign,
      label: "Total Earnings",
      value: profile?.earnings
        ? `$${(profile.earnings / 1000).toFixed(1)}k`
        : "$0",
    },
    {
      icon: FaClock,
      label: "Response Time",
      value: profile?.responseTime || "< 1 hour",
    },
    {
      icon: FaThumbsUp,
      label: "Hire Rate",
      value: `${profile?.hireRate || 0}%`,
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 px-8 py-6 border-b border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}
