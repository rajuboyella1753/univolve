// 📁 src/pages/student/AIChatMentor.jsx

import React, { useState, useEffect, useRef } from "react";
import StuNav from "../StudentNavbar";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PROD_API;

export default function AIChatMentor() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Namaste! I'm Sudara AI – your student life guide. Ask me anything about student rights, life struggles, fitness, or emotional strength. I'm here for you! 💪✨",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
        const res = await fetch(`${BASE_URL}/api/ai-mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          userId: JSON.parse(localStorage.getItem("user"))?._id || "guest",
        }),
      });

      const data = await res.json();
      const botMsg = { sender: "ai", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ I'm facing trouble replying right now. Please try again soon!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 flex flex-col">
      <StuNav />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 mt-16 mb-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center text-purple-700 mb-6"
        >
          💬 Sudara AI Mentor
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-5 h-[65vh] overflow-y-auto space-y-4 border border-purple-300"
        >
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start space-x-2 max-w-xl ${
                  msg.sender === "user" ? "ml-auto justify-end" : "mr-auto"
                }`}
              >
                {msg.sender === "ai" && <FaRobot className="mt-1 text-purple-600" />}
                {msg.sender === "user" && <FaUser className="mt-1 text-green-600" />}
                <div
                  className={`px-4 py-3 rounded-xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-green-100 text-right"
                      : "bg-purple-50 text-left"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 animate-pulse"
            >
              Sudara AI is thinking...
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border border-purple-400 rounded-full px-4 py-2 outline-none shadow-md"
            placeholder="Ask me anything... (e.g. What is IPC 376?)"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-5 py-2 rounded-full shadow-md"
          >
            <FaPaperPlane />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
