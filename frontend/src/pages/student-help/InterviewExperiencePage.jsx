import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  User, 
  Building2, 
  IndianRupee, 
  Briefcase, 
  Send, 
  Search, 
  Sparkles,
  PlayCircle,
  FileVideo
} from "lucide-react";
import StuNav from "../StudentNavbar";

export default function InterviewExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    salary: "",
    role: "",
    video: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "video") {
      setFormData({ ...formData, video: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.video) return alert("Please upload a video!");

    setIsUploading(true);
    
    // Simulate upload delay for better UX
    setTimeout(() => {
      const videoUrl = URL.createObjectURL(formData.video);
      const newExperience = { ...formData, videoUrl, id: Date.now() };
      setExperiences([newExperience, ...experiences]);

      setFormData({
        name: "",
        company: "",
        salary: "",
        role: "",
        video: null,
      });
      setIsUploading(false);
      alert("✅ Experience shared successfully!");
    }, 1500);
  };

  const filteredExperiences = experiences.filter((exp) =>
    exp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-500">
      <StuNav />

      {/* 🚀 Background Cyber Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -translate-x-1/2"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-4 md:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/20">
            <Sparkles size={12} /> Success Stories
          </span>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
            Career <span className="text-blue-600">Insights</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium italic text-xs tracking-widest uppercase">
            Learn from those who have already conquered the interview room
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* 📝 Left Side - Sharing Console */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-[450px] sticky lg:top-32"
          >
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-8 rounded-[3rem] shadow-2xl">
              <h2 className="text-xl font-black uppercase italic text-slate-800 dark:text-white mb-8 flex items-center gap-2">
                <Video className="text-blue-500" /> Share Journey
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    name="name"
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 pl-12 pr-6 py-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-slate-800 dark:text-white text-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    name="company"
                    placeholder="Company (e.g. Google, TCS)"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 pl-12 pr-6 py-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-slate-800 dark:text-white text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      name="salary"
                      placeholder="Salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 pl-10 pr-4 py-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-slate-800 dark:text-white text-sm"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      name="role"
                      placeholder="Role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 pl-10 pr-4 py-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-slate-800 dark:text-white text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest flex items-center gap-2">
                    <FileVideo size={14} className="text-blue-500" /> Interview Video
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl cursor-pointer bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-blue-500 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                        {formData.video ? formData.video.name : "Choose MP4/MOV"}
                      </p>
                    </div>
                    <input name="video" type="file" accept="video/*" className="hidden" onChange={handleChange} />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className={`w-full py-4 rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl ${
                    isUploading 
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-500/20"
                  }`}
                >
                  {isUploading ? "Transmitting..." : "Broadcast Story"} <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>

          {/* 📺 Right Side - Experience Feed */}
          <div className="flex-1 w-full space-y-8">
            <div className="relative group max-w-md ml-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search by role or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 pl-14 pr-6 py-4 rounded-full outline-none focus:border-blue-500/50 transition-all font-bold text-slate-800 dark:text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredExperiences.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
                    <PlayCircle size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4 opacity-30" />
                    <p className="text-slate-500 font-black uppercase italic tracking-widest text-sm">No transmissions found.</p>
                  </div>
                ) : (
                  filteredExperiences.map((exp, index) => (
                    <motion.div
                      layout
                      key={exp.id || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-6 rounded-[2.5rem] shadow-xl hover:border-blue-500/30 transition-all group overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">{exp.name}</h3>
                          <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{exp.role}</span>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 text-[9px] font-black uppercase">
                          {exp.salary}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 dark:bg-black/20 rounded-2xl">
                        <Building2 size={16} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{exp.company}</span>
                      </div>

                      <div className="relative rounded-3xl overflow-hidden aspect-video border border-white/5 shadow-2xl">
                         <video
                            src={exp.videoUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Nexbadi Career Protocol • Student Insights</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
      `}</style>
    </div>
  );
}