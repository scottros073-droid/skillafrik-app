import React, { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import axiosInstance from "../../utils/axios";
import { Link } from "react-router-dom";

export default function MessagesList() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await axiosInstance.get("/messages");
        setThreads(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        {loading && <p className="text-gray-500">Loading threads...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="divide-y">
            {threads.length > 0 ? (
              threads.map((thread) => (
                <Link
                  key={thread._id}
                  to={`/messages/thread/${thread._id}`}
                  className="block p-4 hover:bg-gray-100 rounded transition"
                >
                  <p className="font-medium">{thread.withUserName}</p>
                  <p className="text-gray-500 text-sm">
                    {thread.lastMessage || "No messages yet"}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center">No messages found</p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
