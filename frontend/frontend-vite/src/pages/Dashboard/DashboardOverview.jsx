import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaWallet,
  FaEnvelope,
  FaBriefcase,
  FaStar,
  FaRobot,
  FaBell,
  FaCrown,
  FaArrowUp,
  FaRedo,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { StatsSkeleton, ListSkeleton } from "../../components/Loaders";

/* ============================================================
   STAT CARD
============================================================ */
function StatCard({ icon, label, value, growth, loading }) {
  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <h3 className="mt-3 text-3xl font-bold">{loading ? "—" : value}</h3>
        {growth && (
          <p className="mt-2 text-xs flex items-center text-green-600 dark:text-green-400">
            <FaArrowUp className="mr-1" /> +{growth}% this month
          </p>
        )}
      </div>
      <div className="text-gray-300 dark:text-gray-400 text-2xl">{icon}</div>
    </div>
  );
}

/* ============================================================
   PROFILE STRENGTH
============================================================ */
function ProfileStrength({ percent }) {
  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Profile Strength</h3>
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
        <div
          className="bg-black dark:bg-white h-3 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
        {percent}% complete — Complete profile to rank higher.
      </p>
    </div>
  );
}

/* ============================================================
   CHART CARD
============================================================ */
function ChartCard({ title, data, type }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border dark:border-slate-700">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        {type === "area" && (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#000" fill="#000" />
          </AreaChart>
        )}
        {type === "line" && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#000" />
          </LineChart>
        )}
        {type === "bar" && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#000" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

/* ============================================================
   MAIN DASHBOARD
============================================================ */
export default function DashboardOverview() {
  const { user } = useUser();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletError, setWalletError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [aiInsights, setAiInsights] = useState("");

  /* ============================================================
     LOAD DASHBOARD DATA
  ============================================================ */
  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        const message = "Authentication token is missing. Please login again.";
        setError(message);
        toast.error(message);
        setLoading(false);
        return;
      }

      const MAX_RETRIES = 2;
      const endpoint = user?.role === "admin" ? "/admin/overview" : "/dashboard/overview";

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const overviewResp = await axiosInstance.get(endpoint);
          const analyticsResp = await axiosInstance.get("/dashboard/analytics");

          if (!mounted) return;

          const overview = overviewResp?.data || {};
          const analyticsData = analyticsResp?.data || {};

          setStats(overview.stats || {});
          setActivities(overview.activities || []);
          setNotifications(overview.notifications || []);
          setAnalytics(analyticsData || {});
          generateDynamicAI(overview.stats || {});

          if (typeof overview.stats?.wallet !== "number") {
            setWalletError("Wallet information currently unavailable. Please refresh.");
          } else {
            setWalletError(null);
          }

          axiosInstance.post("/notifications/generate-smart").catch((err) => {
            console.error("Failed to generate smart notifications:", err);
          });

          setError(null);
          toast.success("Dashboard data loaded successfully.");
          break;
        } catch (err) {
          console.error("Dashboard load error (attempt", attempt + 1, "):", err);

          const userMessage =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Unable to load dashboard; please try again later.";

          if (attempt === MAX_RETRIES) {
            setError(userMessage);
            toast.error(userMessage);
          } else {
            await new Promise((resolve) => setTimeout(resolve, 900));
          }
        }
      }

      if (mounted) setLoading(false);
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [user, retryCount]);

  /* ============================================================
     DYNAMIC AI INSIGHTS
  ============================================================ */
  const generateDynamicAI = (statsData) => {
    let insight = "";
    if (user?.role === "freelancer") {
      if ((statsData.proposals || 0) > 20 && (statsData.contracts || 0) < 5)
        insight =
          "High proposal volume but low win rate. Improve proposal personalization.";
      else if ((statsData.earnings || 0) > 100000)
        insight =
          "Strong earnings momentum. Consider upgrading to Premium for visibility boost.";
      else insight = "Optimize your profile keywords and update portfolio samples.";
    } else if (user?.role === "client") {
      insight =
        "Post detailed job descriptions to attract higher quality freelancers.";
    } else if (user?.role === "admin") {
      insight =
        "Platform growth stable. Monitor freelancer-to-client conversion ratio.";
    }
    setAiInsights(insight);
  };

  /* ============================================================
     ROLE-BASED STAT CARDS
  ============================================================ */
  const renderStats = () => {
    if (user?.role === "admin") {
      return (
        <>
          <StatCard
            icon={<FaWallet />}
            label="Platform Revenue"
            value={`₦${stats.totalRevenue || 0}`}
            growth={analytics.revenueGrowth}
            loading={loading}
          />
          <StatCard
            icon={<FaBriefcase />}
            label="Active Jobs"
            value={stats.activeJobs || 0}
            loading={loading}
          />
          <StatCard
            icon={<FaStar />}
            label="Total Users"
            value={stats.totalUsers || 0}
            loading={loading}
          />
        </>
      );
    }

    return (
      <>
        <StatCard
          icon={<FaWallet />}
          label="Earnings"
          value={`₦${stats.earnings || 0}`}
          growth={analytics.earningsGrowth}
          loading={loading}
        />
        <StatCard
          icon={<FaEnvelope />}
          label="Proposals"
          value={stats.proposals || 0}
          loading={loading}
        />
        <StatCard
          icon={<FaBriefcase />}
          label="Contracts"
          value={stats.contracts || 0}
          loading={loading}
        />
        <StatCard
          icon={<FaStar />}
          label="Rating"
          value={stats.rating || "—"}
          loading={loading}
        />
      </>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        Checking authentication and loading your dashboard...
      </div>
    );
  }

  /* ============================================================
     RENDER DASHBOARD
  ============================================================ */
  return (
    <div className="space-y-10 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </h1>
            <button
              onClick={() => setRetryCount((prev) => prev + 1)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-sm"
            >
              <FaRedo />
              Refresh
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            SkillAfrik AI Analytics Dashboard
          </p>
          {(error || walletError) && !loading && (
            <div className="mt-3 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-300">
              <div className="flex justify-between items-center gap-3">
                <span>{error || walletError}</span>
                <button
                  className="text-sm underline text-red-700 dark:text-red-300"
                  onClick={() => {
                    setRetryCount((prev) => prev + 1);
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="relative p-3 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl shadow">
          <FaBell />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* STAT CARDS */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {renderStats()}
        </div>
      )}

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {user?.role === "freelancer" && (
          <>
            <ChartCard title="Earnings Growth" data={analytics.monthlyEarnings || []} type="area" />
            <ChartCard title="Proposal Activity" data={analytics.monthlyProposals || []} type="line" />
          </>
        )}
        {user?.role === "client" && (
          <ChartCard title="Job Performance" data={analytics.jobPerformance || []} type="bar" />
        )}
        {user?.role === "admin" && (
          <ChartCard title="Platform Revenue" data={analytics.platformRevenue || []} type="area" />
        )}
      </div>

      {/* PROFILE STRENGTH */}
      {user?.role === "freelancer" && <ProfileStrength percent={stats.profileCompletion || 70} />}

      {/* AI INSIGHTS */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <FaRobot />
          <h3 className="font-semibold">Smart AI Insights</h3>
        </div>
        <p className="text-sm opacity-90">{aiInsights}</p>
      </div>

      {/* SUBSCRIPTION */}
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Subscription Plan</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.premium ? "Premium Active" : "Free Plan"}
          </p>
        </div>
        {user?.premium ? (
          <FaCrown className="text-yellow-500 text-2xl" />
        ) : (
          <button
            onClick={() => navigate("/pricing")}
            className="bg-black text-white px-5 py-2 rounded-xl"
          >
            Upgrade
          </button>
        )}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        {loading ? (
          <ListSkeleton count={4} />
        ) : activities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity yet. Keep working and you’ll see updates here.</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((item, i) => (
              <li
                key={i}
                className="flex justify-between text-sm text-gray-600 dark:text-gray-300 border-b pb-2 last:border-0"
              >
                <span>{item.title || item.message || item.text || "Activity"}</span>
                <span className="text-gray-400 dark:text-gray-500">{item.date ? new Date(item.date).toLocaleString() : item.time || "—"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}