import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { 
  Edit3, 
  Settings, 
  ShieldCheck, 
  ChevronRight,
  Library,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const actions = [
    {
      title: "Add New Books",
      desc: "Upload book titles, descriptions, floor numbers, and visual covers.",
      icon: <Library className="w-8 h-8" />,
      link: "/support/add-book",
      color: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-500/20"
    },
    {
      title: "Update Archive",
      desc: "Modify existing book data to maintain precision for the student body.",
      icon: <Edit3 className="w-8 h-8" />,
      link: "/support/update-book",
      color: "from-indigo-600 to-violet-700",
      shadow: "shadow-indigo-500/20"
    },
    {
      title: "Library Metrics",
      desc: "(Coming Soon) - Monitor suggestion trends and system health analytics.",
      icon: <Settings className="w-8 h-8" />,
      link: "#",
      color: "from-slate-700 to-slate-900",
      shadow: "shadow-slate-500/20",
      disabled: true
    }
  ];

  return (
    // ✅ Matches Navbar Slate-950 Background
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-500">
      <Navbar />

      {/* 🌌 Atmospheric Glows matching Navbar Indigo vibe */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-36 pb-20 px-6">
        
        {/* --- Welcome Header --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/20">
            <Zap size={12} className="fill-current" /> Admin Operations Active
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none mb-6">
            COMMAND <span className="text-blue-500">CENTER</span>
          </h1>
          <p className="max-w-2xl mx-auto text-indigo-200/60 text-lg font-medium italic leading-relaxed">
            Univolve Operations: You are the guardian of campus knowledge. Manage the digital library repository with precision.
          </p>
        </motion.div>

        {/* --- Action Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {actions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={!action.disabled ? { y: -10 } : {}}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} blur-3xl opacity-0 group-hover:opacity-10 transition-opacity rounded-[3rem]`}></div>
              
              <Link 
                to={action.link}
                className={`relative block h-full bg-[#1e1b4b]/30 backdrop-blur-2xl p-10 rounded-[3rem] border border-indigo-500/20 shadow-2xl transition-all ${
                  action.disabled ? "opacity-40 cursor-not-allowed" : "hover:border-blue-400/40"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-8 shadow-xl ${action.shadow} group-hover:scale-110 transition-transform duration-500 border border-white/10`}>
                  {action.icon}
                </div>

                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4">
                  {action.title}
                </h3>
                
                <p className="text-indigo-200/50 font-medium text-sm leading-relaxed mb-8 h-12">
                  {action.desc}
                </p>

                {!action.disabled && (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:text-blue-300 transition-colors">
                    Access Portal <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
                
                {action.disabled && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Locked System</span>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* --- Motivation Block (Navbar Blue Theme) --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3.5rem] p-10 md:p-16 overflow-hidden shadow-2xl shadow-blue-500/20 border border-blue-400/30"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <ShieldCheck size={240} className="text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
                Support Hero Protocol
              </h2>
              <p className="text-blue-100/80 font-medium italic text-lg max-w-xl leading-relaxed">
                "Your actions today ensure that no student walks back from the library without the knowledge they seek."
              </p>
            </div>
            <div className="shrink-0 bg-white/10 backdrop-blur-xl px-10 py-5 rounded-2xl border border-white/20 text-white font-black uppercase text-xs tracking-widest animate-pulse shadow-xl">
              Core Secure • v2.0
            </div>
          </div>
        </motion.div>

      </main>

      {/* --- Footer matching Navbar Slate vibe --- */}
      <footer className="mt-auto py-12 border-t border-indigo-500/20 bg-slate-950/50 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 opacity-60">
          UNIVOLVE INFRASTRUCTURE • COMMAND CENTER © {new Date().getFullYear()}
        </p>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #4338ca; border-radius: 10px; }
      `}</style>
    </div>
  );
}