import React, { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import axiosInstance from "../../utils/axios";
import { useParams } from "react-router-dom";

export default function MessageThread() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/messages/${id}`);
        setMessages(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await axiosInstance.post(`/messages/${id}`, { text: newMessage });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-6 flex flex-col h-[80vh]">
        <h1 className="text-3xl font-bold mb-6">Conversation</h1>

        {loading && <p className="text-gray-500">Loading messages...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded ${
                msg.sender === "me" ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"
              } max-w-xs`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
