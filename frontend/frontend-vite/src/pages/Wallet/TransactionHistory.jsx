import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get("/wallet");
        setTransactions(res.data?.data?.transactions || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Error loading transactions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">Loading transactions...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Transactions</h2>

      {transactions.length === 0 ? (
        <div className="text-gray-500">No transactions found.</div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx._id || tx.id} className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="font-semibold">{tx.description || tx.type || "Transaction"}</p>
              <p>Amount: ₦{tx.amount}</p>
              <p>Status: {tx.status}</p>
              <p>Date: {new Date(tx.createdAt || tx.date || Date.now()).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

