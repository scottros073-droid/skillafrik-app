// src/components/PremiumUpgradeButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PremiumUpgradeButton({ compact = false }) {
  const navigate = useNavigate();

  return (
    <button
      className="premium-btn"
      onClick={() => navigate("/upgrade")}
      style={{
        padding: compact ? "6px 8px" : "8px 14px",
        cursor: "pointer",
      }}
    >
      Upgrade
    </button>
  );
}
