// src/pages/Dashboard/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaUsers, FaBriefcase, FaWallet, FaChartLine, FaCheck, FaTimes, FaRedo } from "react-icons/fa";
import { Skeleton } from "../../components/Loaders";
import { useToast } from "../../context/ToastContext";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, LineChart, Line } from "recharts";

function StatCard({ icon, label, value, loading }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</div>
        <div className="text-gray-400 dark:text-gray-500 text-xl">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        {loading ? <Skeleton width="120px" height="36px" /> : value}
      </div>
    </div>
  );
}

function DataTable({ title, columns, data, loading, actions }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <Skeleton width="200px" height="24px" className="mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              {columns.map((_, colIdx) => (
                <Skeleton key={colIdx} width="120px" height="16px" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((col, idx) => (
                <th key={idx} className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">{col.label}</th>
              ))}
              {actions && <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="py-3 px-2 text-gray-900 dark:text-white">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="py-3 px-2">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      const message = "Auth token missing. Please sign in again.";
      console.error("AdminDashboard: Missing token", message);
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔹 [ADMIN] Fetching admin overview data...");

      const response = await axiosInstance.get("/admin/overview");

      if (!response || !response.data) {
        throw new Error("Empty response from server");
      }

      const { stats: statsData, users: usersData, transactions: transactionsData, jobs: jobsData, recentTransactions: recentTx, recentJobs: recentJobsData } = response.data;

      setStats(statsData || {});
      setUsers(Array.isArray(usersData) ? usersData : []);
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setRecentTransactions(Array.isArray(recentTx) ? recentTx : (Array.isArray(transactionsData) ? transactionsData.slice(0, 10) : []));
      setRecentJobs(Array.isArray(recentJobsData) ? recentJobsData : (Array.isArray(jobsData) ? jobsData.slice(0, 10) : []));

      generateChartData(Array.isArray(transactionsData) ? transactionsData : []);

      console.log("✅ [ADMIN] Admin overview data loaded successfully");
      toast.success("Admin overview data loaded successfully");
      setError(null);
    } catch (err) {
      console.error("❌ [ADMIN] Failed to load admin overview data:", err);

      let errorMessage = "Failed to load data. Please try again.";
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          errorMessage = "Authentication failed. Please sign in again.";
        } else if (err.response.status === 403) {
          errorMessage = "Admin access required. You don't have permission.";
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (transactions) => {
    // Earnings over time
    const earningsByMonth = {};
    const usersByMonth = {};

    transactions.forEach(tx => {
      const date = new Date(tx.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (tx.type === 'FEE' || tx.type === 'OUT') {
        earningsByMonth[monthKey] = (earningsByMonth[monthKey] || 0) + tx.amount;
      }

      usersByMonth[monthKey] = usersByMonth[monthKey] || new Set();
      if (tx.userId) {
        usersByMonth[monthKey].add(tx.userId._id || tx.userId);
      }
    });

    const earningsChart = Object.keys(earningsByMonth).sort().map(month => ({
      month,
      earnings: earningsByMonth[month]
    }));

    const userGrowthChart = Object.keys(usersByMonth).sort().map(month => ({
      month,
      users: usersByMonth[month].size
    }));

    setEarningsData(earningsChart);
    setUserGrowthData(userGrowthChart);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprovePayment = async (transactionId) => {
    try {
      await axiosInstance.patch(`/admin/approve-payment/${transactionId}`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to approve payment", err);
      alert("Failed to approve payment");
    }
  };

  const handleRejectPayment = async (transactionId) => {
    try {
      await axiosInstance.patch(`/admin/reject-payment/${transactionId}`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to reject payment", err);
      alert("Failed to reject payment");
    }
  };

  const userColumns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "country", label: "Country" },
    { key: "createdAt", label: "Joined", render: (val) => new Date(val).toLocaleDateString() }
  ];

  const transactionColumns = [
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount", render: (val) => `₦${val}` },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date", render: (val) => new Date(val).toLocaleDateString() },
    { key: "userId", label: "User", render: (val, row) => row.userId?.firstName ? `${row.userId.firstName} ${row.userId.lastName}` : "N/A" }
  ];

  const jobColumns = [
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "price", label: "Price", render: (val) => `₦${val}` },
    { key: "createdAt", label: "Created", render: (val) => new Date(val).toLocaleDateString() },
    { key: "client", label: "Client", render: (val, row) => row.client?.firstName ? `${row.client.firstName} ${row.client.lastName}` : "N/A" },
    { key: "freelancer", label: "Freelancer", render: (val, row) => row.freelancer?.firstName ? `${row.freelancer.firstName} ${row.freelancer.lastName}` : "N/A" }
  ];

  const transactionActions = (row) => {
    if (row.type === "escrow" && row.status === "pending") {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleApprovePayment(row._id)}
            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
          >
            <FaCheck />
          </button>
          <button
            onClick={() => handleRejectPayment(row._id)}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
          >
            <FaTimes />
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor platform performance and manage operations</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <FaRedo className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
            <div className="text-red-500 dark:text-red-400 mt-0.5">
              <FaTimes size={16} />
            </div>
            <div className="flex-1">
              <h3 className="text-red-800 dark:text-red-200 font-medium">Error Loading Data</h3>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FaUsers />}
            label="Total Users"
            value={stats.totalUsers || 0}
            loading={loading}
          />
          <StatCard
            icon={<FaBriefcase />}
            label="Total Jobs"
            value={stats.totalJobs || 0}
            loading={loading}
          />
          <StatCard
            icon={<FaWallet />}
            label="Total Earnings"
            value={stats.totalEarnings ? `₦${stats.totalEarnings.toLocaleString()}` : "₦0"}
            loading={loading}
          />
          <StatCard
            icon={<FaChartLine />}
            label="Pending Withdrawals"
            value={stats.pendingWithdrawals ? `₦${stats.pendingWithdrawals.toLocaleString()}` : "₦0"}
            loading={loading}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Earnings Growth</h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton width="200px" height="200px" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`₦${value}`, 'Earnings']}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">User Growth</h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton width="200px" height="200px" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tables */}
        <DataTable
          title="Recent Jobs"
          columns={jobColumns}
          data={jobs.slice(0, 10)}
          loading={loading}
        />

        <DataTable
          title="Recent Transactions"
          columns={transactionColumns}
          data={recentTransactions}
          loading={loading}
          actions={transactionActions}
        />

        {/* Empty State */}
        {!loading && jobs.length === 0 && transactions.length === 0 && !error && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
            <div className="text-blue-500 dark:text-blue-400 mb-4">
              <FaChartLine size={48} className="mx-auto" />
            </div>
            <h3 className="text-blue-800 dark:text-blue-200 font-semibold text-lg mb-2">No Activity Yet</h3>
            <p className="text-blue-700 dark:text-blue-300">
              The platform is getting started. New jobs and transactions will appear here as users begin using the service.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
