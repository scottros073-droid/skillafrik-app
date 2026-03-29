import { FaUserCircle } from "react-icons/fa";
import StarRating from "./StarRating";
import Card from "./ui/Card";

export default function ReviewList({ reviews = [], showHeader = true }) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <FaUserCircle className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {showHeader && (
        <div className="mb-6 flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {averageRating.toFixed(1)}
              </span>
              <StarRating rating={Math.round(averageRating)} size={20} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id || review.id}>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold shrink-0">
                {review.reviewerId?.firstName?.charAt(0) ||
                  review.reviewer?.firstName?.charAt(0) ||
                  "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {review.reviewerId?.firstName ||
                        review.reviewer?.firstName ||
                        "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatDate(review.createdAt || review.date)}
                    </p>
                  </div>
                  <StarRating rating={review.rating || 0} size={16} />
                </div>
                {review.comment && (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
