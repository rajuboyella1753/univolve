import React, { useEffect, useState } from "react";
import apiBase from "../../api/api-base";
import StudentNavbar from "../StudentNavbar";
import { Sparkles, Star } from "lucide-react";

export default function UnivolveSolvers() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await apiBase.get("/api/leaderboard/top-solvers");
        setLeaders(res.data.leaderboard || []);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      }
    };
    fetchLeaderboard();
  }, []);

  const getCardClass = (points) => {
    const base =
      "rounded-2xl shadow-xl p-6 mb-6 flex flex-col sm:flex-row justify-between items-center border transition-transform hover:scale-[1.01]";
    if (points >= 2000)
      return `${base} bg-gradient-to-r from-purple-500 to-pink-300 text-white border-purple-600`;
    if (points >= 1000)
      return `${base} bg-gradient-to-r from-cyan-400 to-blue-300 text-white border-blue-500`;
    if (points >= 500)
      return `${base} bg-gradient-to-r from-green-300 to-green-100 border-green-600 text-gray-900`;
    return `${base} bg-white border-gray-300 text-gray-800`;
  };

  const getRewardTitle = (points) => {
    if (points >= 2000) return "🚀 Supreme Solver";
    if (points >= 1000) return "🎉 Featured in Spotlight Chart";
    if (points >= 500) return "🏅 Badge of Recognition";
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white pt-24 px-4">
      <StudentNavbar />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-yellow-700 mb-4">
          🏆 Univolve Solvers
        </h1>
        <p className="text-center text-gray-600 mb-10 text-lg">
          Pride Zone for the most helpful solvers 💡
        </p>

        {leaders.length === 0 && (
          <p className="text-center text-gray-500">No solvers yet.</p>
        )}

        {leaders.map((leader, idx) => (
          <div key={leader.userId} className={getCardClass(leader.totalPoints)}>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">{idx + 1}</span>
              <div className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                {leader.name}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-md font-medium flex items-center gap-1">
                <Star className="w-5 h-5" />
                {leader.totalPoints}
              </div>
              {getRewardTitle(leader.totalPoints) && (
                <div className="text-sm font-bold mt-1">
                  {getRewardTitle(leader.totalPoints)}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="mt-12 bg-white border border-yellow-300 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-yellow-700 mb-3">
            🎁 Rewards System
          </h2>
          <ul className="list-disc pl-6 text-gray-800 space-y-2">
            <li>🏅 <strong>500 Points</strong> – Badge of Recognition</li>
            <li>🎉 <strong>1000 Points</strong> – Featured in Spotlight Chart</li>
            <li>🚀 <strong>2000 Points</strong> – Supreme Solver (Special Tag & Gift)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
