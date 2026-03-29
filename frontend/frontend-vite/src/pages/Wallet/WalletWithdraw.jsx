import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function WalletWithdraw({ user }) {
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?._id) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/withdraw/${user._id}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Enter a valid amount");
    }

    try {
      setWithdrawing(true);
      setError("");

      const payload = {
        userId: user._id,
        amount: Number(amount),
        bankDetails: {
          bankName: user.bankName || "Not Provided",
          accountNumber: user.accountNumber || "Not Provided",
          accountName: `${user.firstName} ${user.lastName || ""}`,
        },
      };

      const res = await axios.post(`${API}/withdraw`, payload);

      alert(res.data.message || "Withdrawal requested successfully");
      setAmount("");
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setWithdrawing(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading user…
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Withdraw Funds
      </h2>

      {/* Withdraw Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
        <label className="block mb-2 text-gray-600 dark:text-gray-300">
          Amount
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-3 rounded-lg border dark:bg-gray-900 dark:text-white"
        />

        <button
          onClick={handleWithdraw}
          disabled={withdrawing}
          className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500 disabled:opacity-50"
        >
          {withdrawing ? "Processing..." : "Request Withdrawal"}
        </button>

        {error && (
          <p className="mt-3 text-red-500 text-sm">{error}</p>
        )}
      </div>

      {/* Transactions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Transaction History
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="divide-y">
            {transactions.map((t) => (
              <li key={t._id} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    {t.type.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₦{t.amount.toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    t.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : t.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
