import React from "react";

export default function AntiScamPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Anti-Scam Policy</h1>

      <p className="mb-4">
        SkillAfrik operates a zero-tolerance policy against scams.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">What Is Considered a Scam?</h2>
      <ul className="list-disc ml-6">
        <li>Requesting payment outside SkillAfrik</li>
        <li>Sharing phone numbers or emails</li>
        <li>Fake delivery or false claims</li>
        <li>Impersonation</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Automatic Actions</h2>
      <ul className="list-disc ml-6">
        <li>Message blocking</li>
        <li>Account warning</li>
        <li>Wallet freeze</li>
        <li>Permanent ban</li>
      </ul>

      <p className="mt-6 font-semibold text-red-500">
        Any attempt to bypass SkillAfrik payments results in immediate suspension.
      </p>
    </div>
  );
}
