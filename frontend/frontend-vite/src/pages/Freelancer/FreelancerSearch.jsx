import { useState, useEffect } from "react";
import { FaStar, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";

// ============================
// Badge Component
// ============================
function Badge({ children, color = "indigo" }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    indigo: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span className={`px-2 py-1 text-xs font-bold rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
}

// ============================
// Freelancer Search Component
// ============================
export default function FreelancerSearch() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [minRating, setMinRating] = useState("");

  const categories = [
    "Web Development",
    "Graphic Design",
    "Marketing & SEO",
    "Content Writing",
    "Mobile Apps",
    "Other Skills",
  ];

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (query) params.keyword = query;
      if (skillFilter) params.skill = skillFilter;
      if (minRating) params.minRating = minRating;

      const res = await axios.get("/freelancers", { params });
      setFreelancers(res.data);
    } catch (err) {
      console.error("Failed to fetch freelancers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [query, skillFilter, minRating]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search freelancers..."
          className="flex-1 p-3 rounded-lg border shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="p-3 rounded-lg border"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        >
          <option value="">All Skills</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="p-3 rounded-lg border"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="">Min Rating</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} ★ & up</option>
          ))}
        </select>
      </div>

      {/* Freelancer Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading freelancers…</p>
      ) : freelancers.length === 0 ? (
        <p className="text-center text-gray-500">No freelancers found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((f) => (
            <div
              key={f._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col"
            >
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={f.avatar || "/avatar.png"}
                  alt={`${f.firstName} ${f.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  {/* Name + Badges */}
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-lg">{f.firstName} {f.lastName}</h2>
                    {f.isVerified && <Badge color="green">✔ Verified</Badge>}
                    {f.isPremium && <Badge color="yellow">⭐ Premium</Badge>}
                  </div>

                  {/* Title */}
                  <p className="text-gray-500 text-sm">{f.title || "Freelancer"}</p>

                  {/* Trust Score */}
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <FaShieldAlt className="text-indigo-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Trust Score: {f.trustScore || 0}/100
                    </span>
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {f.skills?.slice(0, 5).map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <FaStar className="text-yellow-400" />
                <span className="font-semibold">{f.averageRating || 0}</span>
                <span className="text-gray-500 text-sm">({f.totalReviews || 0} reviews)</span>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-gray-500 text-sm mb-4">
                <span>Jobs: {f.completedJobs || 0}</span>
                <span>Earnings: ₦{f.wallet?.totalEarned || 0}</span>
              </div>

              {/* View Profile Button */}
              <Link
                to={`/freelancer/${f._id}`}
                className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded-lg text-center hover:bg-indigo-500 transition"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
