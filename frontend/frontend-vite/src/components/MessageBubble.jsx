// src/components/MessageBubble.jsx
import React from "react";

export default function MessageBubble({ message, isOwn }) {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg shadow ${
          isOwn ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <span className="text-xs text-gray-500 mt-1 block text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
