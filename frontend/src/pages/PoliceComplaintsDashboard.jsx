import { useEffect, useState } from "react";
import api from "../api/api-base";
import PoliceNavbar from "../components/PoliceNavbar";

export default function PoliceComplaintsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DEV_API
      : process.env.REACT_APP_PROD_API;

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/api/gender-complaints/boys", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setComplaints(res.data.complaints);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, text = "") => {
    try {
      const remark = {
        text,
        by: "Police Officer",
        at: new Date().toISOString(),
      };

      await api.put(
        `/api/gender-complaints/update-status/${id}`,
        { status, remark },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("✅ Status updated");
      fetchComplaints();
    } catch (err) {
      console.error("❌ Status update failed:", err);
      alert("❌ Status update failed");
    }
  };

  const filteredComplaints = complaints
    .filter((c) => c.status !== "solved")
    .filter((c) =>
      c.problemText.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <PoliceNavbar />

      {/* Header / Vision */}
      <div className="bg-white shadow text-center p-4 mb-4">
        <h2 className="text-xl font-bold text-gray-700">Our Mission</h2>
        <p className="text-gray-600 text-sm mt-1">
          Empowering male students with justice. Confidentially. Swiftly.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="🔍 Search complaints..."
          className="w-[90%] max-w-xl p-2 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-10">
        {loading ? (
          <p className="text-center col-span-full text-gray-500">Loading complaints...</p>
        ) : filteredComplaints.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No complaints found.</p>
        ) : (
          filteredComplaints.map((c) => (
            <div
              key={c._id}
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all max-h-[550px] overflow-y-auto"
            >
              {/* Media: Image */}
              {c.image && (
                <img
                  src={`${BASE_URL}${c.image}`}
                  alt="Complaint Visual"
                  className="w-full h-44 object-cover rounded mb-3"
                />
              )}

              {/* Media: Audio */}
              {c.audio && (
                <audio controls className="w-full my-2">
                  <source src={`${BASE_URL}${c.audio}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              )}

              {/* Media: Video */}
              {c.video && (
                <video
                  controls
                  className="w-full rounded mt-2 mb-3 max-h-52 object-cover"
                >
                  <source src={`${BASE_URL}${c.video}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Problem Text */}
              <p className="text-gray-800 mb-2 whitespace-pre-line">
                {c.problemText}
              </p>

              {/* Metadata */}
              <p className="text-sm text-gray-500 mb-1">
                📅 {new Date(c.submittedAt).toLocaleString()}
              </p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={`font-bold px-2 py-1 rounded ${
                    c.status === "solved"
                      ? "bg-green-100 text-green-700"
                      : c.status === "in progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.status || "Pending"}
                </span>
              </p>

              {/* Officer Remarks */}
              {c.officerRemarks?.length > 0 && (
                <div className="text-sm text-blue-600 mt-1 space-y-1">
                  {c.officerRemarks.map((r, idx) => (
                    <div key={idx}>
                      <strong>{r.by}:</strong> {r.text} <br />
                      <span className="text-gray-400 text-xs">
                        {new Date(r.at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 space-y-2">
                {c.status !== "in progress" && (
                  <button
                    onClick={() => updateStatus(c._id, "in progress")}
                    className="w-full bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                  >
                    🚧 Mark as In Progress
                  </button>
                )}
                {c.status !== "solved" && (
                  <button
                    onClick={() => {
                      const remarks = prompt("Enter any remarks before solving:");
                      if (remarks !== null) {
                        updateStatus(c._id, "solved", remarks);
                      }
                    }}
                    className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
                  >
                    ✅ Mark as Solved
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-3">
        © 2025 Sudara | Powered by Students 🚔
      </footer>
    </div>
  );
}
