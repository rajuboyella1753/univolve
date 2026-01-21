import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Globe, 
  ExternalLink, 
  Search, 
  Zap, 
  Building2, 
  Filter,
  ArrowUpRight
} from "lucide-react";
import StuNav from "../StudentNavbar";

const roles = [
  "All", "Frontend", "Backend", "Fullstack", "Designer", 
  "DevOps", "Data", "Marketing", "QA", "Product Manager"
];

const countries = [
  "All", "India", "United States", "Germany", "Canada", "Remote"
];

export default function JobPortal() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("internship");
  const [role, setRole] = useState("All");
  const [country, setCountry] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_RAPIDAPI_KEY || "926f32645fmshba057e0fe85541cp181222jsnc18b58c25bb7";

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const queryParts = [];
        if (filter === "internship") queryParts.push("internship");
        if (role !== "All") queryParts.push(role);
        if (country !== "All") queryParts.push("in " + country);

        const query = queryParts.join(" ") || "software developer";

        const res = await fetch(
          `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": apiKey,
              "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
            },
          }
        );

        if (!res.ok) throw new Error("API response not OK");

        const data = await res.json();
        setJobs(data.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to sync with global job servers. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filter, role, country, apiKey]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-500">
      <StuNav />

      {/* 🌌 Cyber Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-4 md:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/20 shadow-sm">
            <Zap size={12} className="fill-current" /> Global Career Portal
          </span>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
            Opportunity <span className="text-blue-600">Radar</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium italic text-xs tracking-widest uppercase">
            Aggregating premium openings from Google, Microsoft & Top Tech Hubs
          </p>
        </motion.div>

        {/* 🛠️ Modern Filtering Console */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900/50 backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-6 rounded-[2.5rem] shadow-2xl mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Type Switcher */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest flex items-center gap-2">
                <Filter size={12}/> Engagement Type
              </label>
              <div className="flex bg-slate-100 dark:bg-black/40 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
                <button
                  onClick={() => setFilter("internship")}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === "internship" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Internships
                </button>
                <button
                  onClick={() => setFilter("job")}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === "job" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Full-Time
                </button>
              </div>
            </div>

            {/* Role Picker */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest flex items-center gap-2">
                <Briefcase size={12}/> Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-slate-800 dark:text-white text-sm cursor-pointer"
              >
                {roles.map((r) => <option key={r} className="bg-white dark:bg-slate-900">{r}</option>)}
              </select>
            </div>

            {/* Country Picker */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest flex items-center gap-2">
                <Globe size={12}/> Geographic Zone
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-slate-800 dark:text-white text-sm cursor-pointer"
              >
                {countries.map((c) => <option key={c} className="bg-white dark:bg-slate-900">{c}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        {/* 📊 Opportunity Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Syncing Global Datasets...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center border-2 border-dashed border-red-500/20 rounded-[3rem]">
             <p className="text-red-500 font-black uppercase tracking-widest">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem]">
            <p className="text-slate-500 font-black uppercase italic tracking-widest text-sm">No matches found for current parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {jobs.map((job, idx) => (
                <motion.div
                  layout
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-7 rounded-[2.5rem] shadow-xl hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-500/10">
                      {job.employer_logo ? (
                        <img src={job.employer_logo} alt="logo" className="w-10 h-10 object-contain rounded-lg" />
                      ) : (
                        <Building2 size={24} />
                      )}
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-emerald-500/10">
                      Verified
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {job.job_title}
                  </h2>
                  
                  <div className="space-y-2 mb-8">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase flex items-center gap-2">
                       <Building2 size={14} className="text-blue-500"/> {job.employer_name || "Confidential Corp"}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                       <MapPin size={12} className="text-blue-500"/> {job.job_city || job.job_country || "Global / Remote"}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Source</span>
                       <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase italic">RapidAPI • JSearch</span>
                    </div>
                    <a
                      href={job.job_apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                    >
                      APPLY <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"/>
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 italic">
          Nexbadi Opportunity Pipeline © 2026 • MBU Global Talent Hub
        </p>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
      `}</style>
    </div>
  );
}