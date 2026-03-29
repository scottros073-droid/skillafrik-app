import { useState } from "react";
import StarRating from "./StarRating";
import axiosInstance from "../utils/axiosInstance";
import Card from "./ui/Card";

export default function ReviewForm({ workerId, jobId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitReview = async () => {
    if (!rating) {
      setError("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const payload = { rating, comment };
      if (workerId) payload.workerId = workerId;
      if (jobId) payload.jobId = jobId;

      await axiosInstance.post("/reviews", payload);
      setRating(0);
      setComment("");
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Write a Review
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rating
        </label>
        <StarRating rating={rating} onRate={setRating} size={28} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience working with this freelancer..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {comment.length}/500 characters
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={submitReview}
        disabled={loading || !rating || !comment.trim()}
        className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </Card>
  );
}
