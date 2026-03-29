// src/pages/Support.jsx
import SupportWidget from "../components/support/SupportWidget.jsx";

export default function Support() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Contact Support</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Our AI assistant replies instantly. If needed, our human support team will assist you.
      </p>

      {/* AI Chat Widget */}
      <SupportWidget />
    </div>
  );
}
