// src/components/support/SupportWidget.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../../context/SocketContext";

export default function SupportWidget() {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi 👋 I’m SkillAfrik Assistant. How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Listen for AI messages from backend
    socket.on("ai_message", ({ text }) => {
      setMessages(prev => [...prev, { role: "ai", text }]);
    });

    // Listen for human support messages
    socket.on("newMessage", msg => {
      setMessages(prev => [...prev, { role: "support", text: msg }]);
    });

    return () => {
      socket.off("ai_message");
      socket.off("newMessage");
    };
  }, [socket]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    // Emit message to backend
    socket.emit("user_message", { message: input, userId: "currentUserId" });

    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 flex flex-col">
      {/* Messages */}
      <div className="h-64 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-primary text-white ml-auto"
                : msg.role === "ai"
                ? "bg-gray-100 dark:bg-gray-700"
                : "bg-yellow-100 dark:bg-yellow-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
