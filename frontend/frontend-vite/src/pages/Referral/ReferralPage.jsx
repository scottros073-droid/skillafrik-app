import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";

const ReferralPage = () => {
  const [referral, setReferral] = useState(null);
  const [invited, setInvited] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =======================
  // Fetch referral info
  // =======================
  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const res = await axios.get("/referrals/me");
        setReferral(res.data);
        setInvited(res.data.invites || 0);
      } catch (err) {
        console.error("Failed to fetch referral info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferral();
  }, []);

  // =======================
  // Invite a friend
  // =======================
  const handleInvite = async () => {
    try {
      const res = await axios.post("/referral/invite");
      setInvited(res.data.invited);
      setMessage(
        res.data.rewardAdded
          ? "🎉 You earned $100 reward!"
          : "Friend invited successfully!"
      );
    } catch (err) {
      console.error(err);
      setMessage("❌ Error inviting friend");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading referral info...</p>
      </div>
    );
  }

  const progress = Math.min(invited, 3);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Referrals
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Invite friends to SkillAfrik and earn rewards when they start hiring or selling.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wide">
              Active referrals
            </p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {invited}
            </p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
            Your referral link
          </p>
          <div className="flex flex-col sm:flex-row">
            <input
              readOnly
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none flex-1 text-sm"
              value={`${window.location.origin}/signup?ref=${referral.code}`}
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none text-sm font-medium hover:bg-indigo-500"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/signup?ref=${referral.code}`
                )
              }
            >
              Copy link
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Progress to next reward
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all"
              style={{ width: `${(progress / 3) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {progress} / 3 successful referrals
          </p>
        </div>

        {/* Reward */}
        {progress >= 3 ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm">
            🎉 Congratulations! You unlocked your reward.
          </div>
        ) : (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg text-sm">
            Invite {3 - progress} more friend(s) to unlock your next reward.
          </div>
        )}

        {/* Invite Button */}
        <div className="mt-4">
          <button
            onClick={handleInvite}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500"
          >
            Invite a friend
          </button>
        </div>

        {/* Message */}
        {message && (
          <p className="mt-3 font-semibold text-sm text-gray-800 dark:text-gray-200">
            {message}
          </p>
        )}
      </div>

      {/* Referral history (if backend later provides it) */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Referral history
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          As your invited friends start using SkillAfrik, their activity and rewards will
          appear here.
        </p>
      </div>
    </div>
  );
};

export default ReferralPage;
