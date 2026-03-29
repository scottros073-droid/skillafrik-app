import { Link } from "react-router-dom";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";

export default function TermsPage() {
  return (
    <PageContainer
      title="Terms of Service"
      subtitle="Last updated: February 2025"
      maxWidth="max-w-4xl"
    >
      <Card>
        <div className="prose prose-indigo dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Platform Purpose
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Welcome to <strong>SkillAfrik</strong>. By accessing or using this platform, you agree
              to comply with these Terms of Service. If you do not agree, please do not use the
              platform.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              SkillAfrik connects clients with verified African freelancers and companies for
              digital services. All communication and payments must take place within the platform
              to ensure security and quality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. User Accounts
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Users must provide accurate and truthful information during registration</li>
              <li>Only one account is allowed per user (email address)</li>
              <li>Account sharing is strictly prohibited</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must notify us immediately of any unauthorized access to your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Payments & Fees
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>All payments must go through SkillAfrik's secure escrow system</li>
              <li>Off-platform payments are strictly prohibited and may result in account suspension</li>
              <li>SkillAfrik charges a 10% service fee on completed transactions</li>
              <li>Payment disputes will be resolved through our dispute resolution process</li>
              <li>Refunds are processed according to our refund policy (see Help Center)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Prohibited Actions
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              The following actions are strictly prohibited and may result in immediate account
              suspension or termination:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Scamming, fraud, or deceptive behavior</li>
              <li>Posting fake jobs or fake profiles</li>
              <li>Impersonation or creating fake reviews</li>
              <li>Bypassing SkillAfrik communication or escrow systems</li>
              <li>Harassment, discrimination, or abusive behavior toward other users</li>
              <li>Violation of intellectual property rights</li>
              <li>Spam, phishing, or malicious content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Job Postings & Applications
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Job postings must be accurate and describe real work opportunities</li>
              <li>Clients are responsible for providing clear project requirements</li>
              <li>Freelancers must deliver work as agreed upon in the job description</li>
              <li>Both parties must communicate professionally and respectfully</li>
              <li>Work must be completed within agreed deadlines</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Work delivered by freelancers becomes the property of the client upon full payment,
              unless otherwise agreed in writing. Freelancers retain the right to showcase completed
              work in their portfolios.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Users must not infringe on copyrights, trademarks, or other intellectual property
              rights. SkillAfrik respects intellectual property and will respond to valid DMCA
              takedown requests.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Dispute Resolution
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If a dispute arises between a client and freelancer:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Both parties should attempt to resolve the issue through communication</li>
              <li>If unresolved, either party can file a dispute through our support system</li>
              <li>SkillAfrik will review the case and make a fair decision</li>
              <li>Our decision is final, but users can appeal within 7 days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Account Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We reserve the right to suspend or terminate accounts that violate these terms.
              Violations may result in:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Warnings for minor violations</li>
              <li>Temporary suspension for repeated violations</li>
              <li>Permanent ban for severe violations (fraud, harassment, etc.)</li>
              <li>Forfeiture of funds in escrow for fraudulent activity</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              You may also terminate your account at any time through Settings. Outstanding payments
              will be processed before account closure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              SkillAfrik acts as a platform connecting clients and freelancers. We are not
              responsible for the quality of work delivered, disputes between users, or any losses
              incurred. Users engage with each other at their own risk. Our liability is limited
              to the service fees we collect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update these Terms of Service from time to time. We will notify users of
              significant changes via email or platform notification. Continued use of the platform
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. Contact & Support
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              For questions about these terms, please contact us:
            </p>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong>{" "}
                <a href="mailto:legal@skillafrik.com" className="text-indigo-600 hover:underline">
                  legal@skillafrik.com
                </a>
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                <strong>Support:</strong>{" "}
                <Link to="/help" className="text-indigo-600 hover:underline">
                  Visit our Help Center
                </Link>
              </p>
            </div>
          </section>
        </div>
      </Card>
    </PageContainer>
  );
}
