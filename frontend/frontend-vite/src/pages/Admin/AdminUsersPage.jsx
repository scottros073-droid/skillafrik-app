import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaUser, FaEnvelope, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("darkMode") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const load = async () => {
      console.log("🔹 [ADMIN] Loading users from /admin/users");
      try {
        const res = await axiosInstance.get("/admin/users");
        console.log("✅ [ADMIN] Users loaded:", res.data?.length || 0, "users");
        setUsers(res.data || res.data.users || []);
      } catch (err) {
        console.error("❌ [ADMIN] Error loading users:", err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || "Unable to load users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`px-6 py-12 rounded-lg border ${
        darkMode
          ? 'bg-red-950/20 border-red-900 text-red-400'
          : 'bg-red-50 border-red-200 text-red-600'
      }`}>
        <p className="font-semibold">⚠️ Error loading users</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Users Management</h1>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage all platform users and their roles
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-lg p-4 border ${ darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
              <p className="text-2xl font-bold mt-1">{users.length}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-600/20' : 'bg-blue-50'}`}>
              <FaUser className={`text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Users</p>
              <p className="text-2xl font-bold mt-1">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-600/20' : 'bg-green-50'}`}>
              <FaCheckCircle className={`text-lg ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Admins</p>
              <p className="text-2xl font-bold mt-1">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-600/20' : 'bg-purple-50'}`}>
              <FaShieldAlt className={`text-lg ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
          <h2 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            All Users
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`px-6 py-4 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                <th className={`px-6 py-4 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</th>
                <th className={`px-6 py-4 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</th>
                <th className={`px-6 py-4 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className={`border-b transition-colors ${
                    darkMode
                      ? 'border-gray-700 hover:bg-gray-700/50'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}>
                    <td className={`px-6 py-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.firstName || user.name || "N/A"}
                    </td>
                    <td className={`px-6 py-4 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <FaEnvelope className="text-xs" />
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? darkMode ? 'bg-purple-600/20 text-purple-300' : 'bg-purple-100 text-purple-800'
                          : user.role === 'freelancer'
                          ? darkMode ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                          : darkMode ? 'bg-gray-600/20 text-gray-300' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role || "unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active'
                          ? darkMode ? 'bg-green-600/20 text-green-300' : 'bg-green-100 text-green-800'
                          : darkMode ? 'bg-red-600/20 text-red-300' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status || "unknown"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
