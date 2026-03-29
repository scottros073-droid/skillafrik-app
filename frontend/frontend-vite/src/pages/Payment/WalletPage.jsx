import React, { useEffect, useState } from "react";
import { getWallet, initPayment, verifyPayment } from "../../services/paymentService";

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState(1000);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getWallet();
        setWallet(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      // Ask backend to initialize Paystack transaction
      const init = await initPayment({ amount: amount * 100 /* kobo */ });
      // init.data.authorization_url or reference may be returned by your backend
      // For demo, open backend returned url (if provided)
      if (init.data?.authorization_url) {
        window.location.href = init.data.authorization_url;
      } else {
        setMessage("Payment initialized. Complete it in the browser.");
      }
    } catch (err) {
      setMessage("Payment failed to start.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Wallet</h2>
      <p>Balance: {wallet?.balance ?? "0"}</p>
      <form onSubmit={handlePay}>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <button type="submit">Add Funds</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
