// frontend/src/components/WalletCard.jsx
import React from "react";

export default function WalletCard({ balance, onUpgrade }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Balance Info */}
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Wallet Balance</p>
        <p className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          ${balance.toFixed(2)}
        </p>
      </div>

      {/* Upgrade Button */}
      <button
        onClick={onUpgrade}
        className="bg-primary hover:bg-accent text-white font-medium px-5 py-2 rounded-lg transition-colors duration-200"
      >
        Upgrade / Top-up
      </button>
    </div>
  );
}
