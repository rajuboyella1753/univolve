import React from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  ShieldAlert, 
  Users, 
  Send, 
  Sparkles,
  Zap,
  ArrowRight,
  Globe
} from "lucide-react";
import StudentNav from './StudentNavbar';

export default function ContactUs() {
  
  // ✅ Direct Email Function
  const sendMail = (recipient) => {
    const email = recipient === 'admin' ? 'superadmin@mbu.asia' : 'team@nexbadi.com';
    const subject = encodeURIComponent("Inquiry from Nexbadi Portal");
    const body = encodeURIComponent("Hello,\n\nI would like to discuss the following...");
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-20 overflow-x-hidden">
      <StudentNav />

      {/* 🚀 Cyber Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[130px] rounded-full translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[130px] rounded-full -translate-x-1/4"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto pt-36 px-6">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-blue-500/20 shadow-xl shadow-blue-500/5">
              <Zap size={12} className="fill-current" /> Instant Connection
            </span>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-slate-900 dark:text-white mb-6 uppercase leading-none">
              Direct <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Liaison</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto italic leading-relaxed">
              No forms. No waiting. Reach out to the authority or the creators directly via encrypted mail protocols.
            </p>
          </motion.div>
        </div>

        {/* --- Contact Grid --- */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          {/* 🛡️ SuperAdmin Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative bg-white dark:bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-blue-600/30">
                  <ShieldAlert size={32} />
                </div>
                <h2 className="text-3xl font-black uppercase italic text-slate-800 dark:text-white mb-4 tracking-tighter">
                  Super Admin
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                  For official campus complaints, security concerns, or administrative clearance. Reach the highest office directly.
                </p>
              </div>
              
              <button 
                onClick={() => sendMail('admin')}
                className="inline-flex items-center justify-between w-full bg-slate-900 dark:bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase italic tracking-widest text-xs group/btn transition-all hover:bg-blue-700"
              >
                Send Direct Mail <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* 👥 Nexbadi Team Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative bg-white dark:bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-purple-600/30">
                  <Users size={32} />
                </div>
                <h2 className="text-3xl font-black uppercase italic text-slate-800 dark:text-white mb-4 tracking-tighter">
                  Dev Team
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                  Have a bug to report? Or a new feature idea? Connect with the 4th year seniors who built Nexbadi.
                </p>
              </div>
              
              <button 
                onClick={() => sendMail('team')}
                className="inline-flex items-center justify-between w-full bg-slate-900 dark:bg-purple-600 text-white px-8 py-5 rounded-2xl font-black uppercase italic tracking-widest text-xs group/btn transition-all hover:bg-purple-700"
              >
                Reach the Creators <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* --- Global Support Footer --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-blue-600/5 border border-blue-500/10 rounded-[3rem] p-12 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="text-left">
              <h3 className="text-xl font-black uppercase italic text-blue-600 mb-2">Technical Support</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic">Active 24/7 for critical system failures.</p>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>
            <div className="text-left">
              <h3 className="text-xl font-black uppercase italic text-purple-600 mb-2">Community Hub</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic">Located at MBU Campus Library, Floor 2.</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 dark:text-slate-600 italic">
            Nexbadi Communication Protocol v2.0 • Secured & Encrypted
          </p>
        </div>

      </main>
    </div>
  );
}