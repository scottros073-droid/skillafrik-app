// Mock service for chat
import ChatService from "../../services/ChatService"; // Make sure this exists if needed

// Mock chat data
let chatData = [
  {
    _id: "1",
    name: "Alice",
    participants: ["1", "2"],
    lastMessage: { text: "Hello!" },
  },
  {
    _id: "2",
    name: "Bob",
    participants: ["1", "3"],
    lastMessage: { text: "Hey!" },
  },
];

// Mock messages data
let messagesData = {
  "1": [{ _id: "m1", from: "1", text: "Hi Alice!", createdAt: new Date() }],
  "2": [{ _id: "m2", from: "3", text: "Hey Bob!", createdAt: new Date() }],
};

// Get chats for a user
export const getChats = async (userId) => {
  return chatData.filter((chat) => chat.participants.includes(userId));
};

// Get messages for a chat
export const getMessages = async (chatId) => {
  return messagesData[chatId] || [];
};

// Send a new message
export const sendMessageAPI = async ({ chatId, from, text, attachments }) => {
  const newMsg = {
    _id: Date.now().toString(),
    from,
    text,
    attachments,
    createdAt: new Date(),
  };
  if (!messagesData[chatId]) messagesData[chatId] = [];
  messagesData[chatId].push(newMsg);
  return newMsg;
};

// Mock file upload
export const uploadFile = async (file) => {
  return { url: URL.createObjectURL(file) };
};
