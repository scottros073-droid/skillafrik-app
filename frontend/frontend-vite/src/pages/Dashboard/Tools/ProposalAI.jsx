import React, { useEffect, useState } from "react";
import { PaystackButton } from "react-paystack";
import axios from "../../../utils/axiosInstance";

export default function ProposalAI({ user }) {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState("");
  const [credits, setCredits] = useState(0);
  const [checking, setChecking] = useState(true);

  // -----------------------------
  // Load AI Credits
  // -----------------------------
  const fetchCredits = async () => {
    try {
      const res = await axios.get("/ai/usage");
      setCredits(res.data.credits);
    } catch (err) {
      console.error("Credit fetch error", err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  if (!user) return <p className="text-red-500">Please log in to use AI tools.</p>;
  if (checking) return <p>Loading AI credits...</p>;

  // -----------------------------
  // Paystack Config
  // -----------------------------
  const paystackProps = {
    email: user.email,
    amount: 400 * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    onSuccess: async () => {
      alert("Payment successful. Credits added.");
      fetchCredits();
    },
    onClose: () => alert("Payment cancelled"),
  };

  const [job, setJob] = useState("");
  const [skills, setSkills] = useState("");

  // -----------------------------
  // Generate Proposal
  // -----------------------------
  const generateProposal = async () => {
    try {
      setLoading(true);

      const check = await axios.get("/ai/usage/check/proposal");
      if (!check.data.allowed) {
        alert("No proposal credits left. Please purchase more.");
        return;
      }

      const result = await axios.post("/ai/generate/proposal", {
        job: job || "Freelance project",
        skills: skills || "Relevant skills",
      });

      setProposal(result.data.text || result.data.proposal);

      await axios.post("/ai/usage/deduct", { type: "proposal" });
      fetchCredits();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.msg || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">AI Proposal Generator</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Credits available: <b>{credits}</b> • 1 free usage for new users
      </p>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job description</label>
          <textarea
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder="Paste the job posting or describe the project..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your skills (comma-separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, Node.js, UI Design"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {credits === 0 && (
        <div className="mb-4">
          <p className="mb-2 text-red-500">You have no proposal credits. Pay ₦400 to continue.</p>
          <PaystackButton {...paystackProps} className="btn-primary" />
        </div>
      )}

      {credits > 0 && (
        <button
          onClick={generateProposal}
          disabled={loading}
          className="w-full py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] disabled:opacity-50 transition"
        >
          {loading ? "Generating..." : "Generate Proposal"}
        </button>
      )}

      {proposal && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Your Proposal</h3>
          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{proposal}</p>
        </div>
      )}
    </div>
  );
}
