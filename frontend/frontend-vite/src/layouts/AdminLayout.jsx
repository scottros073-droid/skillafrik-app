// src/layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaWallet,
  FaBars,
  FaTimes,
  FaCog,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaChevronRight
} from "react-icons/fa";
import { useAuth as useAuthContext } from "../context/AuthContext";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("darkMode") === "true";
    } catch {
      return false;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthContext();

  // Persist dark mode to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: FaTachometerAlt },
    { name: "Users", href: "/admin/users", icon: FaUsers },
    { name: "Jobs", href: "/admin/jobs", icon: FaBriefcase },
    { name: "Payments", href: "/admin/payments", icon: FaWallet },
    { name: "Settings", href: "/admin/settings", icon: FaCog },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:static lg:z-0 transform transition-all duration-300 ease-in-out ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        } border-r flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${ darkMode ? 'bg-blue-600' : 'bg-blue-600'} flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Control Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-800 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Main Menu
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 relative ${
                  active
                    ? darkMode
                      ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-600'
                      : 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : darkMode
                    ? 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.name}</span>
                {active && <FaChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`px-4 py-4 border-t space-y-2 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {darkMode ? (
              <>
                <FaSun className="w-4 h-4" />
                <span className="text-sm font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <FaMoon className="w-4 h-4" />
                <span className="text-sm font-medium">Dark Mode</span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              darkMode
                ? 'text-red-400 hover:bg-red-900/20'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>

        {/* User Info (Optional) */}
        {user && (
          <div className={`px-4 py-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
              <p className={`text-xs font-semibold truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {user.email || 'Admin'}
              </p>
              <p className={`text-xs capitalize ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {user.role || 'Administrator'}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="lg:ml-0 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className={`sticky top-0 z-30 border-b ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
        } backdrop-blur-sm`}>
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <FaBars size={20} />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Welcome back, {user?.name || 'Administrator'}
                </p>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <button className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <FaCog size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}