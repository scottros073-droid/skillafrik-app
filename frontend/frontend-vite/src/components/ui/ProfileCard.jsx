/**
 * =====================================================
 * PROFILE CARD COMPONENT
 * =====================================================
 * Displays user profile info with avatar, name, role, and quick stats
 */

import React from "react";
import { FaEdit } from "react-icons/fa";

const ProfileCard = ({ user, onEdit }) => {
  if (!user) return null;

  const name = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || "User";
  const avatar = user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      {/* HEADER WITH EDIT BUTTON */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <FaEdit size={18} />
          </button>
        )}
      </div>

      {/* AVATAR */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={avatar}
          alt={name}
          className="w-20 h-20 rounded-full border-4 border-blue-200 dark:border-blue-900 object-cover"
        />
        <div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
          {user.email && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{user.email}</p>}
        </div>
      </div>

      {/* STATS */}
      {user.role === "freelancer" && (
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Completed Jobs</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {user.completedJobs || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {user.averageRating ? user.averageRating.toFixed(1) : "N/A"} ⭐
            </span>
          </div>
          {user.isPremium && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span className="px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                Premium
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
