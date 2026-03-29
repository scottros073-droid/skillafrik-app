// src/pages/Legal/LegalPage.jsx
import { Link } from "react-router-dom";
import { FaFileContract, FaShieldAlt, FaGavel } from "react-icons/fa";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";

// Named export for the list of legal docs in case you need it elsewhere
export const legalDocs = [
  {
    icon: <FaFileContract className="text-2xl" />,
    title: "Terms of Service",
    description: "Read our terms and conditions for using SkillAfrik",
    link: "/legal/terms",
  },
  {
    icon: <FaShieldAlt className="text-2xl" />,
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your data",
    link: "/legal/privacy",
  },
  {
    icon: <FaGavel className="text-2xl" />,
    title: "Community Guidelines",
    description: "Rules and best practices for our community",
    link: "/legal/community-guidelines",
  },
];

// Main default export
export default function LegalPage() {
  return (
    <PageContainer
      title="Legal Documents"
      subtitle="Review our terms, policies, and guidelines"
      maxWidth="max-w-4xl"
    >
      <div className="grid md:grid-cols-3 gap-6">
        {legalDocs.map((doc, idx) => (
          <Link key={idx} to={doc.link}>
            <Card hover className="h-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
                  {doc.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{doc.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 bg-gray-50 dark:bg-gray-900/50">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Need Legal Assistance?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          If you have questions about our legal documents or need to report a legal issue, please
          contact us.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:legal@skillafrik.com"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            legal@skillafrik.com
          </a>
          <Link to="/support" className="text-sm text-indigo-600 hover:underline font-medium">
            Contact Support →
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
}
