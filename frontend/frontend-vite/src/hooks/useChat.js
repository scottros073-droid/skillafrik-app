import { useState, useEffect } from "react";
import { getChats, getMessages, sendMessageAPI } from "../services/chatService";

export default function useChat({ chatId, userId }) {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  // Fetch all chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const allChats = await getChats(userId);
        setChats(allChats);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, [userId]);

  // Fetch messages when chatId changes
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const msgs = await getMessages(chatId);
        setMessages(msgs);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [chatId]);

  // Send a new message
  const sendMessage = async ({ text, attachments }) => {
    if (!chatId) return;

    try {
      const newMsg = await sendMessageAPI({ chatId, from: userId, text, attachments });
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Simulate typing indicator
  const sendTyping = (isTyping) => {
    setTyping(isTyping);
    if (isTyping) {
      setTimeout(() => setTyping(false), 2000); // reset typing after 2s
    }
  };

  return { chats, messages, typing, sendMessage, sendTyping };
}
