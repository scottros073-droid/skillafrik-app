import React, { useState } from "react";
import { initPayment } from "../../services/paymentService";

export default function PremiumUpgradePage() {
  const [message, setMessage] = useState("");
  const handleUpgrade = async () => {
    try {
      const res = await initPayment({ amount: 5000 * 100, purpose: "upgrade" });
      if (res.data?.authorization_url) window.location.href = res.data.authorization_url;
      else setMessage("Started upgrade payment.");
    } catch (err) {
      setMessage("Failed to start upgrade.");
    }
  };

  return (
    <div>
      <h2>Premium Upgrade</h2>
      <button onClick={handleUpgrade}>Upgrade Now</button>
      {message && <p>{message}</p>}
    </div>
  );
}
