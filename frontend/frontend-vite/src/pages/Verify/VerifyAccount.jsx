// frontend/src/pages/Verify/VerifyAccount.jsx
import React, { useState } from "react";

const VerifyAccount = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = () => {
    if (!code.trim()) {
      setMessage("Please enter your verification code.");
      return;
    }

    // Simulate verification success
    setMessage("Account verified successfully!");
  };

  return (
    <div className="verify-container">
      <h2 className="verify-title">Verify Your Account</h2>

      <input
        type="text"
        placeholder="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="verify-input"
      />

      <button onClick={handleVerify} className="verify-button">
        Verify
      </button>

      {message && <p className="verify-message">{message}</p>}
    </div>
  );
};

export default VerifyAccount;
