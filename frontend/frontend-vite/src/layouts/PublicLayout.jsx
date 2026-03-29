// src/layouts/PublicLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PublicLayout = () => {
  const location = useLocation();

  const hideLayoutPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];

  const isAuthPage = hideLayoutPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      {!isAuthPage && <Navbar />}

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default PublicLayout;
