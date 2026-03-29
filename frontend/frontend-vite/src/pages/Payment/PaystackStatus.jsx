// frontend/src/pages/Payment/PaystackStatus.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaystackStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const status = query.get("status");
  const reference = query.get("reference");

  const handleGoBack = () => {
    navigate("/wallet"); // redirect to wallet page
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {status === "success" ? (
        <>
          <h2>Payment Successful! 🎉</h2>
          <p>Thank you for your payment.</p>
        </>
      ) : (
        <>
          <h2>Payment Failed ❌</h2>
          <p>Please try again or contact support.</p>
        </>
      )}
      {reference && <p>Reference: {reference}</p>}
      <button
        onClick={handleGoBack}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        Go Back to Wallet
      </button>
    </div>
  );
};

export default PaystackStatus;
