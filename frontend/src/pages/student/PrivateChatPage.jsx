import React, { useState } from "react";
import api from "../../api/api-base";
import PrivateChat from "./PrivateChat";
import StuNav from "../StudentNavbar";

export default function PrivateChatPage() {
  const [room, setRoom] = useState(null);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const sendReq = async () => {
    if (!email.trim()) return alert("Please enter a valid email.");

    try {
      setSending(true);

      const res = await api.post(
        "/api/private/request",
        { toEmail: email },
        config
      );

      alert(res.data.message || "Request sent. Wait for approval.");
      setEmail("");
    } catch (err) {
      const msg = err.response?.data?.error || "Error sending request.";
      alert(msg);
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pt-24">
      <StuNav />

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 px-4 md:px-0">
        {/* 🔹 Left Panel: Send Request */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">
            🔐 Start Private Chat
          </h1>

          <div className="flex flex-col gap-4 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter student email"
              className="px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 ring-blue-500"
            />
            <button
              onClick={sendReq}
              disabled={sending}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {sending ? "Sending..." : "Start Chat"}
            </button>
          </div>
        </div>

        {/* 💬 Right Panel: Chat Box (optional if request accepted) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[500px]">
          {room ? (
            <PrivateChat room={room} />
          ) : (
            <p className="text-gray-400">No chat opened yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
