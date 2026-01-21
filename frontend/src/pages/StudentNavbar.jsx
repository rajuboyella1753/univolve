import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiMenuAlt3, 
  HiX, 
  HiOutlineLogout, 
  HiOutlineSparkles 
} from "react-icons/hi";

export default function StudentNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setIsLoggedIn(true);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/student/dashboard" },
    { name: "Honor Wall", path: "/about" },
    { name: "Contact", path: "/services" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled 
      ? "bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 py-3 shadow-2xl" 
      : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          {/* 🚀 Brand Identity */}
          <Link to="/student/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-black italic text-lg text-shadow">N</span>
            </div>
            <div className="flex flex-col">
             <span className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">
              Nexbadi<span className="text-purple-400">-MBU</span>
            </span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mt-1">Student Protocol</span>
            </div>
          </Link>

          {/* 💻 Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`relative text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    location.pathname === link.path 
                    ? "text-purple-600 dark:text-purple-400" 
                    : "text-slate-600 dark:text-slate-400 hover:text-purple-500"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="nav-underline" 
                      className="absolute -bottom-2 left-0 w-full h-[2px] bg-purple-600 rounded-full" 
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>

            <div className="flex items-center gap-6">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-purple-500 transition-colors">Login</Link>
                  <Link to="/signup" className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95">Initiate</Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 transition-all active:scale-95"
                >
                  <HiOutlineLogout className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Terminal Exit
                </button>
              )}
            </div>
          </div>

          {/* 📱 Mobile UI Controls */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => navigate("/ai-chat")} 
              className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20"
            >
              <HiOutlineSparkles className="w-5 h-5 animate-pulse" />
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10"
            >
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenuAlt3 className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Sidebar (Modern Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] md:hidden"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[80%] max-w-[300px] bg-white dark:bg-[#020617] shadow-2xl z-[150] p-10 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-12">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600">Command Center</span>
                 <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:rotate-90 transition-transform"><HiX size={24}/></button>
              </div>

              <div className="space-y-8 flex-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className="block text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white hover:text-purple-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-4">
                {!isLoggedIn ? (
                  <div className="grid grid-cols-1 gap-3">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="py-4 text-center rounded-2xl bg-slate-100 dark:bg-white/5 font-black uppercase text-xs tracking-widest text-slate-900 dark:text-white">Login</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="py-4 text-center rounded-2xl bg-purple-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-purple-500/20">Signup</Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-5 flex items-center justify-center gap-3 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase text-[10px] tracking-widest border border-red-500/20"
                  >
                    <HiOutlineLogout className="w-5 h-5" /> Terminal Exit
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}