import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import AIAnalytics from "./AIAnalytics";

export default function AIDashboard() {
  const { user } = useUser();
  const role = user?.role?.toLowerCase();
  const canSeeDesign = role === "freelancer";

  // Dummy data for example. Replace with real analytics from props or API
  const [aiStats, setAiStats] = useState({
    revenue: [
      { month: "January", amount: 12000 },
      { month: "February", amount: 15000 },
      { month: "March", amount: 18000 },
    ],
  });

  // Convert array of objects to CSV and trigger download
  const downloadCSV = (data) => {
    if (!data || !data.length) return alert("No data to download");

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    const csvContent = [headers, rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "ai_revenue.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">AI Tools</h1>

      {/* AI Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-2">⭐ AI Proposal Writer</h2>
          <p className="text-gray-500 text-sm">
            Generate perfect proposals: grammar, pricing, delivery time, skill summary, client greeting, bonus offer.
          </p>
          <p className="mt-2 text-indigo-600 font-semibold">
            ₦400 / $0.50 per proposal or ₦2,500/month unlimited
          </p>
        </div>

        {canSeeDesign && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="font-bold text-lg mb-2">⭐ AI Logo/Design Generator</h2>
            <p className="text-gray-500 text-sm">
              Logos, flyers, banners, thumbnails. Perfect for African freelancers.
            </p>
            <p className="mt-2 text-indigo-600 font-semibold">
              ₦800–₦1,500 per design or ₦3,000–₦5,000/month unlimited
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-2">⭐ AI CV/Resume Creator</h2>
          <p className="text-gray-500 text-sm">
            Professional CVs, cover letters, skills breakdown, PDF download.
          </p>
          <p className="mt-2 text-indigo-600 font-semibold">
            ₦1,500 per CV or ₦3,000–₦4,000 for packages
          </p>
        </div>
      </div>

      {/* Analytics */}
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-2xl font-bold">AI Analytics</h2>
        <button
          onClick={() => downloadCSV(aiStats.revenue)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Download Revenue CSV
        </button>
      </div>

      <AIAnalytics stats={aiStats} />
    </div>
  );
}
