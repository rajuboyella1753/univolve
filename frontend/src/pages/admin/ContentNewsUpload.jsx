import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Newspaper, 
  Type, 
  AlignLeft, 
  Image as ImageIcon, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  X
} from "lucide-react";
import ownerApi from "../../api/owner";
import ContentNavbar from "./ContentNavbar";

export default function ContentNewsUpload() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    if (!formData.title || !formData.content) {
      setError("⚠️ Title and content are required.");
      setIsUploading(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);

    try {
      await ownerApi.post("/news", data);
      setSuccess("✅ News broadcasted successfully!");
      setError("");
      setFormData({ title: "", content: "", image: null });
      setPreview(null);
      
      // 3 సెకన్ల తర్వాత సక్సెస్ మెసేజ్ వెళ్ళిపోతుంది
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("❌ Failed to broadcast news.");
      setSuccess("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      <ContentNavbar />

      {/* 🚀 Cyber Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full -translate-x-1/2"></div>
      </div>

      <main className="relative z-10 max-w-3xl mx-auto pt-32 pb-20 px-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/20 shadow-lg">
            <Newspaper size={12} /> News Station
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
            Broadcast <span className="text-blue-500">MBU News</span>
          </h1>
          <p className="mt-4 text-slate-400 font-medium italic text-xs tracking-widest uppercase">
            Share verified updates with the student ecosystem
          </p>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0 }} className="mb-6 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-400 font-bold text-sm">
              <CheckCircle2 size={18} /> {success}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0 }} className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 font-bold text-sm">
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                <Type size={14} className="text-blue-500" /> Headline
              </label>
              <input
                type="text"
                name="title"
                placeholder="Brief and catchy title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-medium text-white placeholder:text-slate-700"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                <AlignLeft size={14} className="text-purple-500" /> Detailed News
              </label>
              <textarea
                name="content"
                placeholder="Explain the full story here..."
                value={formData.content}
                onChange={handleChange}
                rows={6}
                className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-[2rem] outline-none focus:border-purple-500/50 transition-all font-medium text-white placeholder:text-slate-700 leading-relaxed resize-none"
              ></textarea>
            </div>

            {/* Image Upload & Preview */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                <ImageIcon size={14} className="text-amber-500" /> Attach Visual
              </label>
              
              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-slate-600 group-hover:text-blue-500 mb-3 transition-colors" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Choose News Image</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="relative w-full h-56 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => {setPreview(null); setFormData(prev => ({...prev, image: null}))}}
                    className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isUploading}
              type="submit"
              className={`w-full py-5 rounded-[1.8rem] font-black uppercase italic text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-2xl ${
                isUploading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-white text-black hover:bg-blue-600 hover:text-white"
              }`}
            >
              {isUploading ? "Transmitting..." : "🚀 Broadcast News"}
            </motion.button>
          </form>
        </motion.div>
      </main>

      <footer className="py-10 text-center border-t border-white/5 bg-black/40">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 italic">Nexbadi Content Protocol • Commuting verified updates</p>
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