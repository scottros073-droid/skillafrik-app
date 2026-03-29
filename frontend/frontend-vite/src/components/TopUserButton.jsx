// frontend/src/components/TopUserButton.js
import React from "react";

function TopUserButton() {
  const handleTopUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payments/top-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank"); // Opens Paystack sandbox checkout
      } else {
        console.log("No checkout URL returned", data);
      }
    } catch (err) {
      console.error("Error initiating top-user payment:", err);
    }
  };

  return <button onClick={handleTopUser}>Become Top User ($1)</button>;
}

export default TopUserButton;
``
