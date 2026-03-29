import React, { useState } from "react";
import { FaSearch, FaPaperPlane, FaPhone, FaVideo, FaEllipsisV } from "react-icons/fa";

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");

  const conversations = [
    {
      id: 1,
      name: "John Client",
      avatar: "JC",
      lastMessage: "Great work on the design!",
      timestamp: "2 min",
      unread: true,
      online: true,
    },
    {
      id: 2,
      name: "Sarah Designer",
      avatar: "SD",
      lastMessage: "Can you start tomorrow?",
      timestamp: "1 hour",
      unread: false,
      online: false,
    },
    {
      id: 3,
      name: "Mike Developer",
      avatar: "MD",
      lastMessage: "Thanks for the update",
      timestamp: "1 day",
      unread: false,
      online: true,
    },
  ];

  const messages = [
    { id: 1, sender: "other", text: "Hi, are you available for the project?", timestamp: "10:30 AM" },
    { id: 2, sender: "me", text: "Yes, I'm available. When would you like to start?", timestamp: "10:32 AM" },
    { id: 3, sender: "other", text: "Great! We can start from tomorrow.", timestamp: "10:35 AM" },
    { id: 4, sender: "me", text: "Perfect. I'll send you my proposal today.", timestamp: "10:36 AM" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      {/* Conversations List */}
      <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full px-6 py-4 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${
                selectedConversation === conv.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold relative ${
                  conv.online ? "bg-green-500" : "bg-gray-400"
                }`}>
                  {conv.avatar}
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold text-gray-900 ${conv.unread ? "font-bold" : ""}`}>
                    {conv.name}
                  </h4>
                  <p className={`text-xs mt-1 truncate ${conv.unread ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                    {conv.lastMessage}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{conv.timestamp}</p>
                  {conv.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 ml-auto"></div>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat View */}
      {selectedConversation ? (
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                JC
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">John Client</h3>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FaPhone size={18} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FaVideo size={18} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FaEllipsisV size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "me"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-blue-100" : "text-gray-500"}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <FaPaperPlane size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
