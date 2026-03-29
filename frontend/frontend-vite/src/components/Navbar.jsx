// src/components/Navbar.jsx – Premium Version

import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6
    bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/40 dark:border-gray-800/40 shadow-sm">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative">
          <img
            src="http://localhost:5000/public/logo.png"
            alt="SkillAfrik Logo"
            className="w-10 h-10 rounded-2xl shadow-lg group-hover:scale-110 transition duration-300"
          />
          <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition"></div>
        </div>

        <span className="text-xl font-extrabold tracking-tight 
        bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 
        bg-clip-text text-transparent">
          SkillAfrik
        </span>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <Link to="/login" className="text-sm font-medium hover:text-blue-600 transition">
          Log In
        </Link>

        <Link
          to="/signup"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600
          text-white font-semibold hover:scale-105 transition shadow-lg"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}