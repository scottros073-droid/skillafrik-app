import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRobot, FaBriefcase, FaCoins, FaInfoCircle } from "react-icons/fa";
import { getMatchedJobs } from "../../services/skillMatchService";

export default function MatchedJobsCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    getMatchedJobs()
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setErr("");
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setErr(e.response?.data?.message || "Could not load matched jobs.");
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
          <FaRobot /> AI Skill Matcher
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading your top matched jobs...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
          <FaRobot /> AI Skill Matcher
        </h2>
        <p className="mt-2 text-red-500">{err}</p>
      </div>
    );
  }

  const matches = data?.matches || [];
  const usageToday = data?.usageToday ?? 0;
  const limit = data?.limit ?? 3;
  const limitReached = data?.limitReached === true;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
          <FaRobot /> Your top 3 matched jobs
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {usageToday}/{limit} matches used today
          {data?.limitReached && (
            <span className="ml-1 text-amber-600 dark:text-amber-400">(limit reached)</span>
          )}
        </span>
      </div>

      {limitReached && usageToday >= limit && (
        <p className="mb-4 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
          Free plan: 3 job matches per day. Upgrade for unlimited matches.
        </p>
      )}

      {matches.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No open jobs match your skills right now. Add more skills in your profile or try again later.
        </p>
      ) : (
        <ul className="space-y-4">
          {matches.map((m, i) => (
            <li
              key={m.job?._id || i}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {m.job?.title || "Untitled job"}
                  </h3>
                  {m.job?.category && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <FaBriefcase className="flex-shrink-0" /> {m.job.category}
                    </p>
                  )}
                  {m.reason && (
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 flex items-start gap-1 mt-1">
                      <FaInfoCircle className="flex-shrink-0 mt-0.5" /> {m.reason}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {m.job?.budget != null && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                      <FaCoins /> ₦{Number(m.job.budget).toLocaleString()}
                    </span>
                  )}
                  {m.job?._id && (
                    <Link
                      to={`/dashboard/jobs`}
                      state={{ highlightJobId: m.job._id }}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                    >
                      View job →
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/dashboard/jobs"
        className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
      >
        Browse all jobs →
      </Link>
    </div>
  );
}
