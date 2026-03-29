import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

export default function AICreditCard({ type }) {
  const [credits, setCredits] = useState({ allowed: false, remaining: 0 });

  const fetchCredits = async () => {
    const res = await axios.get(`/ai/check/${type}`);
    setCredits(res.data);
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="text-gray-600 dark:text-gray-300 capitalize">{type} Credits</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {credits.remaining === "unlimited" ? "∞" : credits.remaining}
        </p>
      </div>
      {!credits.allowed && (
        <button
          onClick={() => alert("Please pay to add credits")}
          className="bg-primary px-4 py-2 rounded text-white hover:bg-accent"
        >
          Buy
        </button>
      )}
    </div>
  );
}
