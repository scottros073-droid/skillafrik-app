import React from "react";

export default function ServiceCard({ service, onViewDetails, onHireNow, onMessage }) {
  const safeService = service || {};
  const freelancer = safeService.freelancer || {};

  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition p-5 flex flex-col h-full">
      <div className="flex-1">
        <img
          src={safeService.coverImage || freelancer.avatar || "/default-service.png"}
          alt={safeService.title || "Service"}
          className="h-40 w-full object-cover rounded-lg mb-4"
          onError={(e) => { e.target.src = "/default-service.png"; }}
        />

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {safeService.title || "Untitled service"}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {safeService.description || "No description available."}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 rounded-full">
            {safeService.category || "General"}
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full">
            {safeService.deliveryTime ? `${safeService.deliveryTime} days` : "Delivery TBD"}
          </span>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {freelancer.firstName || freelancer.name || "Freelancer"}{' '}
          {freelancer.lastName || ""}
        </div>

        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-300">
          ₦{safeService.price ?? 0}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => onViewDetails?.(safeService)}
          className="px-3 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
          type="button"
        >
          View
        </button>
        <button
          onClick={() => onHireNow?.(safeService)}
          className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
          type="button"
        >
          Hire Now
        </button>
        <button
          onClick={() => onMessage?.(safeService)}
          className="col-span-2 mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          type="button"
        >
          Message Freelancer
        </button>
      </div>
    </article>
  );
}
