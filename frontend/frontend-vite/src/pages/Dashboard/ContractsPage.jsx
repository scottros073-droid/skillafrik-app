import React from "react";
import { FaFilter, FaSearch, FaCalendarAlt, FaDollarSign, FaChevronRight } from "react-icons/fa";

export default function ContractsPage() {
  const [filterStatus, setFilterStatus] = React.useState("active");

  const contracts = {
    active: [
      {
        id: 1,
        title: "React Dashboard for E-commerce",
        client: "TechStart Inc.",
        amount: "$1,200",
        status: "In Progress",
        startDate: "Jan 15, 2026",
        endDate: "Mar 30, 2026",
        progress: 65,
        milestone: "3/5 completed",
      },
      {
        id: 2,
        title: "Mobile App Development",
        client: "StartupXYZ",
        amount: "$2,500",
        status: "In Progress",
        startDate: "Jan 20, 2026",
        endDate: "Apr 15, 2026",
        progress: 40,
        milestone: "2/4 completed",
      },
    ],
    completed: [
      {
        id: 3,
        title: "API Development",
        client: "TechCorp",
        amount: "$1,500",
        status: "Completed",
        startDate: "Dec 1, 2025",
        endDate: "Jan 10, 2026",
        progress: 100,
        milestone: "4/4 completed",
      },
    ],
    ended: [],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
        <p className="text-gray-600 mt-2">Manage your active and past contracts</p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search contracts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <FaFilter size={16} />
          Filter
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-8">
        {["active", "completed", "ended"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`pb-4 font-medium transition-colors capitalize ${
              filterStatus === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 border-b-2 border-transparent hover:text-gray-900"
            }`}
          >
            {tab === "active" ? "Active" : tab === "completed" ? "Completed" : "Ended"}
          </button>
        ))}
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {contracts[filterStatus].map((contract) => (
          <div
            key={contract.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{contract.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{contract.client}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">{contract.amount}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    contract.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : contract.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {contract.status}
                </span>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCalendarAlt size={14} />
                <span>{contract.startDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCalendarAlt size={14} />
                <span>{contract.endDate}</span>
              </div>
            </div>

            {/* Progress Bar */}
            {contract.status === "In Progress" && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-600">{contract.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${contract.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{contract.milestone}</p>
              </div>
            )}

            {/* Action */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                View Details
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
        {contracts[filterStatus].length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-500">No contracts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
