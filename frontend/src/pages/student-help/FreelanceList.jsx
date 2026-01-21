import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StuNav from "../StudentNavbar";
import { 
  FaSearch, 
  FaUser, 
  FaBriefcase, 
  FaPhoneAlt, 
  FaCloudUploadAlt, 
  FaExternalLinkAlt,
  FaRocket,
  FaImages
} from "react-icons/fa";
import { Search, PlusCircle, Briefcase, Phone, Upload, Sparkles, CheckCircle } from "lucide-react";
import api, { baseURL } from "../../api/api-base";

export default function FreelanceDashboard() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    contact: "",
  });
  const [files, setFiles] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    files.forEach((file) => data.append("samples", file));

    try {
      const token = localStorage.getItem("token");
      await api.post("/api/freelancers/register", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("🚀 Profile Deployed Successfully!");
      setForm({ name: "", category: "", description: "", contact: "" });
      setFiles([]);
      fetchFreelancers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFreelancers = async () => {
    try {
      const res = await api.get(`/api/freelancers?q=${search}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFreelancers(res.data);
    } catch (err) {
      console.error("Failed to fetch freelancers:", err);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [search]);

  const getFullUrl = (filename) => {
    if (!filename) return "";
    const safePath = filename.replace(/\\/g, "/");
    return `${baseURL}/${safePath}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-200 selection:bg-blue-500/30 transition-colors duration-500 overflow-x-hidden">
      <StuNav />
      
      {/* 🌌 Cyber background decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-4 md:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/20">
               <Sparkles size={12} /> The Campus Gig Economy
             </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
            Skill <span className="text-blue-600">Marketplace</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium italic text-xs tracking-widest uppercase">
            Monetize your talent within the MBU community
          </p>
        </div>

        {/* 🔍 Smart Search Bar */}
        <div className="max-w-3xl mx-auto mb-16 relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
           <input
             type="text"
             placeholder="Search by skill (e.g. Video Editor, Logo Designer, Coder...)"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 pl-16 pr-6 py-5 rounded-full outline-none focus:border-blue-500 transition-all font-bold dark:text-white shadow-xl shadow-blue-500/5"
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 📝 Left Side: Registration Console (5 Cols) */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-8 rounded-[3rem] shadow-2xl sticky top-32">
              <h2 className="text-xl font-black uppercase italic text-blue-600 mb-8 flex items-center gap-2">
                <PlusCircle size={24} /> Register Talent
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Identify Yourself</label>
                   <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold dark:text-white text-sm"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Skill Category</label>
                    <input
                      name="category"
                      placeholder="e.g. Designer"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 font-bold dark:text-white text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Contact Info</label>
                    <input
                      name="contact"
                      placeholder="WhatsApp/Phone"
                      value={form.contact}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 font-bold dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Service Overview</label>
                   <textarea
                    name="description"
                    placeholder="What value can you provide? Mention tools & experience..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 font-medium dark:text-white text-sm h-32 resize-none leading-relaxed"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Portfolio Samples</label>
                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl cursor-pointer bg-slate-50 dark:bg-black/20 hover:bg-blue-500/5 hover:border-blue-500/50 transition-all">
                      <FaCloudUploadAlt size={32} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">
                        {files.length > 0 ? `${files.length} Files Selected` : "Upload Artwork/Videos"}
                      </span>
                      <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                   </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Transmitting..." : "Broadcast Profile"} <FaRocket />
                </button>
              </form>
            </div>
          </motion.div>

          {/* 💼 Right Side: Freelancer Feed (7 Cols) */}
          <div className="lg:col-span-7">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black uppercase italic text-slate-800 dark:text-white">Active Freelancers</h2>
                <span className="px-3 py-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-[10px] font-black text-slate-500 uppercase">{freelancers.length} Found</span>
             </div>

             <div className="space-y-8 h-[80vh] overflow-y-auto pr-3 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                {freelancers.length > 0 ? (
                  freelancers.map((f, i) => (
                    <motion.div
                      layout
                      key={f._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-6 rounded-[2.5rem] shadow-xl hover:border-blue-500/30 transition-all group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg">
                              {f.name.charAt(0)}
                           </div>
                           <div>
                              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{f.name}</h3>
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 tracking-widest">
                                 <Briefcase size={12} /> {f.category}
                              </div>
                           </div>
                        </div>
                        <a href={`tel:${f.contact}`} className="flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-5 py-2.5 rounded-xl border border-blue-500/20 text-[10px] font-black tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                           <Phone size={14} /> CONNECT
                        </a>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium italic leading-relaxed mb-6 border-l-2 border-blue-500/20 pl-4">
                        "{f.description}"
                      </p>

                      {f.samples?.length > 0 && (
                        <div className="space-y-3">
                           <div className="flex items-center gap-2 text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">
                              <FaImages size={10}/> Portfolio Preview
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                             {f.samples.map((link, idx) => (
                                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner bg-black/5 group-hover:shadow-2xl transition-all">
                                  {/\.(mp4|webm|mov)$/i.test(link) ? (
                                    <video src={getFullUrl(link)} controls className="w-full h-full object-cover" />
                                  ) : (
                                    <img src={getFullUrl(link)} alt="sample" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                                </div>
                             ))}
                           </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
                    <p className="text-slate-500 font-black uppercase italic tracking-widest text-xs">No experts matching your criteria.</p>
                  </div>
                )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600">
          Nexbadi Talent Protocol © 2026 • Freelancing Portal
        </p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
      `}</style>
    </div>
  );
}