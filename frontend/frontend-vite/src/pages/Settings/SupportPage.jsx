import { useState } from "react";
import { FaPaperPlane, FaQuestionCircle, FaEnvelope } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/support", { subject, message });
      setSuccess(true);
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageContainer title="Support" maxWidth="max-w-2xl">
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-2xl text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ticket Submitted Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've received your support request and will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Submit Another Ticket
            </button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Contact Support"
      subtitle="We're here to help. Describe your issue and we'll get back to you soon."
      maxWidth="max-w-2xl"
    >
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-3">
              <FaQuestionCircle className="text-xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Help Center</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Find answers to common questions
            </p>
            <a
              href="/help"
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              Visit Help Center →
            </a>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-3">
              <FaEnvelope className="text-xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Get help via email
            </p>
            <a
              href="mailto:support@skillafrik.com"
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              support@skillafrik.com
            </a>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-3">
              <FaPaperPlane className="text-xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Response Time</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We typically respond within 24 hours
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Please provide as much detail as possible about your issue..."
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FaPaperPlane />
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </Card>
    </PageContainer>
  );
}
