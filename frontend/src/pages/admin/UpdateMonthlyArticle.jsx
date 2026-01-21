import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit3, 
  Trash2, 
  Save, 
  XCircle, 
  Image as ImageIcon, 
  Type, 
  Target, 
  FileText, 
  Newspaper 
} from "lucide-react";
import ContentNavbar from "./ContentNavbar";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PROD_API;

export default function UpdateMonthlyArticle() {
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ theme: "", purpose: "", content: "", image: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error("Failed to fetch articles", err))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this article permanently?");
    if (!confirm) return;

    fetch(`${BASE_URL}/api/articles/${id}`, { method: "DELETE" })
      .then(() => {
        setArticles((prev) => prev.filter((article) => article._id !== id));
        alert("✅ Article removed from database.");
      })
      .catch((err) => alert("❌ Deletion failed"));
  };

  const handleEdit = (article) => {
    setEditingId(article._id);
    setEditData({
      theme: article.theme,
      purpose: article.purpose,
      content: article.content,
      image: null,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("theme", editData.theme);
    formData.append("purpose", editData.purpose);
    formData.append("content", editData.content);
    if (editData.image) formData.append("image", editData.image);

    fetch(`${BASE_URL}/api/articles/${editingId}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((updated) => {
        setArticles((prev) =>
          prev.map((a) => (a._id === editingId ? updated : a))
        );
        setEditingId(null);
        alert("✅ Article updated successfully!");
      })
      .catch((err) => alert("❌ Update failed"));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      <ContentNavbar />

      {/* 🚀 Cyber Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -translate-x-1/2"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto pt-32 pb-20 px-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <Newspaper size={12} /> Editorial Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
            Article <span className="text-blue-500">Repository</span>
          </h1>
          <p className="mt-4 text-slate-400 font-medium italic text-xs tracking-widest uppercase">
            Curate and refine monthly stories for Nexbadians
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 text-center animate-pulse font-black text-slate-600 tracking-widest uppercase">
            Fetching archives...
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="text-slate-600 font-black uppercase tracking-widest italic">No editorials found.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence mode="popLayout">
              {articles.map((article) => (
                <motion.div
                  layout
                  key={article._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 md:p-10 transition-all hover:bg-white/[0.04] hover:border-white/20 shadow-2xl relative overflow-hidden"
                >
                  {editingId === article._id ? (
                    <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 ml-2">
                            <Type size={14} /> Theme
                          </label>
                          <input
                            value={editData.theme}
                            onChange={(e) => setEditData({ ...editData, theme: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 px-6 py-3 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 ml-2">
                            <Target size={14} /> Purpose
                          </label>
                          <input
                            value={editData.purpose}
                            onChange={(e) => setEditData({ ...editData, purpose: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 px-6 py-3 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 ml-2">
                          <FileText size={14} /> Story Content
                        </label>
                        <textarea
                          rows="6"
                          value={editData.content}
                          onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-[2rem] outline-none focus:border-blue-500 transition-all font-medium leading-relaxed resize-none"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 ml-2">
                          <ImageIcon size={14} /> Replace Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEditData({ ...editData, image: e.target.files[0] })}
                          className="w-full bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-xs font-bold text-slate-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button type="submit" className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl">
                          <Save size={16} /> Save Edits
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="px-8 bg-white/5 text-white py-4 rounded-2xl border border-white/10 font-black uppercase italic text-xs tracking-widest hover:bg-red-500 transition-all">
                          <XCircle size={16} />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-8">
                      {article.image && (
                        <div className="w-full relative group">
                          <img
                            src={`${BASE_URL}/uploads/articles/${article.image}`}
                            alt={article.theme}
                            className="w-full max-h-[450px] object-cover rounded-[2.5rem] border border-white/5 shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 rounded-[2.5rem]"></div>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[9px] font-black uppercase bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20 tracking-tighter">
                            Active Editorial
                          </span>
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tight mb-3 group-hover:text-blue-500 transition-colors leading-none">
                          {article.theme}
                        </h3>
                        <p className="text-blue-400 font-bold italic text-sm mb-6 flex items-center gap-2">
                          <Target size={14} /> {article.purpose}
                        </p>
                        <p className="text-slate-400 font-medium leading-relaxed mb-10 whitespace-pre-line opacity-80 border-l-2 border-white/5 pl-6 italic">
                          {article.content}
                        </p>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEdit(article)}
                            className="flex-1 bg-white text-black py-3 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl"
                          >
                            <Edit3 size={14} /> Edit Story
                          </button>
                          <button
                            onClick={() => handleDelete(article._id)}
                            className="px-6 bg-red-500/10 text-red-500 py-3 rounded-2xl border border-red-500/10 font-black uppercase italic text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-white/5 bg-black/40 p-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 italic">
          Nexbadi Content Authority • Editorial Management System
        </p>
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