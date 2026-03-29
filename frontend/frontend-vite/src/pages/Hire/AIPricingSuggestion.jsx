import { useState } from "react";
import { FaDollarSign, FaChevronDown, FaChevronUp, FaLightbulb, FaLock, FaChartLine, FaUsers, FaRobot } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";
import { getSuggestedPricing } from "../../services/aiService";

export default function AIPricingSuggestion({
  category = "",
  jobTitle = "",
  scope = "medium",
  level = "intermediate",
  onPriceSelected = null,
  compact = false
}) {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(!compact);

  const handleGetPricing = async () => {
    if (!category) {
      setError("Please select a job category first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await getSuggestedPricing(category, jobTitle, scope, level);
      setPricing(result);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get pricing suggestion");
    } finally {
      setLoading(false);
    }
  };

  const handleUsePrice = () => {
    if (onPriceSelected && pricing) {
      onPriceSelected({
        price: pricing.basicRate,
        hourlyRate: pricing.basicRatePerHour,
        estimatedHours: pricing.estimatedHours
      });
    }
  };

  const scopes = [
    { value: "small", label: "Small (< 1 week)", time: "~ 1 week" },
    { value: "medium", label: "Medium (2-4 weeks)", time: "~ 2-4 weeks" },
    { value: "large", label: "Large (1-3 months)", time: "~ 1-3 months" },
    { value: "complex", label: "Complex (3+ months)", time: "~ 3+ months" }
  ];

  const levels = [
    { value: "entry", label: "Entry Level" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" }
  ];

  if (compact && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full p-3 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <FaRobot /> AI Pricing Helper
        </span>
        <FaChevronDown />
      </button>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FaDollarSign className="text-indigo-600 dark:text-indigo-400" />
          AI Pricing Suggestion
        </h3>
        {compact && (
          <button
            onClick={() => setExpanded(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <FaChevronUp />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Job Details Inputs */}
        {!pricing && (
          <>
            {/* Scope Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Scope
              </label>
              <div className="grid grid-cols-2 gap-2">
                {scopes.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {}}
                    disabled
                    title={s.time}
                    className={`p-2 rounded-lg text-sm font-medium transition border ${
                      scope === s.value
                        ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Expertise Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {levels.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => {}}
                    disabled
                    className={`p-2 rounded-lg text-sm font-medium transition border ${
                      level === l.value
                        ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300 flex gap-2">
              <FaLightbulb className="flex-shrink-0 mt-0.5" />
              <p>
                <strong>Free tier:</strong> Basic recommended rate. <strong>Premium:</strong> Market analysis & competition insights.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex gap-2">
                <span>❌</span> {error}
              </div>
            )}

            <button
              onClick={handleGetPricing}
              disabled={loading || !category}
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>⏳ Analyzing market...</>
              ) : (
                <>
                  <FaDollarSign /> Get Pricing Suggestion
                </>
              )}
            </button>
          </>
        )}

        {/* Results */}
        {pricing && (
          <div className="space-y-4">
            {/* Recommended Price Card */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200 mb-1">Recommended Project Price</p>
              <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                ${pricing.basicRate.toLocaleString()}
              </p>
              <p className="text-sm text-emerald-800 dark:text-emerald-300">
                ~${pricing.basicRatePerHour}/hour × {pricing.estimatedHours} hours
              </p>
            </div>

            {/* Premium Analysis */}
            {pricing.advancedAnalysis ? (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
                  <FaChartLine /> Market Analysis
                </h4>

                <div className="space-y-3">
                  {/* Suggested Rate */}
                  <div>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      <strong>Market Rate:</strong> ${pricing.advancedAnalysis.suggestedRate}/project
                    </p>
                  </div>

                  {/* Market Range */}
                  {pricing.advancedAnalysis.marketRange && (
                    <div>
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        <strong>Market Range:</strong> {pricing.advancedAnalysis.marketRange}
                      </p>
                    </div>
                  )}

                  {/* Competition & Demand */}
                  <div className="grid grid-cols-2 gap-3">
                    {pricing.advancedAnalysis.competitionLevel && (
                      <div className="p-2 rounded bg-white/50 dark:bg-black/20">
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <FaUsers /> Competition
                        </p>
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 capitalize">
                          {pricing.advancedAnalysis.competitionLevel}
                        </p>
                      </div>
                    )}

                    {pricing.advancedAnalysis.demandLevel && (
                      <div className="p-2 rounded bg-white/50 dark:bg-black/20">
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <FaChartLine /> Demand
                        </p>
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 capitalize">
                          {pricing.advancedAnalysis.demandLevel}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Value Proposition */}
                  {pricing.advancedAnalysis.uniqueValueProposition && (
                    <div className="p-2 rounded bg-white/50 dark:bg-black/20">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">💡 Pricing Strategy</p>
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        {pricing.advancedAnalysis.uniqueValueProposition}
                      </p>
                    </div>
                  )}

                  {/* Risk Factors */}
                  {pricing.advancedAnalysis.riskFactors && pricing.advancedAnalysis.riskFactors.length > 0 && (
                    <div className="p-2 rounded bg-white/50 dark:bg-black/20">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-1">
                        <FaTriangleExclamation /> Considerations
                      </p>
                      <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                        {pricing.advancedAnalysis.riskFactors.map((factor, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span>•</span> {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <FaLock /> Premium Feature
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Unlock market analysis, competition insights, and demand trends with Premium.
                </p>
                <button
                  onClick={() => window.location.href = "/upgrade"}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}

            {/* Upgrade Hint */}
            {pricing.upgradeHint && !pricing.advancedAnalysis && (
              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-sm text-indigo-800 dark:text-indigo-300">
                💡 {pricing.upgradeHint}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUsePrice}
                disabled={!onPriceSelected}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {onPriceSelected ? "Use This Price" : "Price Ready"}
              </button>
              <button
                onClick={() => {
                  setPricing(null);
                  setError("");
                }}
                className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Get Another Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
