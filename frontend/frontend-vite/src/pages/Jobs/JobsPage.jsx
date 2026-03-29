// 📁 frontend/src/pages/Jobs/JobsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { getJobs } from "../../services/jobService";
import { SafeImage } from "../../components/ui/SafeMedia";

const JOB_PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("best");
  const [search, setSearch] = useState("");
  const [alertsOn, setAlertsOn] = useState(true);

  const { user } = useUser();

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch jobs. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((job) => {
        const title = job.title || "";
        const desc = job.description || "";
        return (
          title.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q)
        );
      });
    }

    // Tabs are mostly presentational for now – we keep logic simple to avoid backend changes
    if (activeTab === "recent") {
      result.sort((a, b) => {
        const da = new Date(a.createdAt || a.date || 0).getTime();
        const db = new Date(b.createdAt || b.date || 0).getTime();
        return db - da;
      });
    }

    return result;
  }, [jobs, search, activeTab]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Feed</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Discover work that matches your skills and interests.
          </p>
        </div>
        {user && (
          <Link
            to="/dashboard/hire/post-job"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition text-sm font-medium"
          >
            Post a Job
          </Link>
        )}
      </div>

      {/* Search + alerts */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Search jobs
            </span>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, skills, or description…"
            className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>
        <div className="min-w-[220px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
              Job alerts
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Get notified when new jobs match your skills.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAlertsOn((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              alertsOn ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                alertsOn ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6 text-sm">
          {[
            { id: "best", label: "Best Matches" },
            { id: "recent", label: "Most Recent" },
            { id: "feed", label: "My Feed" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-1 pb-3 font-medium ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

      {loading ? (
        <p className="p-6 text-center text-gray-500 dark:text-gray-400">
          Loading jobs...
        </p>
      ) : filteredJobs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No open jobs match your filters yet. Try changing your search or tabs.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <li
              key={job._id}
              className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
            >
              <SafeImage
                src={job.image || JOB_PLACEHOLDER_IMAGE}
                alt={job.title}
                className="w-full h-36 object-cover"
                fallback="/public/default.png"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-base md:text-lg text-gray-900 dark:text-white">
                  {job.title}
                </h3>
                {job.category && (
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    {job.category}
                  </p>
                )}
                {job.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm line-clamp-3">
                    {job.description}
                  </p>
                )}
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Budget: ${Number(job.budget || 0).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  {job.skills &&
                    Array.isArray(job.skills) &&
                    job.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                  {job.clientRating && (
                    <span>⭐ {Number(job.clientRating).toFixed(1)} client rating</span>
                  )}
                </div>
                <div className="mt-3">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="inline-block text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  >
                    View Details
                  </Link>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {job.paymentVerified && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                      Payment verified
                    </span>
                  )}
                  {job.country && <span>{job.country}</span>}
                  {typeof job.proposalCount === "number" && (
                    <span>{job.proposalCount} proposals</span>
                  )}
                  {job.createdAt && (
                    <span>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
