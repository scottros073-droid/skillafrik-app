import React from "react";

export default function PaymentPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Payment & Escrow Policy</h1>

      <p>
        SkillAfrik uses a secure escrow system to protect both clients and freelancers.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How Escrow Works</h2>
      <ol className="list-decimal ml-6">
        <li>Client funds the job</li>
        <li>Funds are held securely</li>
        <li>Freelancer delivers work</li>
        <li>Client approves delivery</li>
        <li>Funds are released</li>
      </ol>

      <h2 className="text-xl font-semibold mt-6 mb-2">Platform Fees</h2>
      <p>
        SkillAfrik charges a 10% service fee per completed transaction.
      </p>
    </div>
  );
}
