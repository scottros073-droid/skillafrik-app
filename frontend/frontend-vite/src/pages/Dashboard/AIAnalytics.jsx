import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function AIAnalytics() {
  const [aiStats, setAiStats] = useState({
    dailyProposals: [],
    dailyDesigns: [],
    dailyCVs: [],
    revenue: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIStats = async () => {
      try {
        const res = await axios.get("/admin/ai/stats", {
          headers: { Authorization: localStorage.getItem("adminToken") },
        });
        setAiStats(res.data);
      } catch (err) {
        console.error("AI stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAIStats();
  }, []);

  if (loading) return <p className="text-gray-500 text-center">Loading AI analytics...</p>;

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-4">AI Tools Analytics</h2>

      {/* Daily Proposal Usage */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Daily Proposal Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={aiStats.dailyProposals}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="Proposals Generated" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Design Usage */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Daily Design Generation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={aiStats.dailyDesigns}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="Designs Generated" stroke="#f59e0b" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily CV Usage */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Daily CV/Resume Generation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={aiStats.dailyCVs}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="CVs Generated" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Revenue */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">AI Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aiStats.revenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" name="Revenue ₦" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
