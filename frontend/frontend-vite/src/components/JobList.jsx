// frontend/src/components/JobCard.jsx
import React from "react";

function JobCard({ job }) {
  return (
    <div className="job-card border rounded-lg p-5 shadow-md hover:shadow-xl transition duration-300 ease-in-out bg-white">
      <h2 className="text-xl font-bold mb-2">{job.title}</h2>
      <p className="text-gray-700 mb-1">Budget: <span className="font-semibold">${job.budget}</span></p>
      <p className="text-gray-700 mb-3">Client: <span className="font-semibold">{job.clientName || job.client}</span></p>
      <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-200">
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;
