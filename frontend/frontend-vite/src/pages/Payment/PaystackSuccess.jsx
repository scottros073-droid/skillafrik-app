// frontend/src/pages/Payment/PaystackSuccess.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PaystackSuccess() {
  const { reference } = useParams();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/payments/verify/${reference}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStatus(res.data.status); // 'success', 'failed', etc.
      } catch (err) {
        console.error(err);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment {status || "Processing..."}</h2>
      {status === "success" && <p>🎉 Thank you! Your payment was successful.</p>}
      {status === "failed" && <p>❌ Payment failed. Please try again.</p>}
      {!status && <p>⏳ Verifying payment...</p>}
    </div>
  );
}
