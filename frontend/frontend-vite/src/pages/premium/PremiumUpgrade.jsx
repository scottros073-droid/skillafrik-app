import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaCrown, FaStar, FaRocket, FaShieldAlt, FaChartLine } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import PaystackButton from "../../components/PaystackButton";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";

const PREMIUM_AMOUNT = 5000; // ₦5000

const benefits = [
  {
    icon: <FaStar className="text-xl" />,
    title: "Verified Badge",
    description: "Get a verified badge on your profile to build trust with clients",
  },
  {
    icon: <FaRocket className="text-xl" />,
    title: "Priority Job Listings",
    description: "Your proposals appear at the top of client inboxes",
  },
  {
    icon: <FaChartLine className="text-xl" />,
    title: "Better Rankings",
    description: "Higher visibility in search results and job matches",
  },
  {
    icon: <FaShieldAlt className="text-xl" />,
    title: "Unlimited AI Matches",
    description: "Get unlimited AI-powered job matches every day",
  },
  {
    icon: <FaCrown className="text-xl" />,
    title: "Premium Support",
    description: "Priority customer support and faster response times",
  },
  {
    icon: <FaStar className="text-xl" />,
    title: "Featured Profile",
    description: "Your profile gets featured in freelancer search results",
  },
];

export default function PremiumUpgrade({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePaystackSuccess = async (reference) => {
    setLoading(true);
    try {
      await axiosInstance.post("/premium/upgrade", { reference });
      alert("🎉 You are now a Premium member!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Payment succeeded but upgrade failed. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackClose = () => {
    // User closed payment modal
  };

  if (user?.isPremium) {
    return (
      <PageContainer title="Premium Membership" maxWidth="max-w-4xl">
        <Card className="text-center py-12">
          <FaCrown className="mx-auto text-5xl text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            You're already Premium!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enjoy all the benefits of Premium membership.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </a>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Upgrade to Premium"
      subtitle="Unlock exclusive features and grow your freelance business faster"
      maxWidth="max-w-5xl"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Benefits */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Premium Benefits
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pricing Card */}
        <div>
          <Card className="sticky top-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium mb-4">
                <FaCrown />
                Best Value
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">₦5,000</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cancel anytime • No hidden fees
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {benefits.slice(0, 4).map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FaCheck className="text-emerald-500 shrink-0" />
                  <span>{benefit.title}</span>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="w-full py-3 text-center text-indigo-600">Processing...</div>
            ) : (
              <PaystackButton
                email={user?.email || ""}
                amount={PREMIUM_AMOUNT}
                onSuccess={handlePaystackSuccess}
                onClose={handlePaystackClose}
                className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                Upgrade to Premium
              </PaystackButton>
            )}

            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              Secure payment powered by Paystack
            </p>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <Card className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              Can I cancel anytime?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Yes, you can cancel your Premium subscription at any time from your Settings. You'll
              continue to have Premium access until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              Will I get a refund if I cancel?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Premium is billed monthly. If you cancel, you'll keep Premium benefits until the end
              of your current billing cycle. No partial refunds are provided.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              How do I pay?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We accept all major payment methods through Paystack, including cards and bank
              transfers. Your payment is secure and encrypted.
            </p>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
