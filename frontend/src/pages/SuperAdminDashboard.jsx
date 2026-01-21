import React, { useEffect, useState } from "react";
import api from "../api/api-base";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCheck, UserX, LogOut, Trash2, Users, 
  ShieldCheck, MessageSquare, BarChart3, Search, 
  Mail, Briefcase, Calendar, Trash, Zap, Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("student"); // Default set to student
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("users"); 
  
  const navigate = useNavigate();
  const BASE_URL = api.defaults.baseURL;
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [userRes, suggRes] = await Promise.all([
          api.get("/api/admin/all-users", config),
          api.get("/api/suggestions", config),
        ]);

        const userData = Array.isArray(userRes.data) ? userRes.data : userRes.data.users;
        setUsers(userData || []);
        setSuggestions(suggRes.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");
    await api.post(`/api/admin/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(prev => prev.map(u => u._id === id ? { ...u, approved: true, rejected: false } : u));
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");
    await api.post(`/api/admin/reject/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(prev => prev.map(u => u._id === id ? { ...u, approved: false, rejected: true } : u));
  };

  const handleDeleteSuggestion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/suggestions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error("Error deleting suggestion:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredUsers = users.filter((u) => {
    const roleMatch = selectedRole ? u.role === selectedRole : true;
    const isNotMe = currentUser ? u._id !== currentUser._id : true;
    const searchMatch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return roleMatch && isNotMe && searchMatch;
  });

  const countByRole = (role) => users.filter((u) => u.role === role).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* 🚀 Cinematic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full"></div>
      </div>

      {/* 🟢 Cyber Navbar */}
      <nav className="sticky top-0 z-[60] bg-[#020617]/40 backdrop-blur-2xl border-b border-white/10 px-4 md:px-8 py-5 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 md:gap-4">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <ShieldCheck className="text-white w-6 h-6 md:w-7 md:h-7" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter leading-none">
              NEXBADI <span className="text-cyan-500">CORE</span>
            </h1>
            <span className="text-[7px] md:text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Administrator Command Center</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Live</span>
          </div>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl md:rounded-2xl border border-red-500/20 transition-all duration-300 font-black uppercase text-[8px] md:text-[10px] tracking-widest"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-12 relative z-10">
        
        {/* 📟 Management Console Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {[
            { id: 'users', label: 'User Hub', icon: Users, color: 'blue', sub: 'Control Campus Access' },
            { id: 'counts', label: 'Ecosystem Metrics', icon: BarChart3, color: 'emerald', sub: 'Population Census' },
            { id: 'suggestions', label: 'Response Center', icon: MessageSquare, color: 'purple', sub: 'Voice of Students' }
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView(item.id)}
              className={`group p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-2 transition-all duration-500 text-left relative overflow-hidden backdrop-blur-xl ${
                view === item.id 
                ? `bg-${item.color}-500/10 border-${item.color}-500/50 shadow-[0_20px_40px_rgba(0,0,0,0.3)]` 
                : 'bg-white/5 border-white/5 hover:border-white/20'
              }`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl mb-4 md:mb-6 flex items-center justify-center transition-all duration-500 ${view === item.id ? `bg-${item.color}-500 shadow-[0_0_20px_#2563eb]` : 'bg-white/5 group-hover:bg-white/10'}`}>
                <item.icon size={20} className={view === item.id ? 'text-white' : 'text-slate-400'} />
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter mb-1">{item.label}</h3>
              <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.sub}</p>
              {view === item.id && (
                <motion.div layoutId="navGlow" className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/10 to-transparent pointer-events-none`} />
              )}
            </motion.button>
          ))}
        </div>

        {/* 💎 Power Workspace */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-4 md:p-8 lg:p-12 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] relative">
          
          <AnimatePresence mode="wait">
            {view === "users" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key="users">
                {/* User Console Controls */}
                <div className="flex flex-col xl:flex-row justify-between items-center gap-6 md:gap-8 mb-8 md:mb-12">
                  <div className="flex items-center gap-2 md:gap-3 bg-black/40 p-1.5 md:p-2 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 w-full xl:w-fit">
                    {["student", "admin"].map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`flex-1 xl:flex-none px-6 md:px-10 py-2.5 md:py-3 rounded-[1.2rem] md:rounded-[1.5rem] text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                          selectedRole === role 
                          ? "bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]" 
                          : "text-slate-500 hover:text-slate-200"
                        }`}
                      >
                        {role}s
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full xl:max-w-md group">
                    <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="Identify User..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-12 md:px-14 py-3 md:py-4 rounded-[1.5rem] md:rounded-[2rem] outline-none focus:border-cyan-500/50 transition-all font-bold text-xs md:text-sm placeholder:text-slate-700"
                    />
                  </div>
                </div>

                {/* Cyber Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {loading ? (
                    <div className="col-span-full py-20 md:py-32 text-center">
                      <Zap className="w-10 h-10 md:w-12 md:h-12 text-cyan-500 animate-bounce mx-auto mb-4" />
                      <p className="uppercase font-black text-slate-500 tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-sm">Establishing Connection...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="col-span-full py-20 md:py-32 text-center border-2 border-dashed border-white/5 rounded-[2rem] md:rounded-[3rem]">
                      <p className="text-slate-600 font-black uppercase tracking-widest italic text-xs md:text-sm">Zero Records Found</p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <motion.div layout key={user._id} className="group bg-white/5 border border-white/10 rounded-[1.8rem] md:rounded-[2.5rem] p-5 md:p-7 transition-all duration-500 hover:bg-white/[0.08] hover:border-cyan-500/40 relative">
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/5 rounded-lg opacity-30 group-hover:opacity-100 group-hover:text-cyan-500 transition-all">
                          <Users size={16} />
                        </div>
                        
                        <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-white mb-2 truncate pr-8 md:pr-10">{user.name}</h3>
                        <p className="text-[10px] md:text-xs text-slate-400 flex items-center gap-2 mb-5 md:mb-6 font-medium truncate"><Mail size={12} className="text-cyan-500"/> {user.email}</p>
                        
                        <div className="flex items-center justify-between mb-6 md:mb-8 bg-black/20 p-2.5 md:p-3 rounded-xl md:border md:border-white/5">
                           <span className="text-[8px] md:text-[10px] font-black text-cyan-500 uppercase tracking-widest">{user.subrole || user.role}</span>
                           <div className="flex items-center gap-1.5 md:gap-2">
                             <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${user.approved ? 'bg-emerald-500' : user.rejected ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`} />
                             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter text-slate-300">
                               {user.approved ? 'Verified' : user.rejected ? 'Denied' : 'Awaiting'}
                             </span>
                           </div>
                        </div>

                        {user.role === "admin" && (
                          <div className="flex gap-2 md:gap-3">
                            <button onClick={() => handleApprove(user._id)} className="flex-1 bg-white text-black py-2.5 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-emerald-500 hover:text-white transition-all duration-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl active:scale-95">
                              <UserCheck size={14} /> Grant
                            </button>
                            <button onClick={() => handleReject(user._id)} className="flex-1 bg-white/5 text-white py-2.5 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-red-500 transition-all duration-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10 active:scale-95">
                              <UserX size={14} /> Revoke
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {view === "counts" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} key="counts" className="py-8 md:py-12">
                <div className="flex flex-col items-center mb-10 md:mb-16">
                   <div className="w-12 md:w-16 h-1 bg-cyan-500 mb-4 md:mb-6 rounded-full" />
                   <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-center">NEXBADI <span className="text-emerald-500">CENSUS</span></h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
                   {[
                     { label: "Authenticated Students", count: countByRole("student"), color: "cyan" },
                     { label: "Administrative Personnel", count: countByRole("admin"), color: "purple" }
                   ].map((stat, i) => (
                     <div key={i} className="group bg-white/5 border border-white/10 p-10 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] text-center shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.08]">
                        <h4 className={`text-6xl md:text-7xl font-black italic mb-3 md:mb-4 text-white group-hover:text-${stat.color}-500 transition-colors`}>{stat.count}</h4>
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {view === "suggestions" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="suggestions">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12 gap-4">
                  <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-center md:text-left">SURVEY <span className="text-purple-500">INSIGHTS</span></h2>
                  <div className="px-5 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-purple-400">
                    {suggestions.length} Active Tickets
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {suggestions.length === 0 ? (
                    <div className="py-20 md:py-32 text-center text-slate-600 font-black uppercase tracking-widest border-2 border-dashed border-white/5 rounded-[2rem] md:rounded-[3rem]">Inbox Is Clear</div>
                  ) : (
                    suggestions.map((s) => (
                      <div key={s._id} className="p-6 md:p-8 border border-white/5 rounded-[2rem] md:rounded-[3rem] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 group">
                        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                          <div className="flex-1 w-full order-2 lg:order-1">
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
                              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-3 md:px-4 py-1.5 bg-purple-600 text-white rounded-full shadow-lg shadow-purple-600/20">{s.type}</span>
                              <span className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 md:gap-2"><Calendar size={12}/> {new Date(s.createdAt).toDateString()}</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tight mb-2 md:mb-3 group-hover:text-purple-400 transition-colors">{s.title}</h3>
                            <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-5 md:mb-6 font-medium italic">"{s.message}"</p>
                            <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-white/5 rounded-xl md:rounded-2xl w-fit">
                              <Users size={14} className="text-purple-500" />
                              <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">{s.studentId?.name || 'Anonymous Nexbadian'}</p>
                            </div>
                          </div>
                          
                          {s.imageUrl && (
                            <div className="w-full lg:w-64 h-48 md:h-40 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 shrink-0 shadow-2xl order-1 lg:order-2">
                              <img src={`${BASE_URL}${s.imageUrl}`} alt="insight" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            </div>
                          )}
                          
                          <button onClick={() => handleDeleteSuggestion(s._id)} className="p-4 md:p-5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 self-end lg:self-center order-3">
                             <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="mt-10 md:mt-20 border-t border-white/5 bg-black/40 p-8 md:p-12 text-center backdrop-blur-md">
        <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-600 italic">
          Nexbadi Security Protocol © {new Date().getFullYear()} | Managed by Chief Administrator Raju ⚡
        </p>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #0f172a; border-radius: 10px; border: 1px solid #1e293b; }
        ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
        @media (max-width: 768px) {
          .glass-container { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminDashboard;