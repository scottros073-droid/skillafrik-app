import React, { useState } from "react";
import { FaSave, FaEye, FaEyeSlash, FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function ModernSettingsPage() {
  const [settings, setSettings] = useState({
    // Account
    email: "freelancer@example.com",
    phone: "+234 (555) 123-4567",

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    jobAlerts: true,
    messageNotifications: true,
    reviewNotifications: true,

    // Visibility
    profilePublic: true,
    showEarnings: false,
    showHireHistory: true,

    // Privacy
    twoFactorAuth: false,
    sessionTimeout: "30",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Settings saved successfully!
        </div>
      )}

      {/* Account Settings */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-gray-900">Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">Your primary email for login and notifications</p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-semibold text-gray-900">Phone Number</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-900">Password</label>
            <div className="flex gap-2 mt-2">
              <div className="flex-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: "emailNotifications", label: "Email Notifications", desc: "Receive important updates via email" },
            { key: "pushNotifications", label: "Push Notifications", desc: "Get alerts on your devices" },
            { key: "smsNotifications", label: "SMS Notifications", desc: "Receive text message alerts" },
            { key: "jobAlerts", label: "Job Alerts", desc: "Get notified about new job matches" },
            { key: "messageNotifications", label: "Message Notifications", desc: "Be notified of new messages" },
            { key: "reviewNotifications", label: "Review Notifications", desc: "Get alerted when you receive a review" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
              <button
                onClick={() => handleToggle(item.key)}
                className="text-2xl transition-colors"
              >
                {settings[item.key] ? (
                  <FaToggleOn className="text-blue-600" />
                ) : (
                  <FaToggleOff className="text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Privacy & Security</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: "profilePublic", label: "Public Profile", desc: "Allow your profile to be visible on the marketplace" },
            { key: "showEarnings", label: "Show Earnings", desc: "Display your earnings publicly" },
            { key: "showHireHistory", label: "Show Hire History", desc: "Show your past projects and reviews" },
            { key: "twoFactorAuth", label: "Two-Factor Authentication", desc: "Add extra security to your account" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
              <button
                onClick={() => handleToggle(item.key)}
                className="text-2xl transition-colors"
              >
                {settings[item.key] ? (
                  <FaToggleOn className="text-blue-600" />
                ) : (
                  <FaToggleOff className="text-gray-400" />
                )}
              </button>
            </div>
          ))}

          {/* Session Timeout */}
          <div className="py-4 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-900">Session Timeout</label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleChange("sessionTimeout", e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <FaSave />
          Save Changes
        </button>
      </div>
    </div>
  );
}
