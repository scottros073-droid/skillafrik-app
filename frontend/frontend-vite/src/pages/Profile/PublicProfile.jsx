// frontend/src/pages/Profile/PublicProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "../../utils/axios";

// ========================
// Badge Component
// ========================
function Badge({ children, color = "indigo" }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    indigo: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
}

// ========================
// Stat Component
// ========================
function Stat({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-gray-500 mt-1">{label}</p>
    </div>
  );
}

// ========================
// Public Profile Component
// ========================
export default function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/public-profile/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Profile not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading)
    return <p className="p-10 text-center text-gray-500">Loading profile…</p>;

  if (error)
    return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <img
          src={profile.avatar || "/avatar.png"}
          alt={`${profile.firstName} ${profile.lastName}`}
          className="w-36 h-36 rounded-full object-cover border shadow"
        />
        <div className="flex-1">
          {/* Name + Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {profile.firstName} {profile.lastName}
            </h1>
            {profile.isVerified && <Badge color="green">✔ Verified</Badge>}
            {profile.isPremium && <Badge color="yellow">⭐ Premium</Badge>}
          </div>

          <p className="text-gray-500 dark:text-gray-300 mb-1">{profile.title || "Freelancer"}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <FaStar className="text-yellow-400" />
            <span className="text-gray-700 dark:text-gray-200">{profile.rating || 0} ★</span>
          </div>

          {/* Trust Score */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Trust Score: {profile.trustScore || 0}/100
          </p>
        </div>
      </div>

      {/* Bio & Purpose */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">About Me</h2>
        <p className="text-gray-600 dark:text-gray-300">{profile.bio || "This freelancer has not added a bio yet."}</p>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-4">Purpose</h3>
        <p className="text-gray-600 dark:text-gray-300">{profile.purpose || "No purpose specified."}</p>
      </div>

      {/* Skills */}
      {profile.skills?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Stat label="Active Jobs" value={profile.activeJobs || 0} />
        <Stat label="Earnings" value={`₦${profile.earnings || 0}`} />
        <Stat label="Rating" value={`${profile.rating || 0} ★`} />
        <Stat label="Wallet" value={`₦${profile.wallet?.balance || 0}`} />
      </div>

      {/* Hire Button */}
      <div className="text-center mt-6">
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-500 transition shadow-lg">
          Hire {profile.firstName}
        </button>
      </div>
    </div>
  );
}
