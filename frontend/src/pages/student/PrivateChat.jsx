import React, { useState } from "react";
import api from "../../api/api-base";

export default function PrivateChat({ roomId, messages, setMessages }) {
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await api.post("/privatechat/message", {
        roomId,
        senderId: user._id,
        content: message,
      });
      setMessages((prev) => [...prev, res.data]);
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="border p-4 rounded bg-white shadow-md">
      <div className="max-h-60 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg._id} className={`mb-2 ${msg.sender._id === user._id ? "text-right" : "text-left"}`}>
            <span className="inline-block bg-gray-200 px-3 py-1 rounded">
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-1 ml-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
