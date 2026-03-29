// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";
import axiosInstance from "../utils/axiosInstance";
import Sidebar from "../components/Sidebar";
import CommandPalette from "../components/CommandPalette";

import {
  FaBars,
  FaMoon,
  FaSun,
  FaRobot,
  FaTimes,
  FaBell,
  FaUserCircle,
  FaBriefcase,
  FaStore,
  FaHome,
  FaEnvelope,
  FaPlus,
  FaWallet,
  FaStar,
  FaArrowUp,
  FaCrown,
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

/* ============================================================
   STAT CARD
============================================================ */
function StatCard({ icon, label, value, growth, loading }) {
  return (
    <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <h3 className="mt-3 text-3xl font-bold">{loading ? "—" : value}</h3>
          {growth && (
            <p className="mt-2 text-xs flex items-center text-green-600 dark:text-green-400">
              <FaArrowUp className="mr-1" />
              +{growth}% this month
            </p>
          )}
        </div>
        <div className="text-gray-300 text-2xl">{icon}</div>
      </div>
    </div>
  );
}

/* ============================================================
   PROFILE STRENGTH
============================================================ */
function ProfileStrength({ percent }) {
  return (
    <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Profile Strength</h3>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border dark:border-slate-800">
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
   DASHBOARD LAYOUT
============================================================ */
const DashboardLayout = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const role = user?.role || "freelancer";

  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [collapsed, setCollapsed] = useState(localStorage.getItem("sidebarCollapsed") === "true");
  const [notifications, setNotifications] = useState(0);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletError, setWalletError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [activities, setActivities] = useState([]);
  const socket = useSocket();

  /* ================= THEME ================= */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  /* ================= SIDEBAR ================= */
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  /* ================= CLOSE PROFILE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      const MAX_RETRIES = 2;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const overviewResp = await axiosInstance.get("/dashboard/overview");
          const analyticsResp = await axiosInstance.get("/dashboard/analytics");

          if (!mounted) return;

          const overview = overviewResp?.data || {};
          const analyticsData = analyticsResp?.data || {};

          setStats(overview.stats || {});
          setActivities(overview.activities || []);
          setNotifications(overview.notifications || 0);
          setAnalytics(analyticsData || {});

          if (!overview.stats || typeof overview.stats.wallet !== "number") {
            setWalletError("Wallet information currently unavailable.");
          } else {
            setWalletError(null);
          }

          setError(null);
          break;
        } catch (err) {
          console.error("Dashboard layout load error:", err);

          if (attempt === MAX_RETRIES) {
            const message =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              "Unable to load dashboard data. Please try again.";
            setError(message);
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

  /* ================= SOCKET NOTIFICATIONS ================= */
  useEffect(() => {
    if (!socket) return;

    const updateNotification = (payload) => {
      setNotifications((prev) => prev + 1);
      setActivities((prev) => [
        { id: payload.id || Date.now(), message: payload.message || "New event", createdAt: new Date(), type: payload.type },
        ...prev,
      ]);
    };

    socket.on("notification:new", updateNotification);

    return () => {
      socket.off("notification:new", updateNotification);
    };
  }, [socket]);

  /* ================= AI ================= */
  const sendAI = async () => {
    if (!aiMessage.trim()) return;
    setLoadingAI(true);
    try {
      const { data } = await axiosInstance.post("/ai/assistant", { message: aiMessage });
      setAiReply(data.reply);
      setAiMessage("");
    } catch {
      setAiReply("AI temporarily unavailable.");
    } finally {
      setLoadingAI(false);
    }
  };

  /* ================= QUICK POST ================= */
  const handleQuickPostJob = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await axiosInstance.post("/jobs/create", formData, { headers: { "Content-Type": "multipart/form-data" } });
      e.target.reset();
      alert("Service published successfully");
    } catch {
      alert("Failed to publish");
    }
  };

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  if (!user) return null;

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-[#0b1120] transition-colors duration-300">

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onCollapseToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileMenu}
        setMobileOpen={setMobileMenu}
        onMobileClose={() => setMobileMenu(false)}
      />

      {/* MAIN */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>

        {/* TOPBAR */}
        <header className="sticky top-0 z-40 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shadow-sm">

          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition" onClick={() => setMobileMenu(!mobileMenu)}><FaBars /></button>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"><FaHome /> Home</button>
            <button onClick={() => navigate("/dashboard/messages")} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"><FaEnvelope /> Messages</button>
            <button onClick={() => navigate("/dashboard/marketplace")} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"><FaStore /> Marketplace</button>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button onClick={() => setDark(!dark)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition">{dark ? <FaSun /> : <FaMoon />}</button>

            <div className="relative">
              <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition"><FaBell /></button>
              {notifications > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow">{notifications}</span>}
            </div>

            {role !== "admin" && (
              <button onClick={() => setAiOpen(true)} className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:scale-105 transition"><FaRobot /></button>
            )}

            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!profileOpen)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"><FaUserCircle size={26} /></button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-2xl rounded-2xl p-2 text-sm">
                  <button onClick={() => navigate("/dashboard/profile")} className="block w-full text-left px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition">Profile</button>
                  <button onClick={() => navigate("/dashboard/settings")} className="block w-full text-left px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition">Settings</button>
                  <div className="border-t border-gray-200 dark:border-slate-700 my-2"></div>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 px-4 md:px-10 py-8 space-y-8 overflow-y-auto">

          {(error || walletError) && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <p>{walletError || error}</p>
                <button
                  onClick={() => setRetryCount((prev) => prev + 1)}
                  className="text-sm font-semibold underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* QUICK POST */}
          {role === "freelancer" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 p-6">
              <h2 className="flex items-center gap-2 mb-6 text-lg font-semibold"><FaPlus /> Publish Service</h2>
              <form onSubmit={handleQuickPostJob} className="grid md:grid-cols-2 gap-5">
                <input name="title" placeholder="Service Title" required className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 border dark:border-slate-700" />
                <textarea name="description" placeholder="Describe your service..." required className="md:col-span-2 h-28 resize-none px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 border dark:border-slate-700" />
                <input type="file" name="image" accept="image/*" className="md:col-span-2 text-sm" />
                <div className="md:col-span-2">
                  <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:scale-105 transition">Publish Now</button>
                </div>
              </form>
            </div>
          )}

          {/* STATS GRID */}
          <div className="grid lg:grid-cols-4 gap-6">
            <StatCard icon={<FaBriefcase />} label="Contracts" value={stats.contracts || 0} loading={loading} />
            <StatCard icon={<FaWallet />} label="Earnings" value={`₦${stats.earnings || 0}`} growth={analytics.earningsGrowth} loading={loading} />
            <StatCard icon={<FaEnvelope />} label="Proposals" value={stats.proposals || 0} loading={loading} />
            <StatCard icon={<FaStar />} label="Rating" value={stats.rating || "—"} loading={loading} />
          </div>

          {/* CHARTS */}
          <div className="grid lg:grid-cols-2 gap-8">
            <ChartCard title="Earnings Growth" data={analytics.monthlyEarnings || []} type="area" />
            <ChartCard title="Proposal Activity" data={analytics.monthlyProposals || []} type="line" />
            <ChartCard title="Job Performance" data={analytics.jobPerformance || []} type="bar" />
          </div>

          {/* PROFILE STRENGTH */}
          {role === "freelancer" && <ProfileStrength percent={stats.profileCompletion || 70} />}

          {/* ROUTED CONTENT */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 p-6">
            <Outlet />
          </div>

        </main>
      </div>

      {/* AI MODAL */}
      {aiOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 relative">
            <button onClick={() => setAiOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition"><FaTimes /></button>
            <h2 className="text-xl font-semibold mb-4">SkillAfrik AI Assistant</h2>
            <div className="h-64 overflow-y-auto bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 text-sm mb-4">
              {loadingAI ? "Thinking..." : aiReply || "Ask AI about pricing, proposals, portfolio, jobs..."}
            </div>
            <div className="flex gap-2">
              <input value={aiMessage} onChange={(e) => setAiMessage(e.target.value)} placeholder="Ask AI..." className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 border dark:border-slate-700" />
              <button onClick={sendAI} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">Send</button>
            </div>
          </div>
        </div>
      )}

      <CommandPalette />
    </div>
  );
};

export default DashboardLayout;