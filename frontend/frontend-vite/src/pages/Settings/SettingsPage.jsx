// frontend/src/pages/Settings/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applyTheme, getInitialTheme } from "../../utils/theme";

export default function SettingsPage() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
    profileVisibility: true,
    dataSharing: false,
  });

  const [account, setAccount] = useState({
    email: "user@example.com",
    username: "freelancer123",
    password: "",
    newPassword: "",
  });

  // Initialise preferences from saved theme
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setPreferences((prev) => ({
      ...prev,
      darkMode: initialTheme === "dark",
    }));
  }, []);

  // Toggle a preference
  const handleToggle = (field) => {
    setPreferences((prev) => {
      const next = { ...prev, [field]: !prev[field] };

      // When dark mode is toggled, update global theme class + localStorage
      if (field === "darkMode") {
        applyTheme(!prev.darkMode ? "dark" : "light");
      }

      return next;
    });
    // TODO: save to backend
  };

  // Handle account input change
  const handleAccountChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const handleSavePreferences = () => {
    console.log("Preferences saved:", preferences);
    alert("Preferences saved!");
    // TODO: save preferences to backend
  };

  const handleSaveAccount = () => {
    console.log("Account saved:", account);
    alert("Account settings saved!");
    // TODO: save account info to backend
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone!")) {
      console.log("Account deleted");
      alert("Your account has been deleted!");
      // TODO: call delete account API
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* ================== Account Settings ================== */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Account Settings
        </h1>
        <div className="flex gap-4 mb-4">
          <Link to="/dashboard/profile" className="text-[#2563EB] hover:underline">Edit Profile</Link>
          <Link to="/dashboard/wallet" className="text-[#2563EB] hover:underline">Wallet</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="email"
            name="email"
            value={account.email}
            onChange={handleAccountChange}
            placeholder="Email"
            className="p-3 border rounded dark:bg-gray-700 dark:text-gray-100 w-full"
          />
          <input
            type="text"
            name="username"
            value={account.username}
            onChange={handleAccountChange}
            placeholder="Username"
            className="p-3 border rounded dark:bg-gray-700 dark:text-gray-100 w-full"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="password"
            name="password"
            value={account.password}
            onChange={handleAccountChange}
            placeholder="Current Password"
            className="p-3 border rounded dark:bg-gray-700 dark:text-gray-100 w-full"
          />
          <input
            type="password"
            name="newPassword"
            value={account.newPassword}
            onChange={handleAccountChange}
            placeholder="New Password"
            className="p-3 border rounded dark:bg-gray-700 dark:text-gray-100 w-full"
          />
        </div>
        <button
          onClick={handleSaveAccount}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-500 transition"
        >
          Save Account Settings
        </button>
      </section>

      {/* ================== Preferences ================== */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Preferences
        </h2>
        {[
          { label: "Email Notifications", key: "emailNotifications", desc: "Receive updates about jobs, messages, and promotions." },
          { label: "Dark Mode", key: "darkMode", desc: "Enable dark mode for better night-time experience." },
          { label: "Profile Visibility", key: "profileVisibility", desc: "Make your profile visible to clients and freelancers." },
          { label: "Data Sharing", key: "dataSharing", desc: "Allow anonymized data sharing for insights." },
        ].map((pref) => (
          <div key={pref.key} className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">{pref.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{pref.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences[pref.key]}
                onChange={() => handleToggle(pref.key)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-indigo-600 transition-all"></div>
            </label>
          </div>
        ))}
        <button
          onClick={handleSavePreferences}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-500 transition"
        >
          Save Preferences
        </button>
      </section>

      {/* ================== Danger Zone ================== */}
      <section className="bg-red-50 dark:bg-red-900 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
        <p className="text-red-700 dark:text-red-300">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-red-500 transition"
        >
          Delete Account
        </button>
      </section>
    </div>
  );
}
