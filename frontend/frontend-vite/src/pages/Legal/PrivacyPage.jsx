import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";

export default function PrivacyPage() {
  return (
    <PageContainer
      title="Privacy Policy"
      subtitle="Last updated: February 2025"
      maxWidth="max-w-4xl"
    >
      <Card>
        <div className="prose prose-indigo dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Welcome to <strong>SkillAfrik</strong>. We respect your privacy and are committed to
              protecting your personal data. This privacy policy explains how we collect, use, and
              safeguard your information when you use our platform.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By using SkillAfrik, you agree to the collection and use of information in accordance
              with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2 mt-4">
              Personal Information
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Name, email address, phone number, and country</li>
              <li>Profile information (bio, skills, portfolio, avatar)</li>
              <li>Payment and billing information (processed securely through Paystack)</li>
              <li>Account credentials (encrypted passwords)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2 mt-6">
              Usage Data
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Job postings, applications, and project interactions</li>
              <li>Messages and communications on the platform</li>
              <li>Reviews and ratings</li>
              <li>IP address, browser type, and device information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>To provide and maintain our platform services</li>
              <li>To process payments and manage transactions</li>
              <li>To match freelancers with relevant job opportunities</li>
              <li>To communicate with you about your account and services</li>
              <li>To improve our platform and develop new features</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Encrypted data transmission (SSL/TLS)</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data on a need-to-know basis</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to
              protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Data Sharing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We do not sell your personal information. We may share your data only in the following
              circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>With other users:</strong> Your public profile (name, skills, portfolio) is
                visible to other users on the platform
              </li>
              <li>
                <strong>With service providers:</strong> We use trusted third-party services (e.g.,
                Paystack for payments) that may process your data
              </li>
              <li>
                <strong>For legal compliance:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong>With your consent:</strong> When you explicitly agree to share information
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Access and review your personal data</li>
              <li>Update or correct inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@skillafrik.com" className="text-indigo-600 hover:underline">
                privacy@skillafrik.com
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Cookies and Tracking
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Remember your login session</li>
              <li>Analyze platform usage and improve performance</li>
              <li>Personalize your experience</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              You can control cookies through your browser settings, but this may affect platform
              functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              SkillAfrik is not intended for users under 18 years of age. We do not knowingly collect
              personal information from children. If you believe we have collected information from a
              child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the "Last updated" date. You are
              advised to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have questions about this privacy policy, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@skillafrik.com" className="text-indigo-600 hover:underline">
                  privacy@skillafrik.com
                </a>
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                <strong>Support:</strong>{" "}
                <a href="/support" className="text-indigo-600 hover:underline">
                  Visit our Help Center
                </a>
              </p>
            </div>
          </section>
        </div>
      </Card>
    </PageContainer>
  );
}
