import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";

export default function CommunityGuidelines() {
  return (
    <PageContainer
      title="Community Guidelines"
      subtitle="Our shared values and expectations for a positive community"
      maxWidth="max-w-4xl"
    >
      <Card>
        <div className="prose prose-indigo dark:prose-invert max-w-none">
          <section className="mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              SkillAfrik is built on trust, respect, and professionalism. These guidelines help
              ensure a safe, positive experience for everyone in our community.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              ✅ What We Encourage
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Professional communication:</strong> Be clear, respectful, and courteous in
                all interactions
              </li>
              <li>
                <strong>Honest job postings:</strong> Provide accurate descriptions of work needed
                and fair compensation
              </li>
              <li>
                <strong>Quality work delivery:</strong> Deliver work that meets or exceeds
                expectations
              </li>
              <li>
                <strong>Respectful feedback:</strong> Give constructive, helpful reviews and
                comments
              </li>
              <li>
                <strong>Timely responses:</strong> Respond to messages and requests promptly
              </li>
              <li>
                <strong>Transparency:</strong> Be upfront about skills, availability, and pricing
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              ❌ What's Not Allowed
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Harassment or hate speech:</strong> No discrimination, bullying, or
                offensive language
              </li>
              <li>
                <strong>Spam or misleading offers:</strong> No fake jobs, scams, or deceptive
                practices
              </li>
              <li>
                <strong>Off-platform payments:</strong> All payments must go through SkillAfrik's
                escrow system
              </li>
              <li>
                <strong>Fake reviews:</strong> Reviews must be genuine and based on actual work
                experience
              </li>
              <li>
                <strong>Intellectual property violations:</strong> No copyright infringement or
                unauthorized use of others' work
              </li>
              <li>
                <strong>Account sharing:</strong> Each account must belong to one person only
              </li>
              <li>
                <strong>Impersonation:</strong> Don't pretend to be someone else or use fake
                credentials
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🛡️ Consequences of Violations
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Violations are taken seriously and may result in:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Warning:</strong> First-time minor violations receive a warning
              </li>
              <li>
                <strong>Temporary suspension:</strong> Repeated violations may result in temporary
                account suspension
              </li>
              <li>
                <strong>Permanent ban:</strong> Severe violations (fraud, harassment, etc.) result
                in permanent account termination
              </li>
              <li>
                <strong>Legal action:</strong> Serious violations may be reported to law enforcement
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              📞 Reporting Violations
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you encounter behavior that violates these guidelines, please report it:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Use the "Report" button on profiles, jobs, or messages</li>
              <li>Contact our support team with details</li>
              <li>Include screenshots or evidence when possible</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              We review all reports and take appropriate action to maintain a safe community.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🤝 Building a Better Community
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Together, we can create a thriving marketplace where freelancers and clients succeed.
              Thank you for being part of SkillAfrik and helping us maintain these standards.
            </p>
          </section>
        </div>
      </Card>
    </PageContainer>
  );
}
