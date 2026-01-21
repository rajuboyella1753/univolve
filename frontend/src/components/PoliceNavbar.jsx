// src/components/PoliceNavbar.jsx
import { Link } from "react-router-dom";

export default function PoliceNavbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">🚓 Police Dashboard</h1>
      <div className="flex gap-4">
        <Link to="/police-dashboard" className="hover:underline">Home</Link>
        <Link to="/police-solved" className=" hover:underline">
  View Solved Complaints
</Link>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
