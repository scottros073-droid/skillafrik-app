// =============================
// ChatPage.jsx
// Real-time chat with typing indicator
// =============================
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

export default function ChatPage({ currentUser }) {
  const { roomId } = useParams();
  const socket = useSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // 🔹 Handle incoming messages
    const handleNewMessage = (msg) => {
      if (msg.chatId === roomId || msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    // 🔹 Handle typing indicators
    const handleTyping = ({ chatId, from }) => {
      if (chatId === roomId && from !== currentUser?._id) {
        setTypingUsers((prev) => [...new Set([...prev, from])]);
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== from));
        }, 2000);
      }
    };

    socket.emit("joinRoom", roomId);

    socket.on("chat:message", handleNewMessage);
    socket.on("chat:typing", handleTyping);
    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("chat:message", handleNewMessage);
      socket.off("chat:typing", handleTyping);
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [socket, roomId, currentUser?._id]);

  // 🔹 Send a message
  const sendMessage = () => {
    if (!input.trim()) return;

    const msgData = {
      chatId: roomId,
      from: currentUser?._id,
      sender: currentUser?.firstName,
      text: input,
      attachments: [],
    };

    socket.emit("chat:message", msgData);
    socket.emit("sendMessage", { roomId, message: input, sender: currentUser?.firstName });

    setMessages((prev) => [...prev, msgData]);
    setInput("");
  };

  // 🔹 Emit typing event
  const handleTyping = () => {
    socket.emit("chat:typing", { chatId: roomId, from: currentUser?._id });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-md break-words ${
              msg.from === currentUser?._id || msg.sender === currentUser?.firstName
                ? "bg-indigo-600 text-white ml-auto"
                : "bg-white dark:bg-gray-800 text-gray-900"
            }`}
          >
            <p>{msg.text || msg.message}</p>
            <span className="text-xs mt-1 block text-gray-400">
              {msg.sender || msg.from}
            </span>
          </div>
        ))}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="italic text-sm text-gray-500">
            {typingUsers.join(", ")} typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex p-4 bg-white dark:bg-gray-800 gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleTyping}
          className="flex-1 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
