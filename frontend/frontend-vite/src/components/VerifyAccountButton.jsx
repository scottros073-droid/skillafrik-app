import React from "react";

function VerifyAccountButton() {
  const handleVerify = async () => {
    const res = await fetch("http://localhost:5000/api/payments/verify-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (data.checkoutUrl) {
      window.open(data.checkoutUrl, "_blank"); // opens Paystack checkout
    }
  };

  return <button onClick={handleVerify}>Verify Account ($1)</button>;
}

export default VerifyAccountButton;
