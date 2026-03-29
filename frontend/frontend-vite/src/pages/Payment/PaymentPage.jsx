import { useState } from "react";
import { processPayment } from "../../services/paymentService";

export default function PaymentPage({ currentUser }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!currentUser?._id) {
      setError("User not authenticated.");
      return;
    }

    try {
      setLoading(true);

      const response = await processPayment({
        userId: currentUser._id,
        amount: Number(amount),
      });

      if (!response?.paymentUrl) {
        throw new Error("Invalid payment response");
      }

      // Redirect to Paystack / Stripe / Flutterwave
      window.location.href = response.paymentUrl;
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Fund Wallet</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Add money to your SkillAfrik wallet securely.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium mb-2">
          Amount (₦)
        </label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600"
        />

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {loading ? "Processing Payment..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
