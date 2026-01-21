import { useEffect, useState } from "react";
import api from "../../api/api-base";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Edit3, 
  Trash2, 
  Save, 
  XCircle, 
  Layers, 
  MapPin, 
  BookOpen,
  Library,
  Zap
} from "lucide-react";

export default function UpdateItem() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    floor: "",
    location: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/api/librarybooks");
      setBooks(res.data.reverse());
    } catch (err) {
      console.error("❌ Error fetching books", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset from archive?")) return;
    try {
      await api.delete(`/api/librarybooks/${id}`);
      alert("❌ Archive entry deleted");
      fetchBooks();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleEditClick = (book) => {
    setEditId(book._id);
    setEditForm({
      title: book.title,
      description: book.description,
      floor: book.floor,
      location: book.location,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/api/librarybooks/${editId}`, editForm);
      alert("✅ Archive synchronized successfully!");
      setEditId(null);
      fetchBooks();
    } catch (err) {
      console.error("Update error", err);
      alert("Update failed");
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-500">
      <Navbar />

      {/* 🌌 Background Atmosphere synced with Navbar */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-6">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-indigo-500/20 pb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-500/20">
              <Library size={12} /> Management Console
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
              Update <span className="text-blue-400">Archive</span>
            </h1>
          </motion.div>

          {/* 🔍 Search Protocol */}
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Query archive by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-indigo-500/30 pl-14 pr-6 py-4 rounded-full outline-none focus:border-blue-400 transition-all font-bold text-white placeholder:text-slate-600 shadow-xl"
            />
          </div>
        </div>

        {/* --- Archive Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBooks.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-indigo-500/20 rounded-[3rem] bg-indigo-500/5">
                <p className="text-indigo-400 font-black uppercase italic tracking-widest text-xs">No records matching your query.</p>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <motion.div
                  layout
                  key={book._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative group bg-[#1e1b4b]/40 backdrop-blur-2xl border rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300 ${
                    editId === book._id ? "border-blue-400 ring-2 ring-blue-500/20" : "border-indigo-500/20"
                  }`}
                >
                  {editId === book._id ? (
                    /* 🛠️ Inline Glass Editor View */
                    <div className="p-8 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-indigo-400 ml-1">Asset Title</label>
                        <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full bg-slate-900 border border-indigo-500/40 p-3 rounded-xl outline-none font-bold text-white text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-indigo-400 ml-1">Description</label>
                        <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full bg-slate-900 border border-indigo-500/40 p-3 rounded-xl outline-none text-xs text-slate-300 h-20 resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <input name="floor" value={editForm.floor} onChange={handleEditChange} placeholder="Floor" className="bg-slate-900 border border-indigo-500/40 p-3 rounded-xl outline-none text-xs font-bold text-white" />
                         <input name="location" value={editForm.location} onChange={handleEditChange} placeholder="Location" className="bg-slate-900 border border-indigo-500/40 p-3 rounded-xl outline-none text-xs font-bold text-white" />
                      </div>
                      <div className="pt-4 flex gap-3">
                        <button onClick={handleUpdate} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black uppercase italic text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all"><Save size={14}/> Sync</button>
                        <button onClick={() => setEditId(null)} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-all"><XCircle size={18}/></button>
                      </div>
                    </div>
                  ) : (
                    /* 📘 Standard Archive Card View */
                    <div className="flex flex-col h-full">
                      {/* Image Frame */}
                      <div className="relative h-48 w-full bg-slate-900 flex items-center justify-center p-2">
                        {book.imagePath ? (
                          <img 
                            src={`${api.defaults.baseURL}${book.imagePath}`} 
                            alt={book.title} 
                            className="max-w-full max-h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105" 
                          />
                        ) : (
                          <BookOpen className="text-indigo-500/30" size={48} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] via-transparent to-transparent opacity-60"></div>
                      </div>

                      {/* Content Panel */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter truncate mb-2">{book.title}</h3>
                        <p className="text-indigo-200/50 text-[11px] font-medium line-clamp-2 italic leading-relaxed mb-6">"{book.description}"</p>
                        
                        <div className="mt-auto space-y-2 mb-6">
                           <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                              <Layers size={12} /> LVL {book.floor}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                              <MapPin size={12} /> {book.location}
                           </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-indigo-500/20">
                          <button 
                            onClick={() => handleEditClick(book)}
                            className="flex-1 flex items-center justify-center gap-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(book._id)}
                            className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #4338ca; border-radius: 10px; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}