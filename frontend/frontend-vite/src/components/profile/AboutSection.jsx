/**
 * AboutSection.jsx - Profile bio and description
 */

import React from "react";

export default function AboutSection({ profile }) {
  if (!profile?.bio) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        About
      </h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        {profile.bio}
      </p>
    </div>
  );
}
