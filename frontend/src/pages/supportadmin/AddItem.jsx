import { useEffect, useState } from "react";
import apiBase from "../../api/api-base"; 
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  PlusCircle, 
  Layers, 
  MapPin, 
  Type, 
  AlignLeft, 
  Image as ImageIcon, 
  Upload, 
  Trash2,
  Library,
  Zap,
  Info
} from "lucide-react";

export default function AddItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    floor: "",
    location: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await apiBase.get("/api/librarybooks");
      setBooks(res.data.reverse());
    } catch (err) {
      console.error("Error fetching books", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.floor || !form.location || !image) {
      alert("⚠️ బాడీ, అన్ని ఫీల్డ్స్ ఫిల్ చేసి ఒక ఫోటో సెలెక్ట్ చెయ్!");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("floor", form.floor);
    data.append("location", form.location);
    data.append("image", image);

    try {
      await apiBase.post("/api/librarybooks", data);
      alert("✅ Book Successfully Archived!");
      setForm({ title: "", description: "", floor: "", location: "" });
      setImage(null);
      setPreview(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert("❌ Error Adding Book.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    // ✅ Main Background matching Navbar gradient vibe
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-500">
      <Navbar />

      {/* 🌌 Atmospheric Glows matching Navbar Colors */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 flex flex-col lg:flex-row pt-24 min-h-screen">
        
        {/* 📝 Left Side: Input Console (Glass Panel with Indigo Border) */}
        <div className="w-full lg:w-[420px] p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-indigo-500/20 bg-[#1e1b4b]/30 backdrop-blur-3xl shrink-0">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4 mb-10">
               <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-500/20 border border-blue-400/30">
                  <Library size={24}/>
               </div>
               <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">Add Archive</h2>
                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-1">Resource Authority Console</p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-indigo-300 ml-2 tracking-widest flex items-center gap-2"><Type size={12}/> Book Title</label>
                <input
                  name="title"
                  placeholder="e.g. Modern Physics Vol 1"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-indigo-500/30 px-5 py-4 rounded-2xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-white placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-indigo-300 ml-2 tracking-widest flex items-center gap-2"><AlignLeft size={12}/> Brief Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the asset context..."
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-indigo-500/30 px-5 py-4 rounded-[2rem] outline-none focus:border-blue-400 transition-all font-medium text-slate-300 resize-none leading-relaxed placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-indigo-300 ml-2 tracking-widest flex items-center gap-2"><Layers size={12}/> Floor</label>
                  <input
                    name="floor"
                    placeholder="Level"
                    value={form.floor}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-indigo-500/30 px-5 py-4 rounded-2xl outline-none focus:border-blue-400 font-bold text-white placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-indigo-300 ml-2 tracking-widest flex items-center gap-2"><MapPin size={12}/> Zone</label>
                  <input
                    name="location"
                    placeholder="Shelf"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-indigo-500/30 px-5 py-4 rounded-2xl outline-none focus:border-blue-400 font-bold text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-indigo-300 ml-2 tracking-widest flex items-center gap-2"><ImageIcon size={12}/> Cover Thumbnail</label>
                {!preview ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-500/30 rounded-[2.5rem] cursor-pointer bg-slate-900/30 hover:bg-blue-500/5 hover:border-blue-400/50 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-indigo-400 group-hover:text-blue-400 mb-2 transition-colors" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Upload Media</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="relative w-full h-48 rounded-[2.5rem] overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-500/10">
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => {setPreview(null); setImage(null)}} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"><Trash2 size={16}/></button>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase italic text-xs tracking-[0.2em] shadow-xl shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-3 border border-blue-400/30"
              >
                {loading ? "TRANSMITTING..." : <><PlusCircle size={18}/> Deploy to Library</>}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* 📚 Right Side: Repository (Matches Navbar Indigo vibe) */}
        <div className="flex-1 p-6 lg:p-12 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-12 border-b border-indigo-500/20 pb-8">
             <div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Active Repository</h2>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Zap size={14} className="text-blue-400 fill-current"/> Real-time Sync Active
                </p>
             </div>
             <div className="px-6 py-3 bg-blue-600/10 border border-blue-500/30 rounded-full">
                <span className="text-sm font-black text-blue-400 uppercase tracking-widest">{books.length} TOTAL ASSETS</span>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {books.length === 0 ? (
                <div className="col-span-full py-32 text-center border-2 border-dashed border-indigo-500/20 rounded-[4rem] bg-indigo-500/5">
                  <Info size={48} className="mx-auto text-indigo-400 mb-4 opacity-50" />
                  <p className="text-indigo-300 font-black uppercase italic tracking-widest text-sm">No knowledge assets detected in archive.</p>
                </div>
              ) : (
                books.map((book, idx) => (
                  <motion.div
                    layout
                    key={book._id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#1e1b4b]/40 backdrop-blur-2xl border border-indigo-500/20 rounded-[3rem] overflow-hidden shadow-2xl hover:border-blue-400/40 transition-all group"
                  >
                    <div className="relative h-60 w-full bg-slate-900 flex items-center justify-center p-3">
                      {book.imagePath ? (
                        <img
                          src={`${apiBase.defaults.baseURL}${book.imagePath}`}
                          alt={book.title}
                          className="max-w-full max-h-full object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <BookOpen className="text-indigo-500/50" size={64} strokeWidth={1} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-6 left-6 bg-blue-600/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-blue-300 uppercase tracking-widest border border-blue-500/30">
                        TAG #{books.length - idx}
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter truncate mb-2 group-hover:text-blue-400 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-indigo-200/60 text-sm font-medium line-clamp-2 italic leading-relaxed h-10 mb-8">
                        "{book.description}"
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-indigo-500/20">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Position</span>
                           <div className="flex items-center gap-2 text-xs font-bold text-white uppercase italic">
                              <Layers size={14} className="text-blue-400" /> LVL {book.floor}
                           </div>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Navigation</span>
                           <div className="flex items-center gap-2 text-xs font-bold text-white uppercase italic">
                              <MapPin size={14} className="text-blue-400" /> {book.location}
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/*  */}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4338ca; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>
    </div>
  );
}