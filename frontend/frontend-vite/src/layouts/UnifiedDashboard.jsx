// src/layouts/UnifiedDashboard.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import CommandPalette from "../components/CommandPalette";

import {
  FaBars,
  FaMoon,
  FaSun,
  FaRobot,
  FaPalette,
  FaTimes,
  FaBell,
  FaUserCircle,
  FaBriefcase,
  FaStore,
  FaPlus,
} from "react-icons/fa";

const UnifiedDashboard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebarCollapsed") === "true");
  const [notifications, setNotifications] = useState(0);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const role = user?.role || "freelancer";

  /* ================= THEME ================= */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  /* ================= LOAD NOTIFICATIONS ================= */
  useEffect(() => {
    if (!user) return;

    async function load() {
      try {
        const { data } = await axiosInstance.get("/dashboard/meta");
        setNotifications(data.notifications || 0);
      } catch (err) {}
    }

    load();
  }, [user]);

  /* ================= AI ================= */
  const sendAI = async () => {
    if (!aiMessage.trim()) return;
    setLoadingAI(true);
    try {
      const { data } = await axiosInstance.post("/ai/assistant", {
        message: aiMessage,
      });
      setAiReply(data.reply);
      setAiMessage("");
    } catch {
      setAiReply("AI temporarily unavailable.");
    } finally {
      setLoadingAI(false);
    }
  };

  /* ================= JOB POST (FREELANCER MARKETPLACE) ================= */
  const handleQuickPostJob = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      await axiosInstance.post("/jobs/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Job posted successfully");
      form.reset();
    } catch {
      alert("Failed to post job");
    }
  };

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-[#0b1120]">

      {/* ================= SIDEBAR ================= */}
      <Sidebar collapsed={collapsed} onCollapseToggle={() => setCollapsed(!collapsed)} />

      <div className={`flex-1 flex flex-col ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>

        {/* ================= TOPBAR ================= */}
        <header className="sticky top-0 h-16 bg-white dark:bg-slate-900 border-b flex items-center justify-between px-4 md:px-6">

          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              <FaBars />
            </button>

            <Breadcrumbs />
          </div>

          <div className="flex items-center gap-4 md:gap-6">

            <button onClick={() => navigate("/dashboard/jobs")} className="hidden md:flex items-center gap-2 text-sm">
              <FaBriefcase /> Jobs
            </button>

            <button onClick={() => navigate("/dashboard/marketplace")} className="hidden md:flex items-center gap-2 text-sm">
              <FaStore /> Marketplace
            </button>

            <button onClick={() => setDark(!dark)}>
              {dark ? <FaSun /> : <FaMoon />}
            </button>

            <div className="relative">
              <FaBell />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {notifications}
                </span>
              )}
            </div>

            <button
              onClick={() => setAiOpen(true)}
              className="p-2 rounded-full bg-indigo-600 text-white"
            >
              <FaRobot />
            </button>

            {/* PROFILE DROPDOWN */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}>
                <FaUserCircle size={22} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 shadow-lg rounded-xl p-2 text-sm">
                  <button onClick={() => navigate("/dashboard/profile")} className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                    Profile
                  </button>
                  <button onClick={() => navigate("/dashboard/settings")} className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                    Settings
                  </button>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 p-4 md:p-6 space-y-8">

          {/* FREELANCER QUICK POST */}
          {role === "freelancer" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
                <FaPlus /> Post Service / Job
              </h2>

              <form onSubmit={handleQuickPostJob} className="space-y-4">
                <input
                  name="title"
                  placeholder="Service Title"
                  required
                  className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800"
                />
                <textarea
                  name="description"
                  placeholder="Describe your service..."
                  required
                  className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800"
                />
                <input type="file" name="image" accept="image/*" />
                <button className="bg-black text-white px-6 py-2 rounded-xl">
                  Publish
                </button>
              </form>
            </div>
          )}

          {/* PAGE ROUTE CONTENT */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ================= AI MODAL ================= */}
      {aiOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 relative">

            <button onClick={() => setAiOpen(false)} className="absolute top-4 right-4">
              <FaTimes />
            </button>

            <h2 className="text-xl font-bold mb-4 dark:text-white">
              SkillAfrik AI Hub
            </h2>

            <div className="h-64 overflow-y-auto border rounded-xl p-4 mb-4 text-sm dark:text-gray-200">
              {loadingAI ? "Thinking..." : aiReply || "Ask AI about pricing, proposals, portfolio, jobs..."}
            </div>

            <div className="flex gap-2">
              <input
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="Ask AI..."
                className="flex-1 px-4 py-2 rounded-xl border dark:bg-slate-800"
              />
              <button onClick={sendAI} className="bg-indigo-600 text-white px-4 rounded-xl">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <CommandPalette />
    </div>
  );
};

export default UnifiedDashboard;