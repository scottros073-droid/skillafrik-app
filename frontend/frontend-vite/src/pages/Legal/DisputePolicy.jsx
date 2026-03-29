import React from "react";

export default function DisputePolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Dispute & Refund Policy</h1>

      <p>
        If a disagreement occurs, either party may open a dispute.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Dispute Process</h2>
      <ul className="list-disc ml-6">
        <li>Dispute opened</li>
        <li>Funds frozen</li>
        <li>Admin review</li>
        <li>Final decision</li>
      </ul>

      <p className="mt-4">
        Admin decisions are final and binding.
      </p>
    </div>
  );
}
