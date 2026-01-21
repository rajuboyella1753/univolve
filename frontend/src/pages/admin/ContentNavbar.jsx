import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  PlusSquare, 
  FileEdit, 
  LogOut, 
  Menu, 
  X, 
  Newspaper,
  Sparkles
} from "lucide-react";

export default function ContentNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect to make it look professional
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin/content-dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Post Article", path: "/admin/upload-article", icon: <PlusSquare size={18} /> },
    { name: "Update Article", path: "/admin/update-article", icon: <FileEdit size={18} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4 ${
      scrolled 
      ? "bg-[#020617]/70 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
      : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/admin/content-dashboard")}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
             <Newspaper className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black italic uppercase tracking-tighter text-white leading-none">
              Nexbadi <span className="text-blue-500">Editor</span>
            </h1>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Content Authority</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`relative flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                location.pathname === link.path ? "text-blue-500" : "text-slate-400 hover:text-white"
              }`}
            >
              {link.icon}
              {link.name}
              {location.pathname === link.path && (
                <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-blue-500" />
              )}
            </button>
          ))}
          
          <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2 rounded-xl border border-red-500/20 transition-all duration-300 text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 bg-white/5 rounded-lg border border-white/10 text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#020617] shadow-3xl z-[150] p-8 md:hidden border-l border-white/5 backdrop-blur-2xl"
          >
            <div className="flex justify-between items-center mb-12">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Navigation Menu</span>
               <button onClick={() => setMenuOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={28} />
               </button>
            </div>

            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => { setMenuOpen(false); navigate(link.path); }}
                  className={`flex items-center gap-4 text-3xl font-black italic uppercase tracking-tighter transition-all ${
                    location.pathname === link.path ? "text-blue-500 pl-4" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="opacity-30">{link.icon}</span>
                  {link.name}
                </button>
              ))}
              
              <div className="w-full h-[1px] bg-white/5 my-4"></div>

              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="flex items-center gap-4 text-3xl font-black italic uppercase tracking-tighter text-red-500/70 hover:text-red-500"
              >
                <LogOut size={28} /> Logout
              </button>
            </div>

            <div className="mt-auto pt-10 text-center">
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Powered by Nexbadi Core</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}