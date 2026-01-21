import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  Edit3, 
  BarChart2, 
  LayoutDashboard, 
  ArrowUpRight, 
  Globe, 
  Zap 
} from "lucide-react";
import ContentNavbar from "./ContentNavbar";

export default function ContentDashboard() {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setAdminName(parsedUser.name || "Content Admin");
    }
  }, []);

  const actions = [
    {
      title: "Post News",
      description: "Broadcast important stories or events to the campus community.",
      icon: <PlusCircle size={28} />,
      onClick: () => navigate("/admin/upload-news"),
      color: "blue",
      stat: "Live Feed"
    },
    {
      title: "Update News",
      description: "Maintain accuracy by editing or removing existing announcements.",
      icon: <Edit3 size={28} />,
      onClick: () => navigate("/admin/update-news"),
      color: "amber",
      stat: "Modify Content"
    },
    {
      title: "View Stats",
      description: "Analyze engagement metrics and reach of your shared content.",
      icon: <BarChart2 size={28} />,
      onClick: () => alert("Analytics module is being prepared!"),
      color: "emerald",
      stat: "Coming Soon"
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      <ContentNavbar />

      {/* 🚀 Background Cyber Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <LayoutDashboard size={20} className="text-blue-500" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Workspace Hub</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-4 leading-none">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{adminName.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed">
            You hold the key to the campus voice. Manage and curate verified news for the MBU ecosystem from your control center.
          </p>
        </motion.div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actions.map((action, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={action.onClick}
              className="group relative cursor-pointer"
            >
              {/* Card Glow Effect */}
              <div className={`absolute inset-0 bg-${action.color}-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]`}></div>
              
              <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col transition-all duration-300 group-hover:bg-white/[0.06] group-hover:border-white/20 shadow-2xl">
                
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-4 rounded-2xl bg-${action.color}-500/10 text-${action.color}-500 border border-${action.color}-500/20 group-hover:scale-110 transition-transform duration-500`}>
                    {action.icon}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${action.color}-500 animate-pulse`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{action.stat}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-3 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    {action.title} <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </h2>
                  <p className="text-slate-400 font-medium leading-relaxed mb-6 italic opacity-80 group-hover:opacity-100 transition-opacity">
                    {action.description}
                  </p>
                </div>

                <div className={`h-1 w-0 bg-gradient-to-r from-blue-500 to-transparent absolute bottom-0 left-10 transition-all duration-500 group-hover:w-[70%]`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Stats/Quick Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-gradient-to-r from-blue-600/10 to-transparent border-l-2 border-blue-500 p-6 rounded-r-2xl">
            <p className="text-xs font-black uppercase text-blue-500 mb-1 flex items-center gap-2">
              <Globe size={14} /> Global Reach
            </p>
            <p className="text-sm text-slate-400 font-medium italic">Verified news reaches 5,000+ Nexbadians instantly.</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600/10 to-transparent border-l-2 border-purple-500 p-6 rounded-r-2xl">
            <p className="text-xs font-black uppercase text-purple-500 mb-1 flex items-center gap-2">
              <Zap size={14} /> Quick Publish
            </p>
            <p className="text-sm text-slate-400 font-medium italic">Posts are optimized for mobile and desktop screens.</p>
          </div>
        </motion.div>
      </main>

      <footer className="mt-16 border-t border-white/5 bg-black/40 py-10 px-6 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
            © 2026 NEXBADI PROTOCOL • Content Authority
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] font-bold text-slate-700 uppercase">MBU Verified</span>
            <span className="text-[10px] font-bold text-slate-700 uppercase">UNivolve Hub</span>
          </div>
        </div>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>
    </div>
  );
}