// frontend/src/components/Wallet/WalletActions.jsx
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaWallet, FaPlusCircle } from "react-icons/fa";

export default function WalletActions({ user, refreshUser }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddFunds = async () => {
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      alert("❌ Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      // Call backend API to add funds (Paystack integration or direct)
      await axiosInstance.post("/wallet/add", { amount: numericAmount });
      alert(`✅ $${numericAmount.toLocaleString()} added to your wallet!`);
      setAmount("");
      refreshUser(); // refresh wallet stats
    } catch (err) {
      console.error("Failed to add funds:", err);
      alert("❌ Failed to add funds. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition space-y-4">
      <div className="flex items-center gap-3">
        <FaWallet className="text-indigo-600 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Wallet Actions
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <button
          onClick={handleAddFunds}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <FaPlusCircle /> {loading ? "Processing..." : "Add Funds"}
        </button>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
        Current Wallet: <span className="font-semibold">${user.wallet?.toLocaleString() || 0}</span>
      </p>
    </div>
  );
}
