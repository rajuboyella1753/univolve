import { useEffect, useState } from "react";
import api from "../api/api-base";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DishaSolvedCases() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dynamically resolve backend base URL
  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DEV_API
      : process.env.REACT_APP_PROD_API;

  useEffect(() => {
    const fetchSolved = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/api/gender-complaints/solved-girls", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data.complaints);
      } catch (err) {
        console.error("Failed to load solved complaints");
      } finally {
        setLoading(false);
      }
    };
    fetchSolved();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl md:text-2xl font-bold">Solved Cases - Disha Officer</h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate("/disha-dashboard")}
            className="bg-white text-blue-900 px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-200"
          >
            🔙 Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-1.5 rounded-lg hover:bg-red-700 flex items-center gap-2 font-semibold"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="p-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Solved Girl Complaints</h2>

        {loading ? (
          <p className="text-gray-600">Loading solved complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="text-gray-500">No solved complaints found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {complaints.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition hover:shadow-xl"
              >
                {/* Complaint Image */}
                {c.image && (
                  <img
                    src={`${BASE_URL}${c.image}`}
                    alt="Complaint"
                    className="w-full h-56 object-cover"
                  />
                )}

                {/* Complaint Details */}
                <div className="p-4">
                  <p className="text-gray-800 mb-3 text-sm">{c.problemText}</p>

                  <div className="text-sm text-gray-600 mb-1">
                    📅 Submitted: {new Date(c.submittedAt).toLocaleString()}
                  </div>

                  <div className="text-green-600 font-semibold mb-1">
                    ✅ Status: {c.status}
                  </div>

                  <div className="text-purple-700 text-sm">
  💬 Remarks:
  <ul className="list-disc ml-4 mt-1">
    {c.officerRemarks.map((r, idx) => (
      <li key={idx}>
        <strong>{r.by}</strong>: {r.text} <br />
        <span className="text-gray-500 text-xs">🕒 {new Date(r.at).toLocaleString()}</span>
      </li>
    ))}
  </ul>
</div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
