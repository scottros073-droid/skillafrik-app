import React from "react";
import { FaStar, FaFilter, FaSearch } from "react-icons/fa";
import ReviewCard from "../../components/Modern/ReviewCard";

export default function ReviewsPage() {
  const [filterRating, setFilterRating] = React.useState("all");

  const allReviews = [
    {
      clientName: "Sarah Williams",
      jobTitle: "React Dashboard Project",
      rating: 5,
      text: "Excellent work! The developer delivered exactly what we needed, on time and with great communication throughout the project. Highly recommended for future projects.",
      date: "2 weeks ago",
      tags: ["Great Communication", "On Time", "Quality Work"],
    },
    {
      clientName: "James Miller",
      jobTitle: "API Development",
      rating: 5,
      text: "Professional and skilled developer. Delivered a scalable solution that exceeded our expectations. Will definitely hire again.",
      date: "1 month ago",
      tags: ["Professional", "Scalable", "Expert"],
    },
    {
      clientName: "Emma Johnson",
      jobTitle: "UI Design",
      rating: 4,
      text: "Great design work. A few revisions needed but the designer was very responsive to feedback. Good attention to detail.",
      date: "6 weeks ago",
      tags: ["Responsive", "Creative"],
    },
    {
      clientName: "Michael Chen",
      jobTitle: "E-commerce Platform",
      rating: 5,
      text: "Outstanding work on the e-commerce platform. Clean code, great documentation, and excellent communication. Perfect for the job.",
      date: "2 months ago",
      tags: ["Documentation", "Clean Code"],
    },
    {
      clientName: "Lisa Anderson",
      jobTitle: "Mobile App Development",
      rating: 4,
      text: "Good work overall. Minor issues with the first draft but they were fixed quickly. Solid developer.",
      date: "3 months ago",
      tags: ["Quick Fixes"],
    },
  ];

  const filteredReviews =
    filterRating === "all"
      ? allReviews
      : allReviews.filter((review) => review.rating.toString() === filterRating);

  const averageRating = (
    allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length
  ).toFixed(1);

  const ratingCounts = {
    5: allReviews.filter((r) => r.rating === 5).length,
    4: allReviews.filter((r) => r.rating === 4).length,
    3: allReviews.filter((r) => r.rating === 3).length,
    2: allReviews.filter((r) => r.rating === 2).length,
    1: allReviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
        <p className="text-gray-600 mt-2">See what clients say about your work</p>
      </div>

      {/* Overall Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">{averageRating}</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={18}
                  className={i < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-2">Based on {allReviews.length} reviews</p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3 mb-4 last:mb-0">
              <button
                onClick={() => setFilterRating(rating.toString())}
                className="flex items-center gap-1 flex-shrink-0"
              >
                {rating}
                <FaStar size={14} className="text-yellow-400" />
              </button>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${(ratingCounts[rating] / allReviews.length) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 flex-shrink-0 w-12 text-right">
                {ratingCounts[rating]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <FaFilter size={16} />
            All Ratings
          </button>
          {filterRating !== "all" && (
            <button
              onClick={() => setFilterRating("all")}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((review, idx) => (
          <div key={idx}>
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">No reviews found</p>
        </div>
      )}
    </div>
  );
}
