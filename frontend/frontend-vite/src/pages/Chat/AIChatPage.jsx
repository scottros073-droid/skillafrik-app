// AI Chat Assistant - FAQ / basic tips, free version
import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";

export default function AIChatPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your SkillAfrik assistant. Ask me about freelancing tips, platform features, jobs, wallet, or anything else." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await axiosInstance.post("/ai/assistant/chat", { message: text });
      const reply = res.data.reply || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: err.response?.data?.message || "Something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Chat Assistant</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Ask about freelancing, platform features, and tips.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 ${
                msg.role === "user"
                  ? "bg-[#2563EB] text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
              <span className="text-gray-500 animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
