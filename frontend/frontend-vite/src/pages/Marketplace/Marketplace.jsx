// frontend/src/pages/Hire/Marketplace.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  FaCode,
  FaPaintBrush,
  FaBullhorn,
  FaPen,
  FaMobileAlt,
  FaRobot,
  FaStar,
} from "react-icons/fa";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

/* ================= CATEGORIES ================= */

const categories = [
  { name: "Web Development", icon: <FaCode /> },
  { name: "Graphic Design", icon: <FaPaintBrush /> },
  { name: "Marketing & SEO", icon: <FaBullhorn /> },
  { name: "Content Writing", icon: <FaPen /> },
  { name: "Mobile Apps", icon: <FaMobileAlt /> },
  { name: "AI & Automation", icon: <FaRobot /> },
];

export default function Marketplace() {
  const navigate = useNavigate();

  const [freelancers, setFreelancers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12;

  /* ================= FETCH ================= */

  useEffect(() => {
    let mounted = true;

    const fetchFreelancers = async () => {
      try {
        const res = await axiosInstance.get("/freelancers");
        if (!mounted) return;
        setFreelancers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch freelancers:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFreelancers();
    return () => (mounted = false);
  }, []);

  /* ================= FILTERING ================= */

  const filtered = useMemo(() => {
    let temp = [...freelancers];

    if (selectedCategory) {
      temp = temp.filter((f) => f.category === selectedCategory);
    }

    if (search.trim()) {
      temp = temp.filter((f) =>
        `${f.firstName} ${f.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    return temp;
  }, [freelancers, selectedCategory, search]);

  const paginated = filtered.slice(0, page * limit);

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Find Top Freelancers
        </h1>
        <p className="text-gray-600 mt-1">
          Browse skilled professionals across multiple categories.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="sticky top-0 bg-gray-50 py-4 z-10">
        <div className="bg-white border rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex gap-3 flex-wrap mt-4">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === c.name ? "" : c.name
                );
                setPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition ${
                selectedCategory === c.name
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <p className="text-center text-gray-500">Loading freelancers...</p>
      ) : paginated.length === 0 ? (
        <p className="text-center text-gray-500">
          No freelancers found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((f) => (
            <div
              key={f._id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col"
            >
              <img
                src={f.avatar || "/avatar.png"}
                alt={`${f.firstName} ${f.lastName}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h2 className="text-lg font-semibold text-gray-900">
                {f.firstName} {f.lastName}
              </h2>

              <p className="text-gray-500 text-sm mb-2">
                {f.role || "Freelancer"}
              </p>

              <div className="flex items-center gap-2 mb-2 text-sm">
                <FaStar className="text-yellow-400" />
                <span>{f.rating || 0} ★</span>
              </div>

              <p className="text-gray-900 font-semibold mb-4">
                Starting at ₦{f.startingPrice || 0}
              </p>

              <button
                onClick={() =>
                  navigate(`/dashboard/profile/${f._id}`)
                }
                className="mt-auto bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* LOAD MORE */}
      {paginated.length < filtered.length && (
        <div className="text-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
