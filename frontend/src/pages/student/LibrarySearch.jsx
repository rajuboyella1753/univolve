import { useEffect, useState } from "react";
import Navbar from "../StudentNavbar";
import api from "../../api/api-base";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  MapPin, 
  Layers, 
  Filter, 
  Bookmark, 
  Navigation,
  ArrowRight,
  Library
} from "lucide-react";

const BASE_URL = api.defaults.baseURL;

export default function StudentSearch() {
  const [query, setQuery] = useState("");
  const [floor, setFloor] = useState("all");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (query.trim() !== "") params.title = query;
      if (floor !== "all") params.floor = floor;

      const res = await api.get("/api/librarybooks", { params });
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [query, floor]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      {/* 🌌 Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-4 md:px-8">
        
        {/* 📚 Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-500/20 shadow-sm">
            <Library size={12} /> Knowledge Repository
          </span>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-4">
            Library <span className="text-indigo-600">Navigator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 font-medium italic text-sm md:text-base tracking-wide uppercase opacity-80">
            Locate academic resources across all floors with precision
          </p>
        </motion.div>

        {/* 🔍 Advanced Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="flex flex-col md:flex-row gap-4 p-2 bg-white dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] md:rounded-full shadow-2xl shadow-indigo-500/10">
            <div className="flex-1 flex items-center gap-4 px-6 py-3">
              <Search className="text-indigo-500 shrink-0" size={22} />
              <input
                type="text"
                className="w-full bg-transparent text-slate-800 dark:text-white font-bold text-lg outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Search by book title or author..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            
            <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-white/10 self-center"></div>

            <div className="flex items-center gap-3 px-6 py-3 min-w-[200px]">
              <Filter className="text-indigo-500 shrink-0" size={20} />
              <select
                className="w-full bg-transparent text-slate-600 dark:text-slate-300 font-black uppercase text-xs tracking-widest outline-none cursor-pointer"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              >
                <option value="all">All Floors</option>
                <option value="0">Ground Floor</option>
                <option value="1">1st Floor</option>
                <option value="2">2nd Floor</option>
                <option value="3">3rd Floor</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* 📘 Books Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Accessing Archives...</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            <AnimatePresence>
              {books.map((book, idx) => (
                <motion.div
                  layout
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group relative bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:border-indigo-500/30"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    {book.imagePath ? (
                      <img
                        src={`${BASE_URL}${book.imagePath}`}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <BookOpen size={48} strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
                    
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 text-white">
                      <Bookmark size={16} />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-tighter rounded-lg border border-indigo-500/10">
                        Floor {book.floor}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight mb-3 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-1">
                      {book.title}
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 line-clamp-2 italic opacity-80">
                      "{book.description || 'No description provided for this technical resource.'}"
                    </p>

                    {/* Navigation Info - Highly Visual */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Precise Location</span>
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase italic">
                           <Navigation size={14} className="fill-current" /> {book.location}
                        </div>
                      </div>
                      
                      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 group-hover:w-24 transition-all duration-300 overflow-hidden relative">
                         <span className="absolute left-4 opacity-0 group-hover:opacity-100 text-[10px] font-black uppercase tracking-widest">Find</span>
                         <ArrowRight size={18} className="group-hover:translate-x-6 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ❌ No Results State */}
        {!loading && books.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-20 py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]"
          >
            <Search size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-6" />
            <h3 className="text-xl font-black uppercase italic tracking-widest text-slate-500 mb-2">Zero Matches Found</h3>
            <p className="text-sm text-slate-400 font-medium italic">Adjust your filters or try a different title</p>
          </motion.div>
        )}

      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600">
          © 2026 NEXBADI PROTOCOL • MBU CENTRAL LIBRARY
        </p>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 10px; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}