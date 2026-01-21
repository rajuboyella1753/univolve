import { useState } from "react";
import api from "../api/api-base";
import { useNavigate } from "react-router-dom";
import SudaraLogo from "../assets/logo3.png";

export default function GirlComplaintForm() {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("problemText", text);
    if (imageFile) formData.append("image", imageFile);
    if (audioFile) formData.append("audio", audioFile);
    if (videoFile) formData.append("video", videoFile);

    try {
      await api.post("/api/gender-complaints/submit", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMsg("✅ Your voice has been heard. Thank you for trusting us.");
      setText("");
      setImageFile(null);
      setAudioFile(null);
      setVideoFile(null);
    } catch (err) {
      console.error(err);
      setMsg("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8 space-y-6">
        <div className="text-center">
          <img src={SudaraLogo} alt="Disha Shield" className="w-14 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-pink-600 mb-2">
            You are Brave. You are Not Alone. 🙏
          </h1>
          <p className="text-gray-600">
            Sudara respects your courage. This complaint is 100% anonymous and will only be seen by trusted Disha officers.
          </p>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          {msg && (
            <div className="text-center text-sm text-blue-700 font-medium">
              {msg}
            </div>
          )}

          <textarea
            className="w-full p-3 border rounded resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Describe the issue clearly..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-semibold mb-1">Upload Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg p-2"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Upload Audio (optional)</label>
            <input
              type="file"
              accept="audio/*"
              className="w-full border rounded-lg p-2"
              onChange={(e) => setAudioFile(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Upload Video (optional)</label>
            <input
              type="file"
              accept="video/*"
              className="w-full border rounded-lg p-2"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-pink-700 transition"
          >
            Submit Complaint
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="text-purple-600 hover:underline font-semibold"
          >
            ⬅️ Back to Dashboard
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          🔒 Your identity is never shared. Only certified Disha officers can view this complaint.
        </p>
      </div>
    </div>
  );
}
