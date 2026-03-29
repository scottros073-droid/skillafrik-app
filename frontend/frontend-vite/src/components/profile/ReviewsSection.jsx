/**
 * ReviewsSection.jsx - Display client reviews and testimonials
 */

import React, { useEffect, useState } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { reviewAPI } from "../../services/apiService";
import { ListSkeleton } from "../Loaders";

export default function ReviewsSection({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewAPI.getReviews(userId);
        if (response.success) {
          setReviews(response.data || []);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchReviews();
    }
  }, [userId]);

  if (loading) return <ListSkeleton count={3} />;

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <FaQuoteLeft className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No reviews yet. Start building your reputation by completing projects!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Client Reviews ({reviews.length})
      </h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Reviewer Info */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold">
                {review.reviewer?.firstName?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {review.reviewer?.firstName} {review.reviewer?.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {review.reviewer?.role || "Client"}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {review.jobTitle && <span>{review.jobTitle}</span>}
                </p>
              </div>
            </div>

            {/* Review Text */}
            {review.comment && (
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                "{review.comment}"
              </p>
            )}

            {/* Review Date */}
            {review.createdAt && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
