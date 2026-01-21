import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  PlusCircle, 
  Edit, 
  LogOut, 
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.role === "admin" && storedUser?.subrole === "support admin") {
      setAdminName(storedUser.name || "Support Admin");
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const navLinks = [
    { name: "Dashboard", path: "/support/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Add Book", path: "/support/add-book", icon: <PlusCircle size={18} /> },
    { name: "Update Archive", path: "/support/update-book", icon: <Edit size={18} /> },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
      ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl" 
      : "bg-gradient-to-r from-[#1e1b4b] to-[#4338ca] py-5" 
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* --- Brand Identity --- */}
        <Link to="/support/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
            <ShieldCheck className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-none italic uppercase">
              UNIVOLVE <span className="text-blue-400">OPS</span>
            </span>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest opacity-80">Support Authority</span>
          </div>
        </Link>

        {/* --- Desktop Navigation --- */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                location.pathname === link.path 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40" 
                : "text-blue-100 hover:bg-white/10"
              }`}
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </div>

        {/* --- Right - Admin Profile --- */}
        <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white/20 shadow-inner text-[10px] font-black italic text-white">
              {adminName?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-indigo-300 uppercase leading-none mb-1">Active Admin</span>
              <span className="text-xs font-bold text-white truncate w-24 leading-none">{adminName}</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
          >
            Exit <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Hamburger (Mobile) */}
        <div className="md:hidden">
           <button 
             onClick={() => setMenuOpen(!menuOpen)}
             className="p-2 bg-white/5 rounded-xl border border-white/10 text-white"
           >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-t border-white/10 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                    location.pathname === link.path ? "bg-blue-600 text-white" : "bg-white/5 text-white"
                  }`}
                >
                  {link.icon} {link.name}
                </Link>
              ))}
              
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white">
                    {adminName?.charAt(0)}
                  </div>
                  <span className="font-bold text-white text-sm">{adminName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 p-3 rounded-xl text-white shadow-lg shadow-red-500/20"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}