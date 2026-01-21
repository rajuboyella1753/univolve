import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Type, 
  Target, 
  Image as ImageIcon, 
  FileText, 
  Send, 
  Sparkles, 
  X 
} from "lucide-react";
import ContentNavbar from "./ContentNavbar";

export default function PostMonthlyArticle() {
  const [formData, setFormData] = useState({
    theme: "",
    purpose: "",
    image: null,
    content: "",
  });
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0])); // ఇమేజ్ ప్రివ్యూ కోసం
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append("theme", formData.theme);
    data.append("purpose", formData.purpose);
    data.append("image", formData.image);
    data.append("content", formData.content);

    const API_URL =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_API
        : process.env.REACT_APP_PROD_API;

    try {
      const response = await fetch(`${API_URL}/api/articles/upload`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      
      alert("✅ Article published successfully!");
      setFormData({ theme: "", purpose: "", image: null, content: "" });
      setPreview(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Failed to post article.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      <ContentNavbar />

      {/* 🚀 Cyber Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto pt-32 pb-20 px-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/20">
            <Sparkles size={12} /> Monthly Editorial
          </span>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
            Publish <span className="text-blue-500">Inspiration</span>
          </h1>
          <p className="mt-4 text-slate-400 font-medium italic uppercase text-xs tracking-widest">
            Craft a story that matters for the MBU Community
          </p>
        </motion.div>

        {/* Article Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Theme Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                  <Type size={14} className="text-blue-500" /> Theme
                </label>
                <input
                  type="text"
                  name="theme"
                  placeholder="e.g. Resilience in Academics"
                  value={formData.theme}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-medium placeholder:text-slate-700"
                />
              </div>

              {/* Purpose Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                  <Target size={14} className="text-purple-500" /> Purpose
                </label>
                <input
                  type="text"
                  name="purpose"
                  placeholder="The goal of this article"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl outline-none focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-700"
                />
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                <ImageIcon size={14} className="text-amber-500" /> Cover Image
              </label>
              
              <div className="relative group">
                {!preview ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 text-slate-600 group-hover:text-blue-500 mb-4 transition-colors" />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Upload high-quality visual</p>
                    </div>
                    <input type="file" name="image" accept="image/*" className="hidden" onChange={handleChange} required />
                  </label>
                ) : (
                  <div className="relative w-full h-64 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => {setPreview(null); setFormData(prev => ({...prev, image: null}))}}
                      className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                <FileText size={14} className="text-emerald-500" /> Full Narrative
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="10"
                required
                className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-[2rem] outline-none focus:border-emerald-500/50 transition-all font-medium placeholder:text-slate-700 leading-relaxed resize-none"
                placeholder="Write your soul into this article..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className={`w-full py-5 rounded-[1.8rem] font-black uppercase italic text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-2xl ${
                isSubmitting 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-white text-black hover:bg-blue-600 hover:text-white"
              }`}
            >
              {isSubmitting ? "Broadcasting..." : "🚀 Publish to Dashboard"}
            </motion.button>
          </form>
        </motion.div>
      </main>

      <footer className="py-10 text-center border-t border-white/5 bg-black/40">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Nexbadi Content Authority • MBU Protocol</p>
      </footer>
    </div>
  );
}