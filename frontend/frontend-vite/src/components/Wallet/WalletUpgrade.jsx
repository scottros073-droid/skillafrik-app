import React, { useState } from "react";
import axiosInstance from "../../utils/axios";

export default function WalletUpgrade({ user, refreshUser }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (type) => {
    if (!window.confirm(`Pay wallet to upgrade to ${type}?`)) return;

    try {
      setLoading(true);
      const res = await axiosInstance.post("/payment/upgrade", { type });
      alert(res.data.message || "Upgrade successful!");
      refreshUser(); // reload wallet balance & badges
    } catch (err) {
      alert(err.response?.data?.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {!user?.isVerified && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
          disabled={loading}
          onClick={() => handleUpgrade("verified")}
        >
          {loading ? "Processing..." : "Upgrade to Verified (₦500)"}
        </button>
      )}

      {!user?.isPremium && (
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400 disabled:opacity-50"
          disabled={loading}
          onClick={() => handleUpgrade("premium")}
        >
          {loading ? "Processing..." : "Upgrade to Premium (₦2000)"}
        </button>
      )}

      {user?.isVerified && user?.isPremium && (
        <p className="text-green-600 font-semibold mt-2">
          You already have all upgrades!
        </p>
      )}
    </div>
  );
}
