import { useEffect, useState } from "react";
import api from "../api/api-base";
import { LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DishaComplaintsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DEV_API
      : process.env.REACT_APP_PROD_API;

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/api/gender-complaints/girls", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data.complaints.filter((c) => c.status !== "solved"));
      } catch (err) {
        console.error("Failed to load complaints", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status, remarkText = "") => {
    const token = localStorage.getItem("token");
    const officerName = localStorage.getItem("name") || "Officer";

    const remarkObj = {
      text: remarkText,
      by: officerName,
      at: new Date(),
    };

    try {
      await api.put(
        `/api/gender-complaints/update-status/${id}`,
        { status, remark: remarkObj },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                status,
                officerRemarks: [...(c.officerRemarks || []), remarkObj],
              }
            : c
        )
      );
    } catch (error) {
      console.error("Status update failed", error);
      alert("Failed to update status.");
    }
  };

  

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredComplaints = complaints.filter((c) =>
    (c.problemText || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Disha Officer Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/disha-solved")}
            className="bg-white text-blue-900 px-3 py-1 rounded hover:bg-blue-200"
          >
            ✅ Solved Cases
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Vision */}
      <section className="bg-white text-center py-4 shadow">
        <h2 className="text-lg font-semibold">🌟 Sudara Vision</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Sudara aims to create a safe, supportive, and empowering college platform for every student, especially girls in need of help and support.
        </p>
      </section>

      {/* Search */}
      <div className="p-4 flex justify-center bg-gray-100">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        </div>
      </div>

      {/* Complaints */}
      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {loading ? (
          <p className="text-gray-600 text-center">Loading complaints...</p>
        ) : filteredComplaints.length === 0 ? (
          <p className="text-gray-600 text-center">No matching complaints found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredComplaints.map((c) => (
              <div
                key={c._id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition border border-gray-200 max-h-[550px] overflow-y-auto"
              >
                <p className="text-gray-800 font-semibold mb-2">📝 {c.problemText}</p>

               {/* Image Evidence */ }
{c.image && (
  <div className="mb-3">
    <p className="text-sm font-medium text-gray-700 mb-1">🖼️ Image Evidence:</p>
    <img
      src={`${BASE_URL}/uploads/genderComplaints/${c.image.split("/").pop()}`}
      alt="Evidence"
      className="w-full rounded object-contain"
    />
  </div>
)}

{/* Audio Evidence */ }
{c.audio && (
  <div className="mb-3">
    <p className="text-sm font-medium text-gray-700 mb-1">🎧 Audio Evidence:</p>
    <audio controls className="w-full">
      <source
        src={`${BASE_URL}/uploads/genderComplaints/${c.audio.split("/").pop()}`}
        type="audio/mpeg"
      />
      Your browser does not support the audio element.
    </audio>
  </div>
)}

{/* Video Evidence */ }
{c.video && (
  <div className="mb-3">
    <p className="text-sm font-medium text-gray-700 mb-1">📹 Video Evidence:</p>
    <video controls className="w-full rounded">
      <source
        src={`${BASE_URL}/uploads/genderComplaints/${c.video.split("/").pop()}`}
        type="video/mp4"
      />
      Your browser does not support the video element.
    </video>
  </div>
)}


                <p className="text-sm text-gray-500 mb-1">
                  🕒 Submitted: {new Date(c.submittedAt).toLocaleString()}
                </p>

                <p className="text-sm">
                  📌 <span className="font-semibold">Status:</span>{" "}
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
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-blue-700">💬 Remarks:</p>
                    <ul className="text-sm list-disc list-inside text-gray-700">
                      {c.officerRemarks.map((r, i) => (
                        <li key={i}>
                          <strong>{r.by}:</strong> {r.text}{" "}
                          <span className="text-gray-400 text-xs">
                            ({new Date(r.at).toLocaleString()})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  {c.status !== "in progress" && (
                    <button
                      onClick={() => updateStatus(c._id, "in progress")}
                      className="w-full bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                    >
                      Mark as In Progress
                    </button>
                  )}
                  {c.status !== "solved" && (
                    <button
                      onClick={() => {
                        const remarks = prompt("Enter any remarks before solving:");
                        if (remarks !== null && remarks.trim() !== "") {
                          updateStatus(c._id, "solved", remarks);
                        }
                      }}
                      className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
                    >
                      Mark as Solved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-3 text-sm text-gray-600 shadow-inner">
        © {new Date().getFullYear()} Sudara Platform | Empowering Student Safety
      </footer>
    </div>
  );
}
