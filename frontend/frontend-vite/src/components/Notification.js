import React from "react";

export default function Notification({ message }) {
  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white p-3 rounded shadow z-50">
      {message}
    </div>
  );
}
