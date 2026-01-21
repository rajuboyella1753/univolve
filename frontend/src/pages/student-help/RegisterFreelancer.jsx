import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudUpload, 
  User, 
  Briefcase, 
  MessageSquare, 
  Phone, 
  X, 
  CheckCircle,
  Sparkles,
  FileVideo,
  FileImage
} from "lucide-react";
import api from "../../api/api-base";
import StuNav from "../StudentNavbar";

export default function FreelanceUpload() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    contact: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Generate previews for UX
    const filePreviews = selectedFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
      name: file.name
    }));
    setPreviews(filePreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    files.forEach((file) => data.append("samples", file));

    try {
      await api.post("/api/freelance/upload", data);
      alert("🚀 Talent deployed successfully!");
      setForm({ name: "", category: "", description: "", contact: "" });
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-200 selection:bg-blue-500/30 transition-colors duration-500 overflow-x-hidden">
      <StuNav />
      
      {/* 🌌 Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto pt-32 pb-20 px-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/20">
            <Sparkles size={12} /> Gig Protocol
          </span>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
            Broadcast Your <span className="text-blue-600">Skills</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium italic text-xs tracking-widest uppercase">
            Let the MBU community discover your expertise
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-500/5"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                  <User size={14} className="text-blue-500" /> Professional Identity
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-slate-800 dark:text-white"
                />
              </div>

              {/* Category Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                  <Briefcase size={14} className="text-indigo-500" /> Skill Domain
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Video Editing, UI/UX"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                <MessageSquare size={14} className="text-emerald-500" /> Service Overview
              </label>
              <textarea
                name="description"
                placeholder="Explain what value you provide and tools you use..."
                value={form.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-[2rem] outline-none focus:border-emerald-500 transition-all font-medium text-slate-800 dark:text-white resize-none leading-relaxed"
              ></textarea>
            </div>

            {/* Contact Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                <Phone size={14} className="text-amber-500" /> Connection Link
              </label>
              <input
                type="text"
                name="contact"
                placeholder="WhatsApp, Phone or Portfolio Link"
                value={form.contact}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold text-slate-800 dark:text-white"
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                <CloudUpload size={14} className="text-blue-500" /> Work Samples
              </label>
              
              <div className="grid grid-cols-1 gap-4">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] cursor-pointer bg-slate-50 dark:bg-black/10 hover:bg-blue-500/5 hover:border-blue-500/50 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <CloudUpload className="w-10 h-10 text-slate-400 group-hover:text-blue-500 mb-3 transition-colors" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Drop your best work here</p>
                  </div>
                  <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                </label>

                {/* Previews Grid */}
                <AnimatePresence>
                  {previews.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4"
                    >
                      {previews.map((preview, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ scale: 0.8 }} 
                          animate={{ scale: 1 }}
                          className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/40"
                        >
                          {preview.type === 'video' ? (
                            <div className="flex items-center justify-center h-full text-blue-500"><FileVideo size={32} /></div>
                          ) : (
                            <img src={preview.url} alt="preview" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/20 group hover:bg-black/40 transition-all flex items-center justify-center">
                            <CheckCircle size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className={`w-full py-5 rounded-[2rem] font-black uppercase italic text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-2xl ${
                loading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
              }`}
            >
              {loading ? "Transmitting..." : "🚀 Launch Skill Profile"}
            </motion.button>
          </form>
        </motion.div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-600 italic">
          Nexbadi Talent Infrastructure © 2026
        </p>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
      `}</style>
    </div>
  );
}