import { useState } from "react";
import { FaSearch, FaQuestionCircle, FaEnvelope, FaBook, FaComments } from "react-icons/fa";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";

const categories = [
  {
    title: "Getting Started",
    icon: <FaBook className="text-2xl" />,
    questions: [
      { q: "How do I create an account?", a: "Click the 'Sign Up' button in the top right corner, fill in your details, and choose your role (freelancer or client)." },
      { q: "How do I verify my account?", a: "After signing up, check your email for a verification link. Click it to verify your account." },
      { q: "What's the difference between a freelancer and a client?", a: "Freelancers offer services and get hired. Clients post jobs and hire freelancers for their projects." },
    ],
  },
  {
    title: "Payments & Pricing",
    icon: <FaEnvelope className="text-2xl" />,
    questions: [
      { q: "How does payment work?", a: "All payments go through our secure escrow system. Funds are held until work is completed and approved." },
      { q: "What fees does SkillAfrik charge?", a: "We charge a 10% service fee on completed transactions. This fee is deducted from the payment amount." },
      { q: "How do I withdraw my earnings?", a: "Go to your Wallet, click 'Withdraw', and follow the instructions. Withdrawals typically process within 2-3 business days." },
      { q: "What payment methods are accepted?", a: "We accept bank transfers and Paystack payments. More payment options are coming soon." },
    ],
  },
  {
    title: "Jobs & Projects",
    icon: <FaComments className="text-2xl" />,
    questions: [
      { q: "How do I post a job?", a: "Navigate to 'Post a Job' in your dashboard, fill in the job details, set your budget, and publish. Our AI can help you write a great job description!" },
      { q: "How do I apply for a job?", a: "Browse available jobs, click on one that interests you, and click 'Apply'. Make sure your profile is complete first." },
      { q: "Can I edit or cancel a job after posting?", a: "Yes, you can edit open jobs from your dashboard. Once a freelancer is hired, you'll need to contact support to make changes." },
      { q: "What happens if a freelancer doesn't deliver?", a: "If work isn't delivered by the deadline, you can request a refund through our dispute resolution system." },
    ],
  },
  {
    title: "Account & Profile",
    icon: <FaQuestionCircle className="text-2xl" />,
    questions: [
      { q: "How do I update my profile?", a: "Go to 'Profile' in your dashboard and click 'Edit'. You can update your skills, bio, portfolio, and other details." },
      { q: "What is Premium and how do I upgrade?", a: "Premium members get verified badges, priority job listings, unlimited AI matches, and more. Visit the Upgrade page to learn more." },
      { q: "How do I change my password?", a: "Go to Settings, then Security, and click 'Change Password'. You'll need your current password." },
      { q: "Can I delete my account?", a: "Yes, you can delete your account from Settings. Note: This action is permanent and cannot be undone." },
    ],
  },
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <PageContainer
      title="Help Center"
      subtitle="Find answers to common questions or contact our support team"
      maxWidth="max-w-5xl"
    >
      {/* Search */}
      <Card className="mb-8">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for help..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Categories */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No results found. Try different keywords or{" "}
              <a href="/support" className="text-indigo-600 hover:underline">
                contact support
              </a>
              .
            </p>
          </Card>
        ) : (
          filteredCategories.map((category, catIdx) => (
            <Card key={catIdx} hover>
              <button
                onClick={() => setOpenCategory(openCategory === catIdx ? null : catIdx)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>
                <span className="text-gray-400 text-sm">
                  {openCategory === catIdx ? "−" : "+"}
                </span>
              </button>

              {openCategory === catIdx && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  {category.questions.map((item, qIdx) => (
                    <div key={qIdx}>
                      <button
                        onClick={() =>
                          setOpenQuestion(
                            openQuestion === `${catIdx}-${qIdx}` ? null : `${catIdx}-${qIdx}`
                          )
                        }
                        className="w-full text-left flex items-start justify-between gap-4 py-2"
                      >
                        <span className="font-medium text-gray-900 dark:text-white flex-1">
                          {item.q}
                        </span>
                        <span className="text-gray-400 text-sm shrink-0">
                          {openQuestion === `${catIdx}-${qIdx}` ? "−" : "+"}
                        </span>
                      </button>
                      {openQuestion === `${catIdx}-${qIdx}` && (
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400 border-l-2 border-indigo-200 dark:border-indigo-800">
                          {item.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Contact Support */}
      <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Still need help?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our support team is here to assist you 24/7.
            </p>
          </div>
          <a
            href="/support"
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Contact Support
          </a>
        </div>
      </Card>
    </PageContainer>
  );
}
