import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SudaraLogo from "../assets/logo3.png";

const PoliceComplaintForm = () => {
  const [problemText, setProblemText] = useState("");
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DEV_API
      : process.env.REACT_APP_PROD_API;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("problemText", problemText);
    if (image) formData.append("image", image);
    if (audio) formData.append("audio", audio);
    if (video) formData.append("video", video);

    try {
      await axios.post(`${BASE_URL}/api/gender-complaints/submit`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("✅ Complaint submitted successfully.");
      setProblemText("");
      setImage(null);
      setAudio(null);
      setVideo(null);
    } catch (err) {
      console.error("❌ Submit Error:", err);
      setMsg("❌ Failed to submit complaint.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <img src={SudaraLogo} alt="Logo" className="w-14 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Speak Up, Brother! 💪
          </h1>
          <p className="text-gray-600 text-sm">
            This complaint is confidential and seen only by the police.
            Your courage helps us make the campus safer.
          </p>
        </div>

        {/* Message */}
        {msg && (
          <div
            className={`text-center font-medium ${
              msg.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          {/* Problem Description */}
          <textarea
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="Describe the issue clearly..."
            required
            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              📸 Image Evidence
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-2 rounded-lg border max-h-48"
              />
            )}
          </div>

          {/* Audio Upload */}
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              🎧 Audio Evidence
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudio(e.target.files[0])}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {audio && (
              <audio controls className="mt-2 w-full">
                <source src={URL.createObjectURL(audio)} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">
              📹 Video Evidence
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {video && (
              <video controls className="mt-2 w-full max-h-64 rounded-lg">
                <source src={URL.createObjectURL(video)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-800 transition"
          >
            Submit Complaint
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="text-blue-700 hover:underline font-semibold"
          >
            ⬅️ Back to Dashboard
          </button>
        </div>

        {/* Confidentiality Note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          🔒 Only certified police officers can view and respond to this complaint. Your identity is protected.
        </p>
      </div>
    </div>
  );
};

export default PoliceComplaintForm;
