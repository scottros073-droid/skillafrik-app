// frontend/frontend-vite/src/pages/Gamification/LeaderboardPage.jsx
import { useState, useEffect } from "react";
import { getWeeklyLeaderboard } from "../../services/gamificationService";
import { FaTrophy, FaMedal, FaAward, FaFire, FaStar } from "react-icons/fa";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getWeeklyLeaderboard();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      setError("Failed to load leaderboard");
      console.error("Leaderboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-500 text-xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaAward className="text-amber-600 text-xl" />;
      default:
        return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Weekly Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Top performers from the last 7 days
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h2 className="text-white text-xl font-semibold text-center">
              🏆 Hall of Fame 🏆
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.user.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${getRankColor(entry.rank)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(entry.rank)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {entry.user.firstName} {entry.user.lastName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <FaStar className="mr-1 text-yellow-500" />
                          Level {entry.user.level}
                        </span>
                        <span className="flex items-center">
                          <FaFire className="mr-1 text-orange-500" />
                          {entry.currentStreak} day streak
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {entry.xp.toLocaleString()} XP
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.completedJobs} jobs • ₦{entry.earnings.toLocaleString()}
                    </div>
                  </div>
                </div>

                {entry.user.badges && entry.user.badges.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.user.badges.slice(0, 3).map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                    {entry.user.badges.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        +{entry.user.badges.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <FaTrophy className="mx-auto text-4xl mb-4 opacity-50" />
              <p>No leaderboard data available yet.</p>
              <p className="text-sm">Complete jobs and earn XP to appear here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}