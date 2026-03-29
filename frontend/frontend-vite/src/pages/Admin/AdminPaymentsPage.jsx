import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaWallet, FaArrowUp, FaArrowDown, FaCheckCircle } from "react-icons/fa";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
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
      console.log("🔹 [ADMIN] Loading payments from /admin/transactions");
      try {
        const res = await axiosInstance.get("/admin/transactions");
        console.log("✅ [ADMIN] Payments loaded:", res.data?.length || 0, "transactions");
        setPayments(res.data || []);
      } catch (err) {
        console.error("❌ [ADMIN] Error loading payments:", err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || "Unable to load payments");
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
          <p className="font-medium">Loading payments...</p>
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
        <p className="font-semibold">⚠️ Error loading payments</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalCommission = payments.reduce((sum, p) => sum + (p.commission || 0), 0);
  const completedPayments = payments.filter(p => p.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Payments & Transactions</h1>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Monitor platform payments and commissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-lg p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Amount</p>
              <p className="text-2xl font-bold mt-1">₦{totalAmount.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-600/20' : 'bg-green-50'}`}>
              <FaArrowDown className={`text-lg ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Commission Earned</p>
              <p className="text-2xl font-bold mt-1">₦{totalCommission.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-600/20' : 'bg-blue-50'}`}>
              <FaWallet className={`text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
              <p className="text-2xl font-bold mt-1">{completedPayments}</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-600/20' : 'bg-purple-50'}`}>
              <FaCheckCircle className={`text-lg ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
          <h2 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            All Transactions
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`px-6 py-4 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</th>
                <th className={`px-6 py-4 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount</th>
                <th className={`px-6 py-4 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Commission</th>
                <th className={`px-6 py-4 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={4} className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((entry) => (
                  <tr key={entry._id || entry.id} className={`border-b transition-colors ${
                    darkMode
                      ? 'border-gray-700 hover:bg-gray-700/50'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}>
                    <td className={`px-6 py-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {entry.description || entry.type || "N/A"}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {entry.amount ? `₦${entry.amount.toLocaleString()}` : "N/A"}
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {entry.commission ? `₦${entry.commission.toLocaleString()}` : "₦0"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.status === 'completed'
                          ? darkMode ? 'bg-green-600/20 text-green-300' : 'bg-green-100 text-green-800'
                          : entry.status === 'pending'
                          ? darkMode ? 'bg-yellow-600/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                          : entry.status === 'failed'
                          ? darkMode ? 'bg-red-600/20 text-red-300' : 'bg-red-100 text-red-800'
                          : darkMode ? 'bg-gray-600/20 text-gray-300' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.status || "unknown"}
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
