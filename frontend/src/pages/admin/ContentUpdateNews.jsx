import React, { useEffect, useState } from "react";
import ownerApi from "../../api/owner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit3, 
  Trash2, 
  Save, 
  XCircle, 
  Image as ImageIcon, 
  Newspaper,
  Calendar,
  AlertCircle
} from "lucide-react";
import ContentNavbar from "./ContentNavbar";

const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PROD_API;

export default function ContentUpdateNews() {
  const [newsList, setNewsList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", image: null });
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await ownerApi.get("/news");
      setNewsList(res.data);
    } catch (err) {
      console.error("❌ Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this news permanently?");
    if (!confirm) return;

    try {
      await ownerApi.delete(`/news/${id}`);
      setNewsList(prev => prev.filter(item => item._id !== id));
      alert("✅ News deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete news:", err);
    }
  };

  const handleEdit = (news) => {
    setEditingId(news._id);
    setEditForm({ title: news.title, content: news.content, image: null });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFileChange = (e) => {
    setEditForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const submitEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("content", editForm.content);
      if (editForm.image) formData.append("image", editForm.image);

      await ownerApi.put(`/news/${editingId}`, formData);
      setEditingId(null);
      fetchNews();
      alert("✅ News updated successfully!");
    } catch (err) {
      console.error("❌ Edit failed:", err);
      alert("❌ Failed to update news.");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      <ContentNavbar />

      {/* 🚀 Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -translate-x-1/2"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto pt-32 pb-20 px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/20">
            <Newspaper size={12} /> News Archive
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
            Manage <span className="text-blue-500">Live News</span>
          </h1>
          <p className="mt-4 text-slate-400 font-medium italic text-xs tracking-widest uppercase">
            Curate and maintain the pulse of MBU campus
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 text-center animate-pulse font-black text-slate-600 tracking-widest uppercase">Syncing with database...</div>
        ) : newsList.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <AlertCircle size={40} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-600 font-black uppercase italic tracking-widest">No news posted yet.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            <AnimatePresence mode="popLayout">
              {newsList.map((news) => (
                <motion.div
                  layout
                  key={news._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 transition-all hover:bg-white/[0.05] hover:border-white/20 shadow-2xl"
                >
                  {editingId === news._id ? (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-blue-500 ml-2">Edit Title</label>
                          <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            className="w-full bg-white/5 border border-white/10 px-5 py-3 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-blue-500 ml-2">Update Visual</label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleEditFileChange}
                              className="hidden"
                              id={`file-${news._id}`}
                            />
                            <label htmlFor={`file-${news._id}`} className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl cursor-pointer hover:bg-white/10 transition-all text-xs font-bold text-slate-400">
                              <ImageIcon size={16} /> Choose New Image
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-blue-500 ml-2">Edit Narrative</label>
                        <textarea
                          name="content"
                          rows={4}
                          value={editForm.content}
                          onChange={handleEditChange}
                          className="w-full bg-white/5 border border-white/10 px-5 py-3 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium leading-relaxed resize-none"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={submitEdit}
                          className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Save size={16} /> Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-8 bg-white/5 text-white py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-red-500 transition-all border border-white/10"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                      {news.image && (
                        <div className="lg:w-72 shrink-0">
                          <img
                            src={`${baseURL}/uploads/news/${news.image}`}
                            alt="visual"
                            className="w-full h-48 lg:h-full object-cover rounded-[2rem] border border-white/5 shadow-2xl"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[9px] font-black uppercase bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20 tracking-tighter flex items-center gap-1">
                             <Calendar size={10} /> Live on Portal
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-3 group-hover:text-blue-500 transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-slate-400 font-medium leading-relaxed mb-8 italic opacity-80">
                          {news.content}
                        </p>
                        
                        <div className="mt-auto flex gap-3">
                          <button
                            onClick={() => handleEdit(news)}
                            className="flex-1 bg-white text-black py-3 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                            <Edit3 size={14} /> Edit News
                          </button>
                          <button
                            onClick={() => handleDelete(news._id)}
                            className="px-6 bg-red-500/10 text-red-500 py-3 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/10 flex items-center justify-center gap-2"
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
          Nexbadi Content Authority • MBU News Infrastructure
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