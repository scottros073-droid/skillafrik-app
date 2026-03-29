import { usePaystackPayment } from "react-paystack";

export default function PaystackButton({ amount, email, onSuccess }) {
  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Paystack uses kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  const handleClick = () => {
    initializePayment(
      onSuccess,
      () => {
        alert("Payment closed");
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Pay ₦{amount}
    </button>
  );
}
