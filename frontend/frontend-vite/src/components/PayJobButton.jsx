import React from "react";
import { usePaystackPayment } from "react-paystack";
import axiosInstance from "../utils/axios";

export default function PayJobButton({ job, clientEmail, onSuccess }) {
  const config = {
    reference: new Date().getTime().toString(),
    email: clientEmail,
    amount: job.budget * 100, // Paystack uses kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  const handleClick = () => {
    initializePayment(async (reference) => {
      try {
        // Verify payment and update backend
        const res = await axiosInstance.post(`/payments/job/${job._id}/pay`, {
          reference: reference.reference,
        });
        alert(res.data.message);
        onSuccess?.(res.data);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Payment failed");
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      Pay ${job.budget}
    </button>
  );
}
