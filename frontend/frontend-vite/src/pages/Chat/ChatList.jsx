// src/pages/Chat/ChatList.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./ChatList.css";

export default function ChatList({ selectedChatId, chats = [] }) {
  const userId = localStorage.getItem("userId");

  return (
    <div className="chat-list-container">
      {chats.length === 0 && <p style={{ padding: 10 }}>No chats available</p>}
      {chats.map((chat) => (
        <Link
          key={chat._id}
          to={`/chat/${chat._id}`}
          className={`chat-list-item ${selectedChatId === chat._id ? "selected" : ""}`}
        >
          <div className="chat-name">
            {chat.name || chat.participants?.filter((u) => u !== userId)?.[0] || "Unknown"}
          </div>
          {chat.lastMessage && <div className="chat-preview">{chat.lastMessage.text}</div>}
        </Link>
      ))}
    </div>
  );
}
