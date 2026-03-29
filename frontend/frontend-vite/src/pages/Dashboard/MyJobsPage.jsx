import React from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import ModernJobCard from "../../components/Modern/ModernJobCard";

export default function MyJobsPage() {
  const [filterStatus, setFilterStatus] = React.useState("active");

  const jobsData = {
    active: [
      {
        id: 1,
        title: "Build React Dashboard for E-commerce Platform",
        client: "TechStart Inc.",
        description: "Modern dashboard with charts and analytics",
        budget: "1,200",
        budgetType: "Fixed",
        duration: "2-3 months",
        skills: ["React", "TypeScript", "Tailwind CSS"],
        clientRating: 4.8,
        jobsPosted: 15,
        status: "active",
      },
    ],
    past: [
      {
        id: 2,
        title: "Mobile App UI/UX Design",
        client: "Innovation Labs",
        description: "Design complete user interface for iOS app",
        budget: "800",
        budgetType: "Fixed",
        duration: "3-4 weeks",
        skills: ["Figma", "UI Design"],
        clientRating: 4.6,
        jobsPosted: 8,
        status: "completed",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
        <p className="text-gray-600 mt-2">View and manage all your job applications and proposals</p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
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
        <button
          onClick={() => setFilterStatus("active")}
          className={`pb-4 font-medium transition-colors ${
            filterStatus === "active"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 border-b-2 border-transparent hover:text-gray-900"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilterStatus("past")}
          className={`pb-4 font-medium transition-colors ${
            filterStatus === "past"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 border-b-2 border-transparent hover:text-gray-900"
          }`}
        >
          Past
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobsData[filterStatus].map((job) => (
          <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <ModernJobCard job={job} />
          </div>
        ))}
        {jobsData[filterStatus].length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-500">No jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
