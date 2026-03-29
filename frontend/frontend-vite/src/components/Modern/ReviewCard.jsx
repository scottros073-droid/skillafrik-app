import React from "react";
import { FaStar, FaCalendarAlt } from "react-icons/fa";

export default function ReviewCard({ review }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        size={16}
        className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900">{review.clientName}</h4>
          <p className="text-xs text-gray-500 mt-1">{review.jobTitle}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">{renderStars(review.rating)}</div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <FaCalendarAlt size={12} />
            {review.date}
          </p>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-sm line-clamp-3">{review.text}</p>

      {/* Tags */}
      {review.tags && (
        <div className="flex flex-wrap gap-2 mt-4">
          {review.tags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
