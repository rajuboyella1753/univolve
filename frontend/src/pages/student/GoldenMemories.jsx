// 📁 src/pages/student/GoldenPage.jsx
import React, { useEffect, useState } from "react";
import StudentNavbar from "../StudentNavbar";
import api from "../../api/api-base"; // ✅ centralized API
const BASE_URL = api.defaults.baseURL;

export default function GoldenPage() {
  const [memories, setMemories] = useState([]);
  const [formData, setFormData] = useState({
    caption: "",
    image: null,
  });
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")); // Logged-in user
  const userId = user?._id;
  const userName = user?.name?.trim();

  const fetchMemories = async () => {
    try {
      const res = await api.get("/api/memories");
      setMemories(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData();
    data.append("name", userName);
    data.append("caption", formData.caption.trim());
    data.append("image", formData.image);
    data.append("userId", userId);

    try {
      await api.post("/api/memories", data);
      fetchMemories();
      setFormData({ caption: "", image: null });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Upload failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete this memory?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/memories/${id}`, {
        data: { userId },
      });
      fetchMemories();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const filteredMemories = memories.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      <StudentNavbar />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 📸 Upload Form */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-center min-h-[550px]">
          <h2 className="text-xl font-bold mb-4 text-purple-600 text-center">📸 Share Memory</h2>
          {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

          <form onSubmit={handleUpload} className="space-y-4 flex flex-col justify-center flex-grow">
            <input
              type="text"
              value={userName}
              disabled
              className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
            />
            <textarea
              placeholder="Your Caption"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="w-full border rounded p-2 h-24"
              required
            />
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="w-full"
              required
            />
            <button
              type="submit"
              className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700"
            >
              Share Memory
            </button>
          </form>
        </div>

        {/* 🔍 Search + Memories Grid */}
        <div className="lg:col-span-2">
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredMemories.length === 0 ? (
              <p className="text-gray-500 col-span-full">No memories found.</p>
            ) : (
              filteredMemories.map((mem) => (
                <div key={mem._id} className="bg-white rounded-xl shadow hover:shadow-md p-3">
                  <img
                    src={`${BASE_URL}/uploads/memories/${mem.image}`}
                    alt="Memory"
                    className="rounded-lg object-cover h-48 w-full"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")
                    }
                  />
                  <p className="mt-2 font-semibold text-purple-600">{mem.name}</p>
                  <p className="text-sm text-gray-700">{mem.caption}</p>

                  {mem.userId === userId && (
                    <button
                      onClick={() => handleDelete(mem._id)}
                      className="mt-2 text-sm text-red-600 hover:underline"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
