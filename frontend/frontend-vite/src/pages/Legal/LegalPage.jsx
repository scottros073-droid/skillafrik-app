// src/pages/Legal/LegalPage.jsx
import React from "react";

// Named exports in case you want to use these sections individually
export const TermsSection = () => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-2">Terms of Service</h2>
    <p className="text-gray-600 dark:text-gray-300">
      By using SkillAfrik, you agree to our terms and conditions.
    </p>
  </section>
);

export const PrivacySection = () => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-2">Privacy Policy</h2>
    <p className="text-gray-600 dark:text-gray-300">
      We respect your privacy and protect your personal information.
    </p>
  </section>
);

export const PaymentsSection = () => (
  <section>
    <h2 className="text-xl font-semibold mb-2">Payments & Refunds</h2>
    <p className="text-gray-600 dark:text-gray-300">
      All payments are handled securely through SkillAfrik wallet.
    </p>
  </section>
);

// Main default export
export default function LegalPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Legal & Policies</h1>

      <TermsSection />
      <PrivacySection />
      <PaymentsSection />
    </div>
  );
}
