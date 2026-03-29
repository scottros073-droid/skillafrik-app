import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";

const routeNameMap = {
  dashboard: "Dashboard",
  jobs: "Jobs",
  chat: "Messages",
  wallet: "Wallet",
  ai: "AI Tools",
  profile: "Profile",
  settings: "Settings",
  reviews: "Reviews",
  community: "Community",
  hire: "Hire",
  post: "Post Job",
  marketplace: "Marketplace",
  fund: "Premium",
};

const Breadcrumbs = () => {
  const location = useLocation();

  // Split and remove empty values
  const segments = location.pathname.split("/").filter(Boolean);

  // If we're exactly on /dashboard → show nothing
  if (segments.length <= 1) return null;

  const formatLabel = (value) => {
    if (routeNameMap[value]) return routeNameMap[value];

    return value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav
      className="flex items-center flex-wrap gap-2 text-sm mb-6
      text-gray-500 dark:text-gray-400
      animate-[fadeIn_.2s_ease-in-out]"
    >
      {/* Dashboard Root */}
      <Link
        to="/dashboard"
        className="flex items-center gap-1 px-2 py-1 rounded-md
        hover:bg-gray-100 dark:hover:bg-gray-800
        hover:text-black dark:hover:text-white
        transition-all duration-200"
      >
        <FaHome className="w-3 h-3" />
        <span>Dashboard</span>
      </Link>

      {segments.slice(1).map((segment, index) => {
        const to = "/" + segments.slice(0, index + 2).join("/");
        const isLast = index === segments.slice(1).length - 1;
        const label = formatLabel(segment);

        return (
          <span key={to} className="flex items-center gap-2">
            <FaChevronRight className="w-3 h-3 opacity-50" />

            {isLast ? (
              <span className="px-2 py-1 rounded-md font-semibold text-black dark:text-white bg-gray-100 dark:bg-gray-800">
                {label}
              </span>
            ) : (
              <Link
                to={to}
                className="px-2 py-1 rounded-md
                hover:bg-gray-100 dark:hover:bg-gray-800
                hover:text-black dark:hover:text-white
                transition-all duration-200"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
