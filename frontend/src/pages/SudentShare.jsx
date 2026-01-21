

// ! new code 
import { useEffect, useState } from "react";
import axios from "axios";

import api from "../api/api-base"; // adjust path if your api.js is elsewhere
export default function StudentShare() {
  const [text, setText] = useState("");
  const [problems, setProblems] = useState([]);
  const [editProblemId, setEditProblemId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyEdit, setReplyEdit] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const gender = user.gender;


const fetchProblems = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const gender = user?.gender;

    if (!gender) {
      console.error("⚠️ Gender missing from user object");
      return;
    }

    const res = await api.get(`/api/problems/${gender}`);
    console.log("🚀 Problems fetched:", res.data);
    setProblems(res.data);
  } catch (err) {
    console.error("❌ Fetch Problems Failed:", err);
  }
};




const handleSubmit = async (e) => {
  e.preventDefault();
  if (!text.trim()) return;

  try {
    const res = await api.post(`/api/problems`, {
      text,
      gender,
    });

    setProblems([res.data, ...problems]);
    setText("");
  } catch (err) {
    console.error("❌ Post Problem Failed:", err);
  }
};

const handleReply = async (id, replyText) => {
  if (!replyText.trim()) return;

  try {
    await api.post(`/api/problems/${id}/reply`, {
      text: replyText,
    });

    fetchProblems();
  } catch (err) {
    console.error("❌ Post Reply Failed:", err);
  }
};


const handleDeleteProblem = async (id) => {
  try {
    await api.delete(`/api/problems/${id}`);
    fetchProblems();
  } catch (err) {
    console.error("❌ Delete Problem Failed:", err);
  }
};


const handleDeleteReply = async (problemId, replyIndex) => {
  try {
    await api.delete(`/api/problems/${problemId}/reply/${replyIndex}`);
    fetchProblems();
  } catch (err) {
    console.error("❌ Delete Reply Failed:", err);
  }
};


const handleEditProblem = async (id) => {
  try {
    await api.put(`/api/problems/${id}`, {
      text: editText,
    });

    setEditProblemId(null);
    fetchProblems();
  } catch (err) {
    console.error("❌ Edit Problem Failed:", err);
  }
};


const handleEditReply = async (problemId, replyIndex) => {
  try {
    const updatedText = replyEdit[`${problemId}-${replyIndex}`];

    if (!updatedText.trim()) return;

    await api.put(`/api/problems/${problemId}/reply/${replyIndex}`, {
      text: updatedText,
    });

    // ✅ Now fetch latest problem list
    await fetchProblems();

    // ✅ Only after successful fetch, remove edit mode
    setReplyEdit((prev) => {
      const updated = { ...prev };
      delete updated[`${problemId}-${replyIndex}`];
      return updated;
    });

  } catch (err) {
    console.error("❌ Edit Reply Failed:", err);
  }
};

useEffect(() => {
  fetchProblems();
}, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* <StudentNavbar/> */}
{/* 🔙 Back to Dashboard Button */}
  <div className="mb-4">
    <button
      onClick={() => window.location.href = "/student/dashboard"} // ✅ Adjust route if needed
      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow transition"
    >
      🏠 Back to Dashboard
    </button>
  </div>
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8 animate-fade-in-up">
        📣 Anonymous Problem Sharing
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-10 animate-fade-in-up">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none mb-4"
          placeholder="💬 Share your problem anonymously..."
          rows={4}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition w-full sm:w-auto"
        >
          ✨ Post Problem
        </button>
      </form>

      {problems.map((problem) => (
        <div key={problem._id} className="bg-white p-6 rounded-xl shadow-lg mb-6 animate-fade-in-up">
          {editProblemId === problem._id ? (
            <>
              <textarea
                className="w-full p-3 border rounded mb-2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => handleEditProblem(problem._id)} className="text-sm px-3 py-1 bg-green-500 text-white rounded">
                  Save
                </button>
                <button onClick={() => setEditProblemId(null)} className="text-sm px-3 py-1 bg-gray-300 rounded">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-800 text-base mb-4">📝 {problem.text}</p>
              <div className="flex gap-2 text-sm mb-4">
                <button onClick={() => { setEditProblemId(problem._id); setEditText(problem.text); }} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDeleteProblem(problem._id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </>
          )}

          <div className="mt-4">
            <p className="font-semibold text-sm text-blue-600 mb-2">💬 Replies:</p>
            <div className="space-y-2">
              {problem.replies.map((r, i) => (
                <div key={i} className="bg-blue-50 text-sm text-gray-700 p-3 rounded-lg border border-blue-100 shadow-sm relative">
                  {replyEdit[`${problem._id}-${i}`] !== undefined ? (
                    <>
                      <input
                        value={replyEdit[`${problem._id}-${i}`]}
                        onChange={(e) =>
                          setReplyEdit((prev) => ({
                            ...prev,
                            [`${problem._id}-${i}`]: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded"
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEditReply(problem._id, i)} className="text-xs bg-green-500 text-white px-2 py-1 rounded">Save</button>
                        <button onClick={() => setReplyEdit((prev) => {
                          const updated = { ...prev };
                          delete updated[`${problem._id}-${i}`];
                          return updated;
                        })} className="text-xs bg-gray-300 px-2 py-1 rounded">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      {r.text}
                      <div className="flex justify-end gap-2 text-xs mt-1">
                        <button onClick={() =>
                          setReplyEdit((prev) => ({ ...prev, [`${problem._id}-${i}`]: r.text }))
                        } className="text-blue-500 hover:underline">Edit</button>
                        <button onClick={() => handleDeleteReply(problem._id, i)} className="text-red-500 hover:underline">Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const reply = e.target.reply.value;
                handleReply(problem._id, reply);
                e.target.reset();
              }}
              className="mt-4 flex gap-2 items-center"
            >
              <input
                name="reply"
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="✍️ Write a reply..."
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}


