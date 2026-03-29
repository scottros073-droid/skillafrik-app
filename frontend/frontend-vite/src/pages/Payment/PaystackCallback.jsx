// src/pages/Payment/PaystackCallback.jsx
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPayment } from "../../services/paymentService";

const PaystackCallback = () => {
  const [query] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const reference = query.get("reference");

    if (!reference) {
      // No reference found, fallback to wallet
      navigate("/wallet");
      return;
    }

    const verify = async () => {
      try {
        // Call backend to verify payment
        await verifyPayment(reference);
        navigate("/wallet?status=success");
      } catch (err) {
        console.error("Payment verification failed:", err);
        navigate("/wallet?status=failed");
      }
    };

    verify();
  }, [query, navigate]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>Verifying your payment, please wait...</p>
    </div>
  );
};

export default PaystackCallback;
