import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function WalletPage({ user, refreshUser }) {
  const [available, setAvailable] = useState(0);
  const [escrow, setEscrow] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const fetchWallet = async () => {
    setLoading(true);
    setWarning("");
    try {
      const res = await axiosInstance.get("/wallet");
      const data = res.data ?? {};
      setAvailable(Number.isFinite(data.available) ? data.available : 0);
      setEscrow(Number.isFinite(data.escrow) ? data.escrow : 0);
      setTransactions(Array.isArray(data.transactions) ? data.transactions : []);

      if (data.success === false) {
        setWarning(data.message || "Using fallback wallet values.");
      }
      setError("");
    } catch (err) {
      console.error(err);
      setAvailable(0);
      setEscrow(0);
      setTransactions([]);
      setError(err.response?.data?.message || "Network Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleWithdraw = async () => {
    if (!amount || amount <= 0) return alert("Enter a valid amount");
    try {
      const res = await axiosInstance.post("/wallet/withdraw", {
        amount: Number(amount),
        bank_code: "058",
        account_number: "0123456789",
        account_name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      });
      alert(res.data?.message || "Withdrawal requested");
      setAmount("");
      fetchWallet();
      if (refreshUser) refreshUser();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const getStatusBadge = (status = "") => {
    const value = status.toLowerCase();
    if (value === "completed" || value === "approved" || value === "released") {
      return {
        label: "Released",
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      };
    }
    if (value === "escrow" || value === "held") {
      return {
        label: "In escrow – awaiting client approval",
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      };
    }
    if (value === "failed" || value === "rejected") {
      return {
        label: "Failed",
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      };
    }
    return {
      label: status || "Pending",
      className:
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
    };
  };

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallet</h1>
      </div>

      {/* Balance + escrow + info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Earnings available now
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            ${Number(available).toLocaleString()}
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Funds you can withdraw immediately.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Direct contracts (escrow)
          </p>
          <h2 className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            ${Number(escrow).toLocaleString()}
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Held in escrow until your client approves delivered work.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Actions
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Fund your wallet to pay freelancers or withdraw your earnings.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/dashboard/wallet/fund"
              className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition inline-block"
            >
              Top-up / Fund
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Commission + payment flow notice */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <strong>Payment flow:</strong> When a client funds a contract, money is held in
          escrow. After the client approves your delivered work, funds are released to your
          wallet balance and become available for withdrawal. A 10% platform commission is
          applied on completed jobs.
        </p>
      </div>

      {/* Withdraw Section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Withdraw funds
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="p-3 rounded-lg border w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          <button
            onClick={handleWithdraw}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-500 w-full md:w-auto"
          >
            Request withdrawal
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Transaction history
        </h2>
        {loading && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading transactions...
          </p>
        )}
        {warning && <p className="text-yellow-500 text-sm">{warning}</p>}
        {error && (
          <div className="flex items-center gap-3">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={fetchWallet}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 text-xs"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {!loading && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.length > 0 ? (
                transactions.map((tx) => {
                  const { label, className } = getStatusBadge(tx.status);
                  return (
                    <tr key={tx._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                        {new Date(tx.createdAt || tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                        {tx.type
                          ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1)
                          : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                        ${Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={className}>{label}</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 text-sm"
                  >
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
