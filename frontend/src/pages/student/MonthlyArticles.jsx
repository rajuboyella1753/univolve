import React, { useEffect, useState } from "react";
import StuNav from "../StudentNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  Quote, 
  Share2,
  Clock
} from "lucide-react";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PROD_API;

export default function MonthlyArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/articles`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden">
      <StuNav />

      {/* 🌌 Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-500/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto pt-32 pb-20 px-4 md:px-8">
        
        {/* ✨ Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-purple-500/20 shadow-lg">
            <Sparkles size={12} className="fill-current" /> Monthly Editorial
          </span>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-6">
            Words That <span className="text-purple-600">Empower</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 font-medium italic text-sm md:text-base tracking-wide uppercase opacity-80 leading-relaxed">
            One powerful story. One defining lesson. Hand-picked for the MBU spirit.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-1 w-16 bg-purple-600 animate-pulse rounded-full mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Loading Wisdom...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
            <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-800 mb-4" />
            <p className="text-slate-500 font-black uppercase italic tracking-widest text-sm">The library is empty for now.</p>
          </div>
        ) : (
          <div className="space-y-24">
            <AnimatePresence>
              {articles.map((article, idx) => (
                <motion.article
                  key={article._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative group"
                >
                  {/* Article Hero Card */}
                  <div className="relative h-[400px] md:h-[500px] w-full rounded-[3rem] overflow-hidden shadow-2xl">
                    {article.image ? (
                      <img
                        src={`${BASE_URL}/uploads/articles/${article.image}`}
                        alt={article.theme}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center">
                         <BookOpen size={60} className="text-slate-400" />
                      </div>
                    )}
                    
                    {/* Cinematic Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-slate-900/20 to-transparent"></div>
                    
                    {/* Badge on Image */}
                    <div className="absolute top-8 left-8 flex items-center gap-3">
                       <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={12} /> {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                       </span>
                    </div>

                    {/* Header Info - Floating over image */}
                    <div className="absolute bottom-10 left-8 right-8">
                       <div className="max-w-3xl">
                          <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">
                            {article.theme}
                          </h2>
                          <div className="flex items-center gap-4 text-purple-400">
                             <div className="p-2 bg-purple-600 text-white rounded-xl shadow-lg">
                                <Quote size={20} />
                             </div>
                             <p className="text-lg md:text-xl font-bold italic drop-shadow-md">
                                {article.purpose}
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* ✍️ Content Body */}
                  <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
                    {/* Meta Sidebar */}
                    <div className="lg:col-span-3 order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-slate-200 dark:border-white/5 pt-8 lg:pt-0 lg:pr-8">
                       <div className="space-y-8 sticky top-32">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-purple-600 font-black italic border-2 border-white dark:border-slate-900 shadow-xl">NB</div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Editorial By</p>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">Nexbadi Authority</p>
                             </div>
                          </div>
                          <div className="flex flex-col gap-2">
                             <span className="text-[8px] font-black uppercase text-slate-400 tracking-[0.3em]">Quick Links</span>
                             <button className="flex items-center justify-between group/btn text-slate-600 dark:text-slate-400 hover:text-purple-600 transition-colors">
                                <span className="text-[10px] font-black uppercase">Share Insight</span>
                                <Share2 size={14} className="group-hover/btn:rotate-12 transition-transform"/>
                             </button>
                             <button className="flex items-center justify-between group/btn text-slate-600 dark:text-slate-400 hover:text-purple-600 transition-colors">
                                <span className="text-[10px] font-black uppercase">Read Time</span>
                                <div className="flex items-center gap-1"><Clock size={12} /> <span className="text-[10px]">5 min</span></div>
                             </button>
                          </div>
                       </div>
                    </div>

                    {/* Article Text */}
                    <div className="lg:col-span-9 order-1 lg:order-2">
                       <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-[1.8] text-lg md:text-xl font-medium text-justify italic opacity-90 first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-purple-600">
                         {article.content}
                       </p>
                       
                       <div className="mt-16 flex items-center justify-center">
                          <div className="h-px w-20 bg-slate-200 dark:bg-white/10" />
                          <Sparkles size={20} className="mx-8 text-slate-300 dark:text-slate-800" />
                          <div className="h-px w-20 bg-slate-200 dark:bg-white/10" />
                       </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-600 italic">
          Nexbadi Monthly Editorial Protocol © 2026
        </p>
      </footer>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #9333ea; border-radius: 10px; }
        ::selection { background: rgba(147, 51, 234, 0.2); color: #9333ea; }
      `}</style>
    </div>
  );
}