import React, { useEffect, useState } from "react";
import StudentNavbar from "../StudentNavbar";
import api from "../../api/api-base";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark, 
  ChevronRight,
  Zap
} from "lucide-react";

const BASE_URL = api.defaults.baseURL;

export default function NewsFeed() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await api.get("/api/owner/news");
      setNewsList(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch news", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden">
      <StudentNavbar />

      {/* 🚀 Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto pt-32 pb-20 px-4 sm:px-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/20">
            <Zap size={12} className="fill-current" /> Live Campus Pulse
          </span>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
            MBU <span className="text-blue-600">Tails</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium italic text-sm tracking-widest uppercase">
            Your daily dose of verified campus updates
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Fetching Headlines...</p>
          </div>
        ) : newsList.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]"
          >
            <Newspaper size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 font-black uppercase italic tracking-widest">No news stories found in the feed.</p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence>
              {newsList.map((news, idx) => (
                <motion.div
                  key={news._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 hover:border-blue-500/30"
                >
                  <div className="flex flex-col lg:flex-row">
                    
                    {/* News Image Section */}
                    {news.image && (
                      <div className="lg:w-2/5 relative overflow-hidden">
                        <img
                          src={`${BASE_URL}/uploads/news/${news.image}`}
                          alt="Campus News"
                          className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900/20"></div>
                        <div className="absolute bottom-4 left-4 lg:hidden">
                           <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Featured</span>
                        </div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                          <Calendar size={14} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {new Date(news.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock size={14} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {new Date(news.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {news.title}
                      </h2>

                      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-4 lg:line-clamp-none font-medium italic opacity-90">
                        "{news.content}"
                      </p>

                      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-black italic">NB</div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Nexbadi Editorial</span>
                         </div>
                         
                         <div className="flex items-center gap-3">
                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                               <Share2 size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                               <Bookmark size={18} />
                            </button>
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom Navigation / CTA */}
        <div className="mt-20 text-center">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">You're all caught up</p>
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="inline-flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest hover:gap-4 transition-all"
           >
             Back to top <ChevronRight size={14} />
           </button>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
          © 2026 NEXBADI PROTOCOL • MBU CAMPUS NEWS
        </p>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}