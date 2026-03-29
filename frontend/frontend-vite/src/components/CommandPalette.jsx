import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBriefcase,
  FaComments,
  FaWallet,
  FaRobot,
  FaUser,
  FaCog,
} from "react-icons/fa";

/* ================= ROUTES ================= */
const ROUTES = [
  { name: "Dashboard", path: "/dashboard", icon: FaTachometerAlt, group: "Core" },
  { name: "Jobs", path: "/dashboard/jobs", icon: FaBriefcase, group: "Core" },
  { name: "Messages", path: "/dashboard/chat", icon: FaComments, group: "Core" },

  { name: "Wallet", path: "/dashboard/wallet", icon: FaWallet, group: "Business" },
  { name: "AI Tools", path: "/dashboard/ai", icon: FaRobot, group: "Business" },

  { name: "Profile", path: "/dashboard/profile", icon: FaUser, group: "Account" },
  { name: "Settings", path: "/dashboard/settings", icon: FaCog, group: "Account" },
];

const CommandPalette = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  /* ================= CLOSE FUNCTION ================= */
  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return ROUTES.filter((route) =>
      route.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  /* ================= GROUP ================= */
  const grouped = useMemo(() => {
    return filtered.reduce((acc, route) => {
      if (!acc[route.group]) acc[route.group] = [];
      acc[route.group].push(route);
      return acc;
    }, {});
  }, [filtered]);

  /* ================= GLOBAL SHORTCUT (CTRL/CMD + K) ================= */
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if (e.key === "Escape") {
        closePalette();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [closePalette]);

  /* ================= KEYBOARD NAVIGATION ================= */
  useEffect(() => {
    if (!open) return;

    const handleNavigation = (e) => {
      if (!filtered.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        );
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          navigate(selected.path);
          closePalette();
        }
      }
    };

    window.addEventListener("keydown", handleNavigation);
    return () => window.removeEventListener("keydown", handleNavigation);
  }, [open, filtered, selectedIndex, navigate, closePalette]);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closePalette();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open, closePalette]);

  /* ================= RESET SELECTION WHEN QUERY CHANGES ================= */
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-32 px-4">
      <div
        ref={containerRef}
        className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-700 p-4 animate-[fadeIn_.15s_ease-out]"
      >
        {/* INPUT */}
        <input
          autoFocus
          placeholder="Search pages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 mb-4 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 outline-none dark:text-white"
        />

        {/* RESULTS */}
        <div className="max-h-80 overflow-y-auto space-y-4">
          {filtered.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found.
            </p>
          )}

          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <p className="mb-2 text-xs uppercase text-gray-400">
                {group}
              </p>

              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const globalIndex = filtered.indexOf(item);
                  const isActive = selectedIndex === globalIndex;

                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        closePalette();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition
                        ${
                          isActive
                            ? "bg-black text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between mt-4 pt-3 text-xs text-gray-400 border-t dark:border-gray-700">
          <span>↑ ↓ Navigate</span>
          <span>Enter Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
