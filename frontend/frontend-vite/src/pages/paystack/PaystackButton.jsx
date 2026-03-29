import React from "react";
import { PaystackButton } from "react-paystack";

const PaystackPaymentButton = ({ email, amount, onSuccess, onClose }) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100, // NGN in Kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC,
  };

  return (
    <PaystackButton
      {...config}
      text="Pay Now"
      onSuccess={onSuccess}
      onClose={onClose}
      className="paystack-button"
    />
  );
};

export default PaystackPaymentButton;
