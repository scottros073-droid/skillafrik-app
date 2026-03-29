// src/pages/Auth/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setMessage("");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setMessage("");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      setMessage("Password reset successful! You can now log in.");
      setError("");
      setPassword("");
      setConfirmPassword("");
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
            <FaCheckCircle className="text-white text-lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="text-indigo-100 text-sm mt-1">Choose a strong new password</p>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-12 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-12 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition"
            >
              {loading ? "Resetting password..." : "Reset password"}
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
