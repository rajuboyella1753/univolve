import React from "react";
import { motion } from "framer-motion";
import "./HonorWall.css"; 
import Navbar from "./StudentNavbar";
import { 
  HeartIcon, 
  SparklesIcon, 
  ShieldCheckIcon, 
  HandRaisedIcon, 
  AcademicCapIcon, 
  LightBulbIcon 
} from "@heroicons/react/24/solid";

const classmates = [
  { name: "BSR (Dev)", memory: "Code and Compassion.", category: "Core" },
  { name: "The Visionary", memory: "Dreamed of a safe MBU.", category: "Core" },
  { name: "Team 4yr B.Tech", memory: "United by a single purpose.", category: "The Batch" },
  { name: "Student Support", memory: "Listening to the unheard.", category: "Soul" },
  // ఇక్కడ నీ ఫ్రెండ్స్ పేర్లు యాడ్ చేసుకో బాడీ
];

export default function HonorWall() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#fafafa] dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative selection:bg-red-500/30">
      <Navbar />
      
      {/* 🌌 Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-red-500/20">
              <HeartIcon className="w-3 h-3 animate-pulse" /> From Seniors to Juniors
            </span>
            
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-6 leading-none">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600">LEGACY</span> WALL
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium italic">
              "We didn't just build code. We built a bridge for those who feel lost in the campus silence."
            </p>
          </motion.div>
        </div>

        {/* --- THE 'WHY' SECTION (MISSION) --- */}
        <div className="grid lg:grid-cols-2 gap-12 mb-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-4 text-purple-600">
               <div className="h-[2px] w-12 bg-purple-600"></div>
               <span className="text-xs font-black uppercase tracking-widest italic">Our Truth</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic leading-tight">
              Why we built <span className="text-purple-600">NEXBADI</span>?
            </h2>
            <div className="space-y-6 text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed italic">
              <p className="border-l-4 border-red-500 pl-6">
                "Nexbadi was born from the tears we shed in lonely hostel rooms, the fear of walking to class, and the feeling of being invisible."
              </p>
              <p>
                We saw juniors struggling with the same darkness we faced. We decided that our pain should be the <span className="text-red-600 font-bold underline decoration-wavy underline-offset-4">last of its kind</span>.
              </p>
              <p>
                This website is a gift from the **CSE 4th Year Batch**. It is your shield, your marketplace, your library, and your safe space.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-700 blur-3xl opacity-20"></div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-10 rounded-[3rem] shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                  <HandRaisedIcon className="w-8 h-8 text-red-500 mb-4" />
                  <h4 className="font-black uppercase text-xs mb-2 dark:text-white">Safety First</h4>
                  <p className="text-[10px] text-slate-500 italic">No student shall walk unheard.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                  <AcademicCapIcon className="w-8 h-8 text-blue-500 mb-4" />
                  <h4 className="font-black uppercase text-xs mb-2 dark:text-white">Zero Ego</h4>
                  <p className="text-[10px] text-slate-500 italic">Seniors guide, not rule.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                  <LightBulbIcon className="w-8 h-8 text-yellow-500 mb-4" />
                  <h4 className="font-black uppercase text-xs mb-2 dark:text-white">Pure Purpose</h4>
                  <p className="text-[10px] text-slate-500 italic">Built for MBU with love.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                  <ShieldCheckIcon className="w-8 h-8 text-green-500 mb-4" />
                  <h4 className="font-black uppercase text-xs mb-2 dark:text-white">The Shield</h4>
                  <p className="text-[10px] text-slate-500 italic">Your privacy is our priority.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- THE HONOR GRID --- */}
        <div className="mb-20 text-center">
          <h3 className="text-2xl font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 mb-12 italic">
            The Guardians of Nexbadi
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {classmates.map((friend, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="flip-card h-52"
              >
                <div className="flip-inner shadow-xl">
                  <div className="flip-front flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem]">
                    <SparklesIcon className="w-5 h-5 text-yellow-500 mb-4 opacity-30" />
                    <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">{friend.category}</span>
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white px-4 text-center">
                      {friend.name}
                    </h3>
                  </div>
                  <div className="flip-back flex items-center justify-center bg-gradient-to-br from-red-600 to-purple-700 text-white rounded-[2.5rem] p-6 text-center shadow-lg">
                    <p className="text-xs font-black italic uppercase leading-relaxed">
                      "{friend.memory}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- CLOSING MOTIVATION --- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-32 space-y-8"
        >
          <div className="max-w-2xl mx-auto">
             <h3 className="text-3xl font-black italic text-slate-800 dark:text-white uppercase mb-4">
               Dear Junior,
             </h3>
             <p className="text-lg text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed">
               "Don't just use this website. Own it. Protect each other. Life at campus is hard, but together, we are unbreakable. You are never alone as long as Nexbadi is live."
             </p>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-red-500/80 animate-pulse">
              Endless Love • CSE Seniors
            </p>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          </div>
        </motion.div>

      </div>

      <style>{`
        .flip-card { perspective: 1000px; }
        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }
        .flip-card:hover .flip-inner { transform: rotateY(180deg); }
        .flip-front, .flip-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        .flip-back { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}