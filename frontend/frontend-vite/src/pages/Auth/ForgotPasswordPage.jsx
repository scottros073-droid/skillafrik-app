import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaArrowRight } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setMessage("If an account exists for this email, a reset link has been sent.");
      setError("");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-3">
            <FaLock className="text-white text-lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset password</h1>
          <p className="text-indigo-100 text-sm mt-1">Enter your email and we'll send a reset link</p>
        </div>

        <div className="p-8">
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? "Sending link..." : <>Send reset link <FaArrowRight className="text-sm" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
