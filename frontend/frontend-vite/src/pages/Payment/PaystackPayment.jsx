// src/pages/Payment/PaystackPayment.jsx
import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function PaystackPayment({ user, order }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/payments/init", {
        amount: order.amount,
        email: user.email,
        metadata: { orderId: order._id },
      });

      const { authorization_url } = res.data;
      window.location.href = authorization_url; // redirect to Paystack checkout
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500"
      disabled={loading}
    >
      {loading ? "Processing..." : `Pay $${order.amount}`}
    </button>
  );
}
