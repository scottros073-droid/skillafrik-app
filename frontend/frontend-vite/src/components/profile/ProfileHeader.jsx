/**
 * ProfileHeader.jsx - Profile header with avatar, name, title, rating, badges, action buttons
 */

import React from "react";
import {
  FaStar,
  FaTrophy,
  FaCheckCircle,
  FaHeart,
  FaEnvelope,
  FaBriefcase,
  FaRegHeart,
} from "react-icons/fa";

export default function ProfileHeader({ profile, onHire, onSave, saved }) {
  if (!profile) return null;

  const rating = profile.rating || 0;
  const reviewCount = profile.reviewCount || 0;
  const completedJobs = profile.completedJobs || 0;

  return (
    <div className="p-8 pb-0">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                {profile.firstName?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {`${profile.firstName || ""} ${profile.lastName || ""}`.trim()}
            </h1>
            {profile.isVerified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                <FaCheckCircle /> Verified
              </span>
            )}
            {profile.isPremium && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
                <FaTrophy /> Premium
              </span>
            )}
            {completedJobs > 100 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                <FaTrophy /> Top Rated
              </span>
            )}
          </div>

          {/* Title */}
          {profile.title && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
              {profile.title}
            </p>
          )}

          {/* Rating and Stats */}
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {rating.toFixed(1)}
              </span>
              {reviewCount > 0 && (
                <span className="text-gray-600 dark:text-gray-400">
                  ({reviewCount} reviews)
                </span>
              )}
            </div>

            {completedJobs > 0 && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FaBriefcase className="w-4 h-4" />
                <span className="font-medium">{completedJobs} Jobs Completed</span>
              </div>
            )}
          </div>

          {/* Country & Response Time */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {profile.country && <p>{profile.country}</p>}
            {profile.responseTime && (
              <p>Average response time: {profile.responseTime}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onHire}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg"
            >
              <FaBriefcase /> Hire Now
            </button>
            <button
              onClick={onHire}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <FaEnvelope /> Send Message
            </button>
            <button
              onClick={onSave}
              className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${
                saved
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {saved ? <FaHeart /> : <FaRegHeart />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
