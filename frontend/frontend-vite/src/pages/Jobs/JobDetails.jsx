import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { getJobById } from "../../services/jobService";
import { submitProposal } from "../../services/proposalService";
import { SafeImage } from "../../components/ui/SafeMedia";
import { recordActivity } from "../../services/gamificationService";
import AIProposalAnalyzer from "../Hire/AIProposalAnalyzer";
import AIPricingSuggestion from "../Hire/AIPricingSuggestion";

export default function JobDetails() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [proposal, setProposal] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getJobById(jobId);
        if (isMounted) setJob(data);
      } catch (err) {
        console.error("Failed to fetch job:", err);
        if (isMounted) setError("Unable to load job details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJob();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const handleSubmitProposal = async () => {
    if (!proposal.trim()) {
      alert("Please write a proposal");
      return;
    }

    setSubmittingProposal(true);
    try {
      await submitProposal(jobId, {
        coverLetter: proposal,
        proposedPrice: pricingSuggestion || 0,
        deliveryDays: deliveryTime || 1
      });

      // Record gamification activity
      await recordActivity("submit_proposal");

      alert("✅ Proposal submitted! The client will review it soon.");
      setProposal("");
      setShowProposalModal(false);
    } catch (err) {
      console.error("Error submitting proposal:", err);
      alert("Failed to submit proposal");
    } finally {
      setSubmittingProposal(false);
    }
  };

  // ⏳ Loading state
  if (loading) {
    return <p className="p-6 text-center">Loading job details...</p>;
  }

  // ❌ Error state
  if (error) {
    return <p className="p-6 text-center text-red-600">{error}</p>;
  }

  // ❓ Not found
  if (!job) {
    return <p className="p-6 text-center">Job not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-indigo-100">
              <span className="px-3 py-1 rounded-full bg-white/20">{job.category}</span>
              <span className="font-semibold text-white">
                ₦{job.budget?.toLocaleString() || job.price?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About This Job</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {job.image && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Job Image</h2>
                <SafeImage
                  src={job.image}
                  alt="Job visual"
                  className="w-full h-64 object-cover rounded-lg"
                  fallback="/public/default.png"
                />
              </div>
            )}

            {/* Client Info */}
            {job.client && (
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Posted By</h3>
                <p className="text-gray-900 dark:text-white font-medium">{job.client.firstName} {job.client.lastName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{job.client.email}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowProposalModal(true)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Submit Proposal
              </button>
              {job.client && (
                <Link
                  to={`/freelancer/${job.client._id}`}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                >
                  View Client Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-white">Submit Your Proposal</h2>
              <button
                onClick={() => {
                  setShowProposalModal(false);
                  setShowAnalyzer(false);
                }}
                className="text-white hover:bg-white/20 p-2 rounded transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Job Summary */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{job.description}</p>
              </div>

              {/* AI Pricing Suggestion for Freelancers */}
              {job.category && (
                <div className="p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
                  <AIPricingSuggestion
                    category={job.category}
                    jobTitle={job.title}
                    scope="medium"
                    level="intermediate"
                    compact={true}
                  />
                </div>
              )}

              {/* Proposal Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Proposal <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Write your proposal here. Explain why you're the best fit for this job, your relevant experience, and your approach..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-[150px] transition"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">{proposal.length} characters</p>
              </div>

              {/* AI Analyzer Button */}
              <button
                onClick={() => setShowAnalyzer(true)}
                className="w-full py-2 rounded-lg border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-medium hover:bg-orange-100 dark:hover:bg-orange-900/30 transition flex items-center justify-center gap-2"
              >
                <FaRobot /> Get AI Feedback Before Submitting
              </button>

              {/* Submit Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowProposalModal(false);
                    setShowAnalyzer(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitProposal}
                  disabled={!proposal.trim() || submittingProposal}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50"
                >
                  {submittingProposal ? "Submitting..." : "Submit Proposal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analyzer Modal */}
      {showAnalyzer && (
        <AIProposalAnalyzer
          onClose={() => setShowAnalyzer(false)}
          jobTitle={job.title}
          jobDescription={job.description}
        />
      )}
    </div>
  );
}
