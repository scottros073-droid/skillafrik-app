// src/components/jobs/JobSearchBar.jsx
import React, { useState } from "react";

const JobSearchBar = ({
  search,
  setSearch,
  category,
  setCategory,
  budget,
  setBudget,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState(search || "");

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(searchTerm.trim());
    if (onSearch) onSearch(searchTerm.trim());
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setBudget("");
    setSearchTerm("");
    if (onSearch) onSearch("");
  };

  return (
    <div className="mb-6 max-w-4xl mx-auto">
      {/* Top Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center mb-4 bg-white rounded-lg shadow-md overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search jobs by title, category, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 text-gray-700 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow grid md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        >
          <option value="">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="Design">Design</option>
          <option value="Writing">Writing</option>
          <option value="Marketing">Marketing</option>
        </select>

        {/* Budget Filter */}
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        >
          <option value="">Any Budget</option>
          <option value="50">Under $50</option>
          <option value="100">Under $100</option>
          <option value="500">Under $500</option>
        </select>

        {/* Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="bg-gray-200 rounded-lg hover:bg-gray-300 px-4 py-2 w-full"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default JobSearchBar;
