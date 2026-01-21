import { useEffect, useState } from "react";
import api from "../api/api-base";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PoliceSolvedDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Base URL for media
  const BASE_URL =
    (process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DEV_API
      : process.env.REACT_APP_PROD_API
    )?.replace(/\/$/, "");

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/api/gender-complaints/boys", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const solvedOnly = res.data?.complaints?.filter(
          (c) => c.status === "solved"
        );
        setComplaints(solvedOnly || []);
      } catch (err) {
        console.error("Failed to load complaints:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">👮 Police - Solved Complaints</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">✅ Solved Boy Complaints</h2>

        {loading ? (
          <p className="text-gray-600">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="text-gray-500">No solved complaints found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="bg-white p-4 rounded-2xl shadow border border-gray-200 space-y-2 max-h-[500px] overflow-y-auto"
              >
                <p className="text-gray-800 whitespace-pre-line">
                  {c.problemText}
                </p>

                {/* Media */}
                {c.image && (
                  <img
                    src={`${BASE_URL}${c.image}`}
                    alt="Complaint"
                    className="w-full h-48 object-cover rounded-md border"
                  />
                )}
                {c.audio && (
                  <audio
                    controls
                    className="w-full mt-2 rounded"
                    src={`${BASE_URL}${c.audio}`}
                  />
                )}
                {c.video && (
                  <video
                    controls
                    className="w-full mt-2 rounded"
                    src={`${BASE_URL}${c.video}`}
                  />
                )}

                {/* Date */}
                <p className="text-sm text-gray-500">
                  📅 {new Date(c.submittedAt).toLocaleString()}
                </p>

                {/* Status */}
                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 font-semibold rounded">
                  ✅ Solved
                </span>

                {/* Officer Remarks */}
                {Array.isArray(c.officerRemarks) && c.officerRemarks.length > 0 && (
                  <div className="mt-2 bg-blue-50 p-2 rounded-md">
                    <p className="text-sm font-semibold text-blue-800 mb-1">
                      💬 Officer Remarks:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                      {c.officerRemarks.map((remark, index) => (
                        <li key={remark._id || index}>
                          <span className="font-medium">{remark.by}</span>:{" "}
                          {remark.text}{" "}
                          <span className="text-gray-500 text-xs">
                            ({new Date(remark.at).toLocaleString()})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
