// src/pages/Auth/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import zxcvbn from "zxcvbn";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    role: "freelancer",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------
  // Handle input changes
  // ---------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---------------------------
  // Password strength
  // ---------------------------
  const passwordStrength = zxcvbn(form.password);

  // ---------------------------
  // Handle Signup
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    const { firstName, lastName, email, phone, password, country, role } = form;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !country || !role) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (phone && !phoneRegex.test(phone)) {
      setError("Please enter a valid phone number (digits only, optional +).");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Use AuthContext signup
      console.log("🔹 [SIGNUP] Starting signup process...");
      const user = await signup({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        country,
        password,
        role,
      });

      console.log("✅ [SIGNUP] Signup successful. Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ [SIGNUP] Signup error:", err);

      const userMessage =
        (typeof err === "string" && err) ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Signup failed. Try again.";

      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-[#2563EB] px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-blue-100 text-sm mt-1">Join SkillAfrik and start hiring or earning</p>
          <div className="flex justify-center gap-4 mt-3 text-xs text-blue-100">
            <span className="flex items-center gap-1"><FaLock /> Secure signup</span>
            <span className="flex items-center gap-1"><FaShieldAlt /> Protected</span>
          </div>
        </div>
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+234 800 000 0000"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="e.g. Nigeria"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I want to</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="freelancer">Work as a freelancer</option>
                <option value="client">Hire freelancers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {form.password && (
                <p className={`text-xs mt-1.5 ${
                  passwordStrength.score < 2 ? "text-red-500" :
                  passwordStrength.score < 4 ? "text-amber-500" : "text-green-600 dark:text-green-400"
                }`}>
                  Strength: {["Very weak", "Weak", "Fair", "Strong", "Very strong"][passwordStrength.score]}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
