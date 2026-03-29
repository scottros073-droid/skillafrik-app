import { useEffect, useState } from "react";
import axios from "axios";

export default function SupportDashboard() {
  const [tickets, setTickets] = useState([]);
  const [replyText, setReplyText] = useState("");

  const fetchTickets = async () => {
    const res = await axios.get("/api/support/admin/open");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const sendReply = async (id) => {
    await axios.post("/api/support/admin/reply", {
      messageId: id,
      text: replyText,
    });
    setReplyText("");
    fetchTickets();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Support Dashboard</h1>
      {tickets.length === 0 ? (
        <p>No open tickets.</p>
      ) : (
        tickets.map(ticket => (
          <div key={ticket._id} className="mb-4 p-4 border rounded shadow">
            <h2 className="font-semibold mb-2">{ticket.userId.name}</h2>
            <div className="mb-2">
              {ticket.messages.map((m, i) => (
                <p key={i} className={m.role === "user" ? "text-blue-600" : "text-gray-600"}>
                  <strong>{m.role}:</strong> {m.text}
                </p>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded px-2"
                placeholder="Reply to user"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-3 rounded"
                onClick={() => sendReply(ticket._id)}
              >
                Send
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
