import { FaStar } from "react-icons/fa";

export default function StarRating({ rating = 0, onRate, size = 20, className = "" }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate && onRate(star)}
          disabled={!onRate}
          className={`transition ${
            onRate ? "cursor-pointer hover:scale-110" : "cursor-default"
          } ${star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          <FaStar size={size} className={star <= rating ? "fill-current" : ""} />
        </button>
      ))}
    </div>
  );
}
