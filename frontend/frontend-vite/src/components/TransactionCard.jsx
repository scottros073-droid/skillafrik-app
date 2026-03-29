import React from "react";

export default function TransactionCard({ transaction }) {
  return (
    <div className="bg-white shadow rounded p-4 flex justify-between items-center">
      <div>
        <p className="font-medium">{transaction.type}</p>
        <p className="text-gray-500 text-sm">{new Date(transaction.date).toLocaleString()}</p>
      </div>
      <div className={transaction.amount >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
        ${transaction.amount.toFixed(2)}
      </div>
    </div>
  );
}
