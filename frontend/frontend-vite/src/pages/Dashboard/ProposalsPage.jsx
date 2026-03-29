import React from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

const DEMO_PROPOSALS = [
  {
    id: 1,
    jobTitle: "React Dashboard Project",
    clientName: "TechStart Inc.",
    bidAmount: "$1,200",
    duration: "2-3 months",
    status: "pending",
    submittedDate: "2 days ago",
    message: "I am experienced in React and Tailwind CSS. I can deliver a high-quality dashboard...",
  },
  {
    id: 2,
    jobTitle: "Mobile App Design",
    clientName: "Innovation Labs",
    bidAmount: "$800",
    duration: "3-4 weeks",
    status: "accepted",
    submittedDate: "1 week ago",
    message: "I have 5+ years of UI/UX design experience. Perfect for your project.",
  },
  {
    id: 3,
    jobTitle: "API Development",
    clientName: "StartupXYZ",
    bidAmount: "$2,500",
    duration: "6-8 weeks",
    status: "rejected",
    submittedDate: "3 days ago",
    message: "Professional Node.js developer with extensive API development experience.",
  },
];

export default function ProposalsPage() {
  const [filterStatus, setFilterStatus] = React.useState("all");

  const filteredProposals = filterStatus === "all" 
    ? DEMO_PROPOSALS 
    : DEMO_PROPOSALS.filter(p => p.status === filterStatus);

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
        <p className="text-gray-600 mt-2">Track all your proposals and their status</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-8">
        {["all", "pending", "accepted", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`pb-4 font-medium capitalize transition-colors ${
              filterStatus === status
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 border-b-2 border-transparent hover:text-gray-900"
            }`}
          >
            {status === "all" ? "All Proposals" : status}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => (
          <div key={proposal.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{proposal.jobTitle}</h3>
                <p className="text-sm text-gray-600 mt-1">{proposal.clientName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(proposal.status)}`}>
                {proposal.status}
              </span>
            </div>

            <p className="text-gray-700 text-sm mb-4 line-clamp-2">{proposal.message}</p>

            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-gray-500">Bid Amount</p>
                  <p className="text-sm font-semibold text-gray-900">{proposal.bidAmount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">{proposal.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="text-sm font-semibold text-gray-900">{proposal.submittedDate}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm">
                <FaEye size={14} />
                View
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm">
                <FaEdit size={14} />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm">
                <FaTrash size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
