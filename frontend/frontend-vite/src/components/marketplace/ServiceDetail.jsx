import React from "react";

export default function ServiceDetail({ service = {}, onBack, onHireNow, onMessage }) {
  const safeService = service || {};
  const freelancer = safeService.freelancer || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <button onClick={onBack} className="text-sm text-indigo-600 dark:text-indigo-400">
            ← Back to services
          </button>
          <span className="text-xs text-gray-500">Service ID: {safeService._id || "-"}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2">
            <img
              src={safeService.coverImage || freelancer.avatar || "/default-service.png"}
              alt={safeService.title || "Service"}
              className="w-full h-64 object-cover rounded-lg mb-4"
              onError={(e) => { e.target.src = "/default-service.png"; }}
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {safeService.title || "Untitled service"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {safeService.description || "No description provided for this service."}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 border rounded-full border-gray-300 dark:border-gray-600">Category: {safeService.category || "N/A"}</span>
              <span className="px-2 py-1 border rounded-full border-gray-300 dark:border-gray-600">Delivery: {safeService.deliveryTime ?? "—"} days</span>
              <span className="px-2 py-1 border rounded-full border-gray-300 dark:border-gray-600">Price: ₦{safeService.price ?? 0}</span>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Freelancer</h3>
              <div className="flex items-center gap-3">
                <img
                  src={freelancer.avatar || "/default-avatar.png"}
                  alt={freelancer.firstName || freelancer.name || "Freelancer"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {freelancer.firstName || freelancer.name || "Unknown"} {freelancer.lastName || ""}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{freelancer.title || freelancer.role || "Freelancer"}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onHireNow?.(safeService)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500"
                type="button"
              >
                Hire Now
              </button>
              <button
                onClick={() => onMessage?.(safeService)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                type="button"
              >
                Message Freelancer
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
