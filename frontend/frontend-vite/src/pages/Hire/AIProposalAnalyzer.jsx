import { useState } from "react";
import { FaRobot, FaMagic, FaCheckCircle, FaLightbulb, FaFire, FaLock, FaTimes } from "react-icons/fa";
import { analyzeProposal } from "../../services/aiService";

export default function AIProposalAnalyzer({ onClose, jobTitle = "", jobDescription = "" }) {
  const [proposal, setProposal] = useState("");
  const [jobTitleInput, setJobTitleInput] = useState(jobTitle || "");
  const [jobDescInput, setJobDescInput] = useState(jobDescription || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!proposal.trim()) {
      setError("Please enter your proposal to analyze.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await analyzeProposal(
        proposal,
        jobTitleInput || "Project",
        jobDescInput || ""
      );
      setAnalysis(result);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to analyze proposal";
      setError(errorMsg);
      
      // Check if upgrade required
      if (err.response?.status === 403) {
        setAnalysis({
          requiresUpgrade: true,
          message: errorMsg
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const copyProposal = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 70) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Work";
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition";

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <FaRobot className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Proposal Analyzer</h2>
              <p className="text-sm text-indigo-100">Get AI feedback to win more jobs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition text-white"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!analysis ? (
            <>
              {/* Instructions */}
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex gap-3">
                <FaLightbulb className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Free tier:</strong> 1 analysis per day. Get unlimited analyses with premium upgrade.
                </p>
              </div>

              {/* Job Context (Optional) */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 'Build an e-commerce website'"
                  className={inputClass}
                  value={jobTitleInput}
                  onChange={(e) => setJobTitleInput(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="Paste the job description for better analysis context..."
                  className={`${inputClass} min-h-[80px] resize-none`}
                  value={jobDescInput}
                  onChange={(e) => setJobDescInput(e.target.value)}
                />
              </div>

              {/* Proposal Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Proposal <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Paste your proposal here. We'll analyze it and suggest improvements to help you win more jobs..."
                  className={`${inputClass} min-h-[150px] resize-none`}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{proposal.length} characters</span>
                  {proposal.length > 0 && (
                    <button
                      onClick={copyProposal}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline transition flex items-center gap-1"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading || !proposal.trim()}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FaMagic /> {loading ? "Analyzing..." : "Analyze Proposal"}
              </button>
            </>
          ) : analysis.requiresUpgrade ? (
            // Upgrade Required State
            <div className="space-y-4 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto flex items-center justify-center">
                <FaLock className="text-amber-600 dark:text-amber-400 text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Daily Limit Reached</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  You've used your 1 free proposal analysis today. Upgrade to premium for unlimited analyses.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      // Navigate to upgrade/premium page
                      window.location.href = "/upgrade";
                    }}
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
                  >
                    Upgrade to Premium
                  </button>
                  <button
                    onClick={() => {
                      setAnalysis(null);
                      setProposal("");
                      setError("");
                    }}
                    className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Back to Analyzer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Analysis Results
            <div className="space-y-4">
              {/* Score Card */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Proposal Score</p>
                  <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}
                  </span>
                </div>
                <p className={`text-sm font-semibold ${getScoreColor(analysis.score)}`}>
                  {getScoreLabel(analysis.score)}
                </p>
              </div>

              {/* Analysis Summary */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <FaLightbulb className="text-amber-600 dark:text-amber-400" />
                  Analysis Summary
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {analysis.analysis}
                </p>
              </div>

              {/* Strengths */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-200 mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-600 dark:text-emerald-400" />
                    What's Working Well
                  </h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-emerald-800 dark:text-emerald-300 flex gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 flex-shrink-0">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {analysis.improvements && analysis.improvements.length > 0 && (
                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-3 flex items-center gap-2">
                    <FaFire className="text-orange-600 dark:text-orange-400" />
                    Suggested Improvements
                  </h4>
                  <ol className="space-y-2">
                    {analysis.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-sm text-orange-800 dark:text-orange-300 flex gap-2">
                        <span className="font-semibold text-orange-600 dark:text-orange-400 flex-shrink-0">{idx + 1}.</span>
                        {improvement}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Next Analysis Info */}
              {analysis.nextFreeAnalysisAt && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
                  ℹ️ Your next free analysis available tomorrow at midnight.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setAnalysis(null);
                    setProposal("");
                    setError("");
                  }}
                  className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Analyze Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
