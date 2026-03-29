// src/components/AdCard.jsx
import React, { useEffect, useState } from "react";
import { trackClick, trackView } from "../services/adService";

export default function AdCard({ ad }) {
  const [imageError, setImageError] = useState(false);

  // Track ad views on mount
  useEffect(() => {
    if (ad?._id) trackView(ad._id);
  }, [ad?._id]);

  const handleClick = (e) => {
    e.stopPropagation(); // prevent parent clicks
    if (ad?._id) trackClick(ad._id);
    if (ad?.link) window.open(ad.link, "_blank");
  };

  if (!ad) return null;

  return (
    <div
      className="border rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:shadow-md transition"
      onClick={handleClick}
    >
      {/* Image with fallback */}
      <img
        src={
          !imageError
            ? ad.image || "/placeholder-ad.png"
            : "/placeholder-ad.png"
        }
        alt={ad.title || "Advertisement"}
        className="rounded mb-2 w-full h-40 object-cover"
        onError={() => setImageError(true)}
      />

      <h3 className="font-bold text-lg">{ad.title || "Untitled Ad"}</h3>
      <p className="text-sm text-gray-600">
        {ad.description || "No description provided."}
      </p>

      {ad.link && (
        <p className="text-blue-600 text-sm mt-2 hover:underline">
          Click to visit →
        </p>
      )}
    </div>
  );
}
