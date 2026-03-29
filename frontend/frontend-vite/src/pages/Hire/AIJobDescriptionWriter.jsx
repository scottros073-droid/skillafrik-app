// src/pages/Hire/AIJobDescriptionWriter.jsx
import React, { useState } from "react";
import { FaRobot, FaCopy, FaCheckCircle, FaMagic } from "react-icons/fa";
import { getAiJobSuggestion } from "../../services/jobService";

const TEMPLATES = [
  {
    id: "web",
    label: "Web Development",
    keywords: "React, Node.js, Database, Full stack",
  },
  {
    id: "design",
    label: "Graphic Design",
    keywords: "UI/UX, Branding, Logo, Mockups",
  },
  {
    id: "marketing",
    label: "Marketing & SEO",
    keywords: "Content marketing, SEO, Social media",
  },
  {
    id: "writing",
    label: "Content Writing",
    keywords: "Blog post, Articles, Copywriting",
  },
  {
    id: "mobile",
    label: "Mobile App",
    keywords: "iOS, Android, Flutter, React Native",
  },
];

export default function AIJobDescriptionWriter({ onApply, category = "" }) {
  const [focus, setFocus] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!category && !focus) {
      setError("Please select a category and enter focus keywords.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const suggestion = await getAiJobSuggestion({
        category: category || "General",
        keywords: focus,
      });
      setGenerated(suggestion);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate description. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTitle = () => {
    if (generated?.title) {
      navigator.clipboard.writeText(generated.title);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyDescription = () => {
    if (generated?.description) {
      navigator.clipboard.writeText(generated.description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = (source) => {
    if (generated) {
      onApply({
        title: generated.title,
        description: generated.description,
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
          <FaRobot className="text-lg" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">AI Job Description Writer</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Free Smart Suggestions</p>
        </div>
      </div>

      {/* Quick Templates */}
      {!category && (
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Templates:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setFocus(t.keywords);
                  setError("");
                }}
                className="px-3 py-2 text-xs rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition text-gray-700 dark:text-gray-300 font-medium"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          What's your job about? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., React dashboard, logo design, SEO optimization..."
            value={focus}
            onChange={(e) => {
              setFocus(e.target.value);
              setError("");
            }}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !focus}
            className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 whitespace-nowrap"
          >
            <FaMagic className="text-sm" />
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Generated Output */}
      {generated && (
        <div className="space-y-4">
          {/* Success Badge */}
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <FaCheckCircle className="text-lg" />
            <span className="font-medium">Ready to use!</span>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
              <button
                onClick={handleCopyTitle}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
              >
                <FaCopy className="text-xs" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-900 dark:text-white text-sm font-medium">{generated.title}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <button
                onClick={handleCopyDescription}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
              >
                <FaCopy className="text-xs" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-900 dark:text-white text-sm whitespace-pre-wrap">{generated.description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Use This Description
            </button>
            <button
              onClick={() => {
                setGenerated(null);
                setFocus("");
              }}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      {!generated && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs">
          ✨ <strong>Free Feature:</strong> Get AI-powered job title and description suggestions to attract the right talent. Basic suggestions included for all users.
        </div>
      )}
    </div>
  );
}
