import { useState } from "react";

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const send = () => {
    if (!text) return;
    setMessages([...messages, { role: "user", text }]);
    setText("");
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>

      <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className="mb-3">
            <b>{m.role === "user" ? "You" : "AI"}:</b> {m.text}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg p-3"
          placeholder="Ask me anything..."
        />
        <button
          onClick={send}
          className="bg-indigo-600 text-white px-6 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
