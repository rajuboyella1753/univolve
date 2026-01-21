import { useEffect, useState } from "react";
import api from "../api/api-base";
import StudentNav from "./StudentNavbar";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PROD_API;

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/api/gender-complaints/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        alert("Failed to fetch your complaints");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100">
      <StudentNav />

      <div className="max-w-4xl mx-auto pt-28 px-4 pb-10">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          📄 My Submitted Complaints
        </h2>

        {complaints.length === 0 ? (
          <p className="text-gray-500 text-center">
            No complaints submitted yet.
          </p>
        ) : (
          complaints.map((comp, i) => (
            <div
              key={i}
              className="border-l-4 border-purple-600 bg-white p-5 rounded-xl shadow-md mb-6 space-y-3"
            >
              {/* Problem Text */}
              <p className="text-gray-800">
                <strong>📝 Issue:</strong> {comp.problemText}
              </p>

              {/* Image Evidence */}
              {comp.image && (
                <div>
                  <strong className="block text-gray-600 mb-1">
                    🖼️ Image Evidence:
                  </strong>
                  <img
                    src={`${BASE_URL}${comp.image}`}
                    alt="Evidence"
                    className="w-full max-h-64 object-contain rounded-md shadow"
                  />
                </div>
              )}

              {/* Audio Evidence */}
              {comp.audio && (
                <div>
                  <strong className="block text-gray-600 mb-1">
                    🎧 Audio Evidence:
                  </strong>
                  <audio controls className="w-full">
                    <source src={`${BASE_URL}${comp.audio}`} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Video Evidence */}
              {comp.video && (
                <div>
                  <strong className="block text-gray-600 mb-1">
                    📹 Video Evidence:
                  </strong>
                  <video controls className="w-full max-h-96 rounded-md shadow">
                    <source src={`${BASE_URL}${comp.video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Complaint Status */}
              <p>
                <strong>📌 Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    comp.status === "solved"
                      ? "text-green-600"
                      : comp.status === "in progress"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {comp.status}
                </span>
              </p>

              {/* Officer Remarks */}
              {comp.officerRemarks?.length > 0 && (
                <div className="text-gray-700">
                  <strong>💬 Remarks:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
  {comp.officerRemarks.map((remark, idx) => (
    <li key={idx}>
      <strong>{remark.by}</strong>: {remark.text}
      <div className="text-xs text-gray-500">
        🕒 {new Date(remark.at).toLocaleString()}
      </div>
    </li>
  ))}
</ul>

                </div>
              )}

              {/* Submission Time */}
              <p className="text-sm text-gray-500">
                📅 Submitted:{" "}
                {new Date(comp.submittedAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
