// src/components/Sidebar.jsx
import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  FaTachometerAlt,
  FaBriefcase,
  FaWallet,
  FaUsers,
  FaCog,
  FaComments,
  FaUser,
  FaStar,
  FaRocket,
  FaRobot,
  FaHandshake,
  FaChevronLeft,
  FaChevronDown,
  FaChevronUp,
  FaLock,
  FaChartLine,
  FaBell,
  FaPalette,
  FaTrophy,
} from "react-icons/fa";

const Sidebar = memo(function Sidebar({
  collapsed = false,
  mobileOpen = false,
  setCollapsed,
  setMobileOpen,
  onCollapseToggle,
  onMobileClose,
}) {
  const { user } = useUser() || {};
  const location = useLocation();

  const safeSetCollapsed = (value) => {
    if (typeof setCollapsed === "function") setCollapsed(value);
    if (typeof onCollapseToggle === "function") onCollapseToggle(value);
  };

  const safeSetMobileOpen = useCallback(
    (value) => {
      if (typeof setMobileOpen === "function") setMobileOpen(value);
      if (value === false && typeof onMobileClose === "function") onMobileClose();
    },
    [setMobileOpen, onMobileClose]
  );

  const closeMobile = useCallback(() => safeSetMobileOpen(false), [safeSetMobileOpen]);

  const role = (user?.role || "freelancer").toLowerCase();
  const isPremium = user?.isPremium || false;

  const [internalCollapsed, setInternalCollapsed] = useState(!!collapsed);
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    setInternalCollapsed(!!collapsed);
  }, [collapsed]);

  /* ========== COLLAPSE PERSIST ========== */
  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) setInternalCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", internalCollapsed);
  }, [internalCollapsed]);

  const handleCollapse = () => {
    setInternalCollapsed((prev) => {
      const next = !prev;
      safeSetCollapsed(next);
      return next;
    });
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && mobileOpen) {
        closeMobile();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [mobileOpen, closeMobile]);

  /* ========== ROUTE HELPERS ========== */
  const isActiveRoute = (href) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  const isChildActive = (children = []) =>
    children.some((child) => isActiveRoute(child.href));

  /* ========== MENU STRUCTURE ========== */
  const sections = useMemo(() => {
    const base = [
      {
        title: "Core",
        items: [
          { name: "Dashboard", icon: FaTachometerAlt, href: "/dashboard" },
          {
            name: "Jobs",
            icon: FaBriefcase,
            children: [
              { name: "My Jobs", href: "/dashboard/jobs" },
              { name: "Post Job", href: "/dashboard/hire/post", roles: ["client"] },
            ],
          },
          { name: "Messages", icon: FaComments, href: "/dashboard/chat", badge: 3 },
        ],
      },
      {
        title: "Business",
        items: [
          { name: "Marketplace", icon: FaHandshake, href: "/dashboard/hire/marketplace" },
          {
            name: "AI Tools",
            icon: FaRobot,
            children: [
              { name: "AI Dashboard", href: "/dashboard/ai" },
              { name: "Proposal Writer", href: "/dashboard/ai/proposal" },
              { name: "Portfolio Builder", icon: FaPalette, href: "/dashboard/ai/portfolio" },
              { name: "AI Credits", href: "/dashboard/ai/credits" },
            ],
          },
          { name: "Analytics", icon: FaChartLine, href: "/dashboard/analytics" },
          { name: "Notifications", icon: FaBell, href: "/dashboard/notifications" },
          { name: "Leaderboard", icon: FaTrophy, href: "/dashboard/leaderboard" },
          { name: "Wallet", icon: FaWallet, href: "/dashboard/wallet" },
          { name: "Upgrade Plan", icon: FaRocket, href: "/dashboard/upgrade", highlight: true },
        ],
      },
      {
        title: "Account",
        items: [
          { name: "Profile", icon: FaUser, href: "/dashboard/profile" },
          { name: "Reviews", icon: FaStar, href: "/dashboard/reviews" },
          { name: "Community", icon: FaUsers, href: "/dashboard/community" },
          { name: "Settings", icon: FaCog, href: "/dashboard/settings" },
        ],
      },
    ];

    if (role === "admin") {
      return [
        {
          title: "Admin",
          items: [
            { name: "Overview", icon: FaTachometerAlt, href: "/admin/dashboard" },
            { name: "Users", icon: FaUsers, href: "/admin/users" },
            { name: "Jobs", icon: FaBriefcase, href: "/admin/jobs" },
            { name: "Payments", icon: FaWallet, href: "/admin/payments" },
          ],
        },
        ...base,
      ];
    }

    return base;
  }, [role]);

  /* ========== AUTO OPEN ACTIVE DROPDOWNS ========== */
  useEffect(() => {
    const newOpen = {};
    sections.forEach((section) =>
      section.items.forEach((item) => {
        if (item.children && isChildActive(item.children)) {
          newOpen[item.name] = true;
        }
      })
    );
    setOpenMenus((prev) => ({ ...prev, ...newOpen }));
  }, [location.pathname, sections]);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* ========== RENDER ========== */
  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transition-all duration-300 shadow-xl
          ${internalCollapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow">
              {user?.name?.[0]?.toUpperCase() || "S"}
            </div>
            {!internalCollapsed && (
              <div>
                <p className="text-sm font-semibold dark:text-white truncate">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500 capitalize">{role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleCollapse}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FaChevronLeft className={`transition-transform duration-300 ${internalCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              {!internalCollapsed && (
                <p className="px-3 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  if (item.roles && !item.roles.includes(role)) return null;
                  const Icon = item.icon;
                  const hasChildren = !!item.children;
                  const active = item.href && isActiveRoute(item.href);
                  const childActive = hasChildren && isChildActive(item.children);
                  const baseStyle = `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200`;
                  const activeStyle = "bg-indigo-600 text-white shadow-sm";
                  const inactiveStyle = "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800";

                  if (!hasChildren) {
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={closeMobile}
                        className={`${baseStyle} ${active ? activeStyle : inactiveStyle} ${item.highlight ? "bg-indigo-50 dark:bg-indigo-900/20" : ""}`}
                      >
                        <Icon className="w-4 h-4" />
                        {!internalCollapsed && (
                          <>
                            <span className="flex-1">{item.name}</span>
                            {item.badge && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{item.badge}</span>}
                            {item.premium && !isPremium && <FaLock className="text-yellow-500 text-xs" />}
                          </>
                        )}
                      </NavLink>
                    );
                  }

                  // DROPDOWN
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`${baseStyle} ${childActive ? activeStyle : inactiveStyle} w-full`}
                      >
                        <Icon className="w-4 h-4" />
                        {!internalCollapsed && (
                          <>
                            <span className="flex-1 text-left">{item.name}</span>
                            {openMenus[item.name] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                          </>
                        )}
                      </button>

                      {openMenus[item.name] && !internalCollapsed && (
                        <div className="ml-7 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.name}
                              to={child.href}
                              onClick={closeMobile}
                              className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg text-sm transition ${isActive ? "bg-slate-200 dark:bg-slate-700" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`
                              }
                            >
                              {child.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER */}
        {!internalCollapsed && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} SkillAfrik
          </div>
        )}
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;