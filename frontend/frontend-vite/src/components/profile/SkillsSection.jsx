/**
 * SkillsSection.jsx - Display freelancer skills as tags/badges
 */

import React from "react";
import { FaTag } from "react-icons/fa";

export default function SkillsSection({ profile }) {
  if (!profile?.skills || profile.skills.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Skills
      </h2>
      <div className="flex flex-wrap gap-3">
        {profile.skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
          >
            <FaTag className="w-4 h-4" />
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
