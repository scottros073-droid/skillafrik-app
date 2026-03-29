// frontend/src/components/Loader.jsx
import React from "react";
import "./Loader.css"; // optional CSS file for styling

const Loader = ({ size = 50, color = "#4CAF50", text = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div
        className="loader-spinner"
        style={{
          width: size,
          height: size,
          border: `6px solid ${color}`,
          borderTopColor: "transparent",
        }}
      ></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
