import { useEffect, useState } from "react";
import axios from "../../utils/axios";

export default function AdminSupport() {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");

  const fetchMessages = async () => {
    const res = await axios.get("/admin/support");
    setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendReply = async (userId) => {
    if (!replyText.trim()) return;

    await axios.post("/admin/support/reply", { userId, text: replyText });
    setReplyText("");
    fetchMessages();
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`/admin/support/${id}/status`, { status });
    fetchMessages();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Support Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {messages.map((msg) => (
          <div key={msg._id} className="border rounded-lg p-4 shadow space-y-2">
            <p><strong>User:</strong> {msg.userId}</p>
            <p><strong>Message:</strong> {msg.message}</p>
            <p><strong>Role:</strong> {msg.role}</p>
            <p><strong>Status:</strong> {msg.status}</p>

            <div className="flex space-x-2">
              <input
                className="flex-1 border rounded px-2"
                placeholder="Reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button
                onClick={() => sendReply(msg.userId)}
                className="bg-primary text-white px-3 rounded"
              >
                Send
              </button>
            </div>

            <div className="flex space-x-2 mt-2">
              <button
                className="bg-green-600 text-white px-2 rounded"
                onClick={() => updateStatus(msg._id, "resolved")}
              >
                Mark Resolved
              </button>
              <button
                className="bg-yellow-500 text-white px-2 rounded"
                onClick={() => updateStatus(msg._id, "open")}
              >
                Reopen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
