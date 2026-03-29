import { useState } from "react";
import { useUser } from "../../context/UserContext";
import premiumService from "../../services/premiumService";

const PLANS = [
  {
    name: "Free",
    price: 0,
    features: ["Basic marketplace access", "Standard proposal slots", "Community support"],
    key: "free",
  },
  {
    name: "Premium",
    price: 5000,
    features: ["Priority job matching", "Featured profile", "Unlimited proposals", "AI job recommendations"],
    key: "premium",
  },
];

export default function UpgradePage() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const subscribe = async (plan) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await premiumService.upgrade(plan);
      setUser(response.data.user);
      setMessage("Upgrade successful! You are now premium.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Upgrade failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upgrade Plan</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Choose a plan that fits your freelance goals and unlock premium features.</p>

        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.key} className={`rounded-xl p-6 border ${plan.key === "premium" ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800"}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {user?.isPremium && plan.key === "premium" && <span className="text-xs text-green-600 dark:text-green-400">Active</span>}
              </div>
              <p className="text-4xl font-bold mt-4">₦{plan.price}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 dark:text-gray-300">• {f}</li>
                ))}
              </ul>
              <button
                disabled={loading || (plan.key === "premium" && user?.isPremium)}
                onClick={() => subscribe(plan.key)}
                className="mt-6 w-full py-3 text-white rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
              >
                {plan.key === "premium" && user?.isPremium ? "Current plan" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {message && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{message}</p>}
      </div>
    </div>
  );
}
