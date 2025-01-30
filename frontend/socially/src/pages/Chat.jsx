import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MoreVertical,
  Send,
  Phone,
  Video,
  ImagePlus,
  ArrowLeft,
} from "lucide-react";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  // Sample data
  const chats = [
    {
      id: 0,
      name: "AB",
      lastMessage: "See you tomorrow!",
      time: "10:30 AM",
      unread: 2,
      online: true,
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 1,
      name: "BC",
      lastMessage: "How about the project?",
      time: "9:15 AM",
      unread: 0,
      online: true,
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "ASASD",
      lastMessage: "Thanks for the update",
      time: "Yesterday",
      unread: 0,
      online: false,
      avatar: "/api/placeholder/40/40",
    },
  ];

  const messages = [
    { id: 1, text: "Hey, how are you?", sender: "user", time: "10:00 AM" },
    {
      id: 2,
      text: "I'm good! Just working on the new features.",
      sender: "other",
      time: "10:05 AM",
    },
    {
      id: 3,
      text: "That sounds great! Need any help?",
      sender: "user",
      time: "10:10 AM",
    },
    {
      id: 4,
      text: "Could you review my code when you have time?",
      sender: "other",
      time: "10:15 AM",
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  // Chat List Component
  const ChatList = () => (
    <div
      className={`w-full md:w-80 bg-white h-full ${
        selectedChat !== null ? "hidden md:flex" : "flex"
      } flex-col`}
    >
      <div className="p-4 border-b">
        <div className="flex flex-cols gap-1 contents-center">
          <button onClick={() => navigate("/posts")}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold mb-4">Messages</h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatSelect(chat.id)}
            className="flex items-center p-4 cursor-pointer hover:bg-gray-50"
          >
            <div className="relative">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full"
              />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <h2 className="font-semibold">{chat.name}</h2>
                <span className="text-sm text-gray-500">{chat.time}</span>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Chat View Component
  const ChatView = () => (
    <div
      className={`flex-1 flex flex-col h-full ${
        selectedChat === null ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Chat Header */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="md:hidden mr-2 p-1 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <img
            src={chats[selectedChat]?.avatar}
            alt={chats[selectedChat]?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-4">
            <h2 className="font-semibold">{chats[selectedChat]?.name}</h2>
            <p className="text-sm text-gray-500">
              {chats[selectedChat]?.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full hidden md:block">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full hidden md:block">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] md:max-w-md rounded-lg px-4 py-2 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-70">{message.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
            <ImagePlus className="w-6 h-6 text-gray-600" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatList />
      <ChatView />
    </div>
  );
};

export default Chat;
