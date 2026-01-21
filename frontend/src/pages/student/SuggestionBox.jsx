import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  History, 
  ArrowLeft, 
  MessageSquare, 
  AlertCircle, 
  Image as ImageIcon, 
  CheckCircle2, 
  Clock,
  Zap
} from "lucide-react";
import api from "../../api/api-base";

export default function SuggestionBox() {
  const [formData, setFormData] = useState({
    type: "Suggestion",
    title: "",
    message: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [preview, setPreview] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  };

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/suggestions/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data || []);
    } catch (err) {
      console.error("❌ Fetch Suggestions Failed:", err);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      showAlert("warning", "Title and message are required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = new FormData();
      payload.append("type", formData.type);
      payload.append("title", formData.title);
      payload.append("message", formData.message);
      if (formData.image) payload.append("image", formData.image);

      const res = await api.post("/api/suggestions", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      showAlert("success", res.data?.message || "Transmitted successfully");
      setFormData({ type: "Suggestion", title: "", message: "", image: null });
      setPreview(null);
      fetchSuggestions();
    } catch (err) {
      showAlert("error", "Transmission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-200 selection:bg-pink-500/30 transition-colors duration-500 overflow-x-hidden">
      
      {/* 🌌 Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/5 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -translate-x-1/2"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto pt-10 pb-20 px-6">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => (window.location.href = "/student/dashboard")}
            className="group flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-5 py-2.5 rounded-2xl text-slate-600 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-pink-600 hover:text-white transition-all shadow-xl shadow-pink-500/5"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
          </button>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 text-pink-600 text-[10px] font-black uppercase tracking-[0.2em] border border-pink-500/20">
            <Zap size={12} className="fill-current" /> Open Governance
          </div>
        </div>

        {/* Status Alerts */}
        <AnimatePresence>
          {alert.message && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-2xl ${
              alert.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" : 
              alert.type === "error" ? "bg-red-500/10 border border-red-500/20 text-red-500" : 
              "bg-amber-500/10 border border-amber-500/20 text-amber-500"
            }`}>
              {alert.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {alert.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 📩 Left: Input Console (5 Cols) */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-8 rounded-[3rem] shadow-2xl sticky top-10">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2 leading-none">
                Direct <span className="text-pink-600">Liaison</span>
              </h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Share ideas or report issues directly to admin</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Entry Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-5 py-3 rounded-2xl outline-none focus:border-pink-500 transition-all font-bold text-sm dark:text-white cursor-pointer"
                  >
                    {["Suggestion", "Complaint", "Issue", "Request"].map((opt) => (
                      <option key={opt} value={opt} className="bg-white dark:bg-slate-900">{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Subject Headline</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g. Digital Library Access"
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-5 py-3 rounded-2xl outline-none focus:border-pink-500 transition-all font-bold text-sm dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Detailed Context</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe clearly..."
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-5 py-3 rounded-[2rem] outline-none focus:border-pink-500 transition-all font-medium text-sm dark:text-white resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Visual Evidence (Optional)</label>
                  {!preview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] cursor-pointer bg-slate-50 dark:bg-black/10 hover:bg-pink-500/5 transition-all group">
                      <ImageIcon size={24} className="text-slate-400 group-hover:text-pink-500 transition-colors" />
                      <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Attach Snapshot</span>
                      <input type="file" name="image" accept="image/*" className="hidden" onChange={handleChange} />
                    </label>
                  ) : (
                    <div className="relative w-full h-32 rounded-[2rem] overflow-hidden border border-pink-500/30">
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => {setPreview(null); setFormData(p => ({...p, image: null}))}} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg"><ArrowLeft size={12} className="rotate-90"/></button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-[1.8rem] font-black uppercase italic text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-pink-600/20 active:scale-95"
                >
                  {loading ? "Transmitting..." : "📤 Broadcast Data"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* 📜 Right: History Feed (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <History size={20} className="text-slate-400" />
              <h2 className="text-xl font-black uppercase italic text-slate-800 dark:text-white tracking-tight">Transmission History</h2>
            </div>

            <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {submissions.length > 0 ? (
                  submissions.map((s, i) => (
                    <motion.div
                      layout
                      key={s._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-6 rounded-[2.5rem] shadow-xl hover:border-pink-500/30 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                            s.type === "Complaint" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                            s.type === "Suggestion" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                            "bg-purple-500/10 border-purple-500/20 text-purple-500"
                          }`}>
                            {s.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-tighter">
                            {new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">{s.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed italic opacity-80 border-l-2 border-slate-100 dark:border-white/5 pl-4 mb-4">
                        "{s.message}"
                      </p>

                      {s.imageUrl && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 border border-white/5 shadow-inner">
                          <img src={s.imageUrl} alt="attachment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${
                            s.status === "Pending" ? "bg-amber-500" : "bg-emerald-500"
                          }`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            s.status === "Pending" ? "text-amber-500" : "text-emerald-500"
                          }`}>
                            Status: {s.status}
                          </span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-black/20 rounded-xl">
                          <MessageSquare size={14} className="text-slate-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
                    <Clock size={48} className="mx-auto text-slate-300 dark:text-slate-800 mb-4 opacity-40" />
                    <p className="text-slate-500 font-black uppercase italic tracking-widest text-xs">No entries found in archive.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-600">
          Nexbadi Governance Protocol © 2026
        </p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #db2777; border-radius: 10px; }
      `}</style>
    </div>
  );
}