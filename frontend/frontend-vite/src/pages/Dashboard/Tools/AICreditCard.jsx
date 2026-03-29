// frontend/src/pages/Dashboard/Tools/AICreditCard.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { FaRobot, FaPenFancy, FaPaintBrush } from "react-icons/fa";

export default function AICreditCard({ type, user }) {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const typeLabels = {
    proposal: "AI Proposal Credits",
    design: "AI Design Credits",
    cv: "AI CV Credits",
  };

  const typeIcons = {
    proposal: <FaRobot className="text-indigo-600 text-4xl mx-auto mb-2" />,
    design: <FaPaintBrush className="text-indigo-600 text-4xl mx-auto mb-2" />,
    cv: <FaPenFancy className="text-indigo-600 text-4xl mx-auto mb-2" />,
  };

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/ai/credits/${type}`);
      setCredits(res.data.credits || 0);
    } catch (err) {
      console.error(`Failed to fetch AI ${type} credits:`, err);
      setCredits(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [type]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 text-center">
      {typeIcons[type]}
      <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
        {typeLabels[type]}
      </h3>

      <p className="text-3xl font-extrabold text-indigo-600">
        {loading ? (
          <span className="animate-pulse">...</span>
        ) : (
          credits
        )}
      </p>

      <p
        className={`text-sm mt-1 ${
          credits > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {credits > 0 ? "Credits available" : "No credits left"}
      </p>
    </div>
  );
}
