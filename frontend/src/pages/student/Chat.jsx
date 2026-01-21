import React, { useEffect, useState, useRef } from "react";
import api from "../../api/api-base";
import StuNav from "../StudentNavbar";

export default function GroupChat({ currentUser }) {
  const [group, setGroup] = useState(null);
  const [allReplies, setAllReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [emails, setEmails] = useState([""]);
  const [groupName, setGroupName] = useState("");
  const [limit, setLimit] = useState(1);
  const [pendingInvites, setPendingInvites] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch messages when group is set
  useEffect(() => {
    if (!group || !group._id) return;
    const fetchReplies = async () => {
      try {
        const response = await api.get(`/api/chat/${group._id}/messages`);
        setAllReplies(response.data);
      } catch (error) {
        console.error("Error fetching group messages:", error);
      }
    };
    fetchReplies();
  }, [group]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allReplies]);

  // Fetch invites on load
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await api.get(`/api/group-invite/my-invites/${currentUser._id}`);
        setPendingInvites(res.data);
      } catch (err) {
        console.error("Error fetching invites:", err);
      }
    };

    fetchInvites();
  }, [currentUser]);

  // Accept/Reject Invite
  const respondToInvite = async (inviteId, status) => {
    try {
      const res = await api.post("/api/group-invite/respond", {
        inviteId,
        userId: currentUser._id,
        status,
      });

      alert(`Invite ${status}`);
      setPendingInvites((prev) => prev.filter((i) => i._id !== inviteId));

      if (res.data.groupRoom) {
        setGroup(res.data.groupRoom); // Load chat if group was activated
      }
    } catch (err) {
      console.error("Failed to respond:", err);
      alert("Failed to update invite status.");
    }
  };

  const handlePostReply = async () => {
    if (!newReply.trim() || !group) return;
    try {
      const response = await api.post(`/api/chat/text`, {
        roomId: group._id,
        content: newReply,
      });
      setAllReplies((prev) => [...prev, response.data]);
      setNewReply("");
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || emails.length !== limit || emails.some((e) => !e.trim())) {
      alert("Fill all email fields and provide group name");
      return;
    }

    try {
      const response = await api.post("/api/group/create", {
        name: groupName,
        members: emails,
      });
      setGroup(response.data);
    } catch (error) {
      console.error("Error creating group:", error);
      alert(error.response?.data?.error || "Group creation failed");
    }
  };

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const handleLimitChange = (value) => {
    const num = parseInt(value);
    setLimit(num);
    setEmails(Array(num).fill(""));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <StuNav />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-1/3 border-r bg-white p-6 overflow-y-auto">
          {/* Show pending invites */}
          {pendingInvites.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Pending Group Invites
              </h3>
              {pendingInvites.map((invite) => (
                <div key={invite._id} className="border p-3 rounded-md mb-2 bg-gray-100">
                  <p className="font-medium text-gray-800">Group: {invite.groupName}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => respondToInvite(invite._id, "accepted")}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respondToInvite(invite._id, "rejected")}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!group ? (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-purple-700">
                Create Group Chat
              </h2>

              <input
                type="text"
                placeholder="Group name"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />

              <select
                className="w-full border p-2 rounded-md"
                value={limit}
                onChange={(e) => handleLimitChange(e.target.value)}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} members
                  </option>
                ))}
              </select>

              <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2">
                {emails.map((email, index) => (
                  <input
                    key={index}
                    type="email"
                    placeholder={`Member ${index + 1} email`}
                    className="w-full border p-2 rounded-md"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                ))}
              </div>

              <button
                onClick={handleCreateGroup}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Create Group
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-blue-700">
                Group: {group.name}
              </h2>
              <p className="text-sm text-gray-600">
                Members: {group.users?.length ?? 0}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {group ? (
              allReplies.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">
                  No messages yet.
                </p>
              ) : (
                allReplies.map((reply, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-[75%] shadow-sm ${
                      reply.sender.name === currentUser?.name
                        ? "ml-auto bg-blue-100 text-right"
                        : "mr-auto bg-gray-200"
                    }`}
                  >
                    <p className="text-gray-800 whitespace-pre-line">
                      {reply.content}
                    </p>
                    <div className="text-xs text-gray-600 mt-1">
                      — {reply.sender.name}
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="text-center text-gray-500 mt-24 text-lg">
                Please create a group to start chatting.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {group && (
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-4">
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring focus:border-blue-500"
                  rows={2}
                />
                <button
                  onClick={handlePostReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
