import React from "react";
import { Link } from "react-router-dom";

export default function SuspendedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-4xl font-bold mb-4 text-red-600">Account Suspended</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center">
        Your account has been suspended due to a violation of SkillAfrik rules.
        Please contact support if you believe this is a mistake.
      </p>
      <Link
        to="/support"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Contact Support
      </Link>
    </div>
  );
}
