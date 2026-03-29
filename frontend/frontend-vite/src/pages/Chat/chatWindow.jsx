// src/pages/Chat/ChatWindow.jsx
import React, { useRef, useEffect } from "react";
import MessageBubble from "../../components/MessageBubble";
import "./ChatWindow.css";

export default function ChatWindow({ messages, userId, typing }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="chat-window-container">
      <div className="messages">
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id || msg.createdAt}
            text={msg.text || (msg.attachments && msg.attachments[0])}
            fromMe={msg.from === userId}
            time={msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : null}
          />
        ))}
        {typing && <div className="typing-indicator">The other user is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
