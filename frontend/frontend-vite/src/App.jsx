// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

/* ========================= LAYOUTS ========================= */
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

/* ========================= PUBLIC PAGES ========================= */
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import NotFound from "./pages/NotFound/NotFound";
import PublicProfile from "./pages/Profile/PublicProfile";
import FreelancerSearch from "./pages/Freelancer/FreelancerSearch";
import FreelancerProfile from "./pages/Freelancer/FreelancerProfile";

/* ========================= DASHBOARD PAGES ========================= */
import DashboardOverview from "./pages/Dashboard/DashboardOverview";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

import JobsPage from "./pages/Jobs/JobsPage";
import ChatPage from "./pages/Chat/ChatPage";

import WalletPage from "./pages/Wallet/WalletPage";
import WalletWithdraw from "./pages/Wallet/WalletWithdraw";
import PaystackPayment from "./pages/Payment/PaystackPayment";

import ProfileEditor from "./pages/Profile/ProfileEditor";
import SettingsPage from "./pages/Settings/SettingsPage";

import PostJob from "./pages/Hire/PostJob";
import Marketplace from "./pages/Hire/Marketplace";
import ServiceDetailPage from "./pages/Hire/ServiceDetailPage";
import HirePage from "./pages/Hire/HirePage";
import JobDetails from "./pages/Jobs/JobDetails";
import PaymentPage from "./pages/Payment/PaymentPage";
import TransactionHistory from "./pages/Wallet/TransactionHistory";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminJobsPage from "./pages/Admin/AdminJobsPage";
import AdminPaymentsPage from "./pages/Admin/AdminPaymentsPage";
import SettingsAdmin from "./pages/Admin/SettingsAdmin";

/* ========================= AI TOOLS ========================= */
import AITools from "./pages/Dashboard/Tools/AITools";
import ProposalAI from "./pages/Dashboard/Tools/ProposalAI";
import AICreditCard from "./pages/Dashboard/Tools/AICreditCard";

/* ========================= NEW FEATURES ========================= */
import CommunityPage from "./pages/Community/CommunityPage";
import AnalyticsPage from "./pages/Analytics/AnalyticsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import PortfolioBuilder from "./pages/AI/PortfolioBuilder";
import LeaderboardPage from "./pages/Gamification/LeaderboardPage";
import GamificationReward from "./components/ui/GamificationReward";

/* ============================================================= */
/* ============================= APP ============================ */
/* ============================================================= */

export default function App() {
  const [reward, setReward] = useState(null);

  useEffect(() => {
    const handleReward = (event) => {
      setReward(event.detail);
    };

    window.addEventListener('gamificationReward', handleReward);

    return () => {
      window.removeEventListener('gamificationReward', handleReward);
    };
  }, []);

  return (
    <>
      <Routes>

        {/* ===================================================== */}
        {/* ==================== PUBLIC AREA ==================== */}
        {/* ===================================================== */}
        <Route element={<PublicLayout />}>

          <Route index element={<Home />} />

          {/* Authentication */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />

          {/* Explore Freelancers */}
          <Route path="freelancers" element={<FreelancerSearch />} />
          <Route path="freelancer/:userId" element={<PublicProfile />} />
          <Route path="freelancer/profile/:id" element={<FreelancerProfile />} />

          {/* Public/Browse routes */}
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/:jobId" element={<JobDetails />} />
          <Route path="payments" element={<PaymentPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="transactions" element={<TransactionHistory />} />

        </Route>

        {/* ===================================================== */}
        {/* ================= CLIENT / FREELANCER DASHBOARD ===== */}
        {/* ===================================================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["freelancer", "client"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default Dashboard */}
          <Route index element={<DashboardOverview />} />

          {/* Core */}
          <Route path="jobs" element={<JobsPage />} />
          <Route path="chat" element={<ChatPage />} />

          {/* Wallet */}
          <Route path="wallet" element={<WalletPage />} />
          <Route path="wallet/fund" element={<PaystackPayment />} />
          <Route path="wallet/withdraw" element={<WalletWithdraw />} />

          {/* AI Tools */}
          <Route path="ai" element={<AITools />} />
          <Route path="ai/proposal" element={<ProposalAI />} />
          <Route path="ai/credits" element={<AICreditCard />} />
          <Route path="ai/portfolio" element={<PortfolioBuilder />} />

          {/* New Features */}
          <Route path="community" element={<CommunityPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />

          {/* Profile & Settings */}
          <Route path="profile" element={<ProfileEditor />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Hiring */}
          <Route path="hire/post" element={<PostJob />} />
          <Route path="hire/marketplace" element={<Marketplace />} />
          <Route path="hire/marketplace/service/:serviceId" element={<ServiceDetailPage />} />
          <Route path="hire/:hireId" element={<HirePage />} />

          {/* Dashboard 404 */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <h2 className="text-2xl font-semibold mb-2">
                  Dashboard Page Not Found
                </h2>
                <p className="text-gray-500">
                  The page you’re looking for doesn’t exist.
                </p>
              </div>
            }
          />
        </Route>

        {/* ===================================================== */}        {/* ======================== ADMIN ====================== */}
        {/* ===================================================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ===================================================== */}
        {/* ====================== GLOBAL 404 =================== */}
        {/* ===================================================== */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      {/* Gamification Reward Animation */}
      {reward && (
        <GamificationReward
          reward={reward}
          onComplete={() => setReward(null)}
        />
      )}
    </>
  );
}