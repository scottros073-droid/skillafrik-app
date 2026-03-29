import React, { useState } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { PaystackButton } from "react-paystack";

const CreateOrder = ({ job, worker }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const amount = job.price * 100; // Paystack expects kobo
  const user = JSON.parse(localStorage.getItem("user"));
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const componentProps = {
    email: user.email,
    amount,
    publicKey,
    text: "Pay Now",
    onSuccess: async (reference) => {
      // Save order
      try {
        await axiosInstance.post("/orders", {
          jobId: job._id,
          workerId: worker._id,
          amount: job.price,
          paymentReference: reference.reference,
        });
        navigate("/orders");
      } catch (err) {
        console.error(err);
      }
    },
    onClose: () => alert("Payment closed"),
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">{job.title}</h2>
      <p className="mb-4">{job.description}</p>
      <PaystackButton {...componentProps} />
    </div>
  );
};

export default CreateOrder;
