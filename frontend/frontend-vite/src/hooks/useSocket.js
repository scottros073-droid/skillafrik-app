import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket(userId) {
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (!userId) return;

    socket.current = io(import.meta.env.VITE_API_URL);
    socket.current.emit("user:online", { userId });

    socket.current.on("online:update", (users) => {
      setOnlineUsers(users);
    });

    socket.current.on("chat:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.current.on("typing", ({ chatId, from }) => {
      setTypingUsers((prev) => ({ ...prev, [chatId]: from }));
      setTimeout(() => setTypingUsers((prev) => ({ ...prev, [chatId]: null })), 2000);
    });

    return () => socket.current.disconnect();
  }, [userId]);

  const sendMessage = (msg) => {
    socket.current.emit("chat:message", msg);
  };

  const sendTyping = (chatId) => {
    socket.current.emit("typing", { chatId, from: userId });
  };

  return { onlineUsers, messages, typingUsers, sendMessage, sendTyping };
}
