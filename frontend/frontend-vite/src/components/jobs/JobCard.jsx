// frontend/src/components/jobs/JobCard.jsx
import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axios";

export default function JobCard({ job, user, refreshJobs }) {
  const [escrowAmount, setEscrowAmount] = useState("");

  // Apply to job (for freelancers)
  const handleApply = async () => {
    try {
      await axiosInstance.post(`/jobs/${job._id}/apply`);
      alert(`Applied to ${job.title}`);
      if (refreshJobs) refreshJobs(); // optional refresh
    } catch (err) {
      console.error(err);
      alert("Failed to apply");
    }
  };

  // Pay escrow (for clients)
  const handleEscrowPayment = async () => {
    if (!escrowAmount || isNaN(escrowAmount)) return alert("Enter a valid amount");

    try {
      const res = await axios.post(`/api/payments/job/escrow/${job._id}`, {
        amount: escrowAmount,
      });
      const { authorization_url } = res.data;
      window.location.href = authorization_url; // redirect to Paystack
    } catch (err) {
      console.error(err);
      alert("Could not initialize escrow payment");
    }
  };

  return (
    <div className="job-card border rounded-lg p-4 shadow hover:shadow-lg transition hover:scale-[1.02] dark:bg-gray-700 dark:text-gray-100">
      <h2 className="text-lg font-bold mb-2">{job.title}</h2>
      <p className="text-gray-300 mb-2">{job.description || "No description"}</p>
      <p className="font-medium mb-1">Budget: ₦{job.budget}</p>
      <p className="text-gray-400 mb-4">Client: {job.client?.firstName || "Unknown"}</p>

      {/* Freelancer Actions */}
      {user.role === "freelancer" && !job.workerId && (
        <button
          onClick={handleApply}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent w-full mb-2"
        >
          Apply Now
        </button>
      )}

      {/* Client Actions */}
      {user.role === "client" && !job.escrowPaid && (
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder={`Amount ₦${job.budget}`}
            value={escrowAmount}
            onChange={(e) => setEscrowAmount(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={handleEscrowPayment}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
          >
            Pay Escrow
          </button>
        </div>
      )}

      {/* Status */}
      {job.escrowPaid && (
        <p className="text-green-500 font-semibold">Escrow Paid ✅</p>
      )}
      {job.status === "DELIVERED" && (
        <p className="text-blue-500 font-semibold">Work Delivered ⏳</p>
      )}
      {job.status === "COMPLETED" && (
        <p className="text-indigo-500 font-semibold">Job Completed ✅</p>
      )}
    </div>
  );
}
