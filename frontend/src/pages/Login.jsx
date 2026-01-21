import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, UserCircle, ChevronDown, ShieldCheck, ArrowRight } from "lucide-react";
import api from "../api/api-base";

const roleOptions = {
  admin: ["Super Admin", "Support Admin", "Content Admin"],
  // owner: [] <- Removed this section
  student: [],
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [subRole, setSubRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const cleanedSubrole = subRole.toLowerCase().replace(/\s/g, "");

      const res = await api.post("/api/auth/login", {
        email,
        password,
        role,
        subrole: cleanedSubrole,
      });
      
      localStorage.clear();
      const { token, user, owner } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Owner specific storage logic removed if not needed, 
      // but keeping basic structure to not break logic
      if (user.role === "owner") {
        localStorage.setItem("owner", JSON.stringify(owner || user));
      }

      // Get User Location
      navigator.geolocation.getCurrentPosition(
        (pos) => localStorage.setItem("user_location", JSON.stringify({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
        (err) => console.log("Location denied")
      );

      // SuperAdmin Check
      if (role === "admin" && cleanedSubrole === "superadmin" && email !== "rajuboyella737@sudara.org") {
        setError("Access denied! Only Raju can login as Super Admin.");
        setIsLoading(false);
        return;
      }

      if (user.rejected) {
        setError("Super Admin has rejected your account.");
        setIsLoading(false);
        return;
      }

      // Routing Logic
      if (user.role === "admin") {
        if (user.subrole === "superadmin") navigate("/super-admin-dashboard");
        else if (user.subrole === "contentadmin") navigate("/admin/content-dashboard");
        else if (user.subrole === "supportadmin") navigate("/support/dashboard");
        else navigate("/admin");
      } 
      // Owner Routing Logic kept for safety but won't be triggered by UI
      else if (user.role === "owner") {
        const routes = {
          restaurantowner: "/owner/dashboard",
          shoppingmallowner: "/owner/shoppingmall",
          hostelowner: "/owner/hostel"
        };
        navigate(routes[user.subrole] || "/");
      } else if (user.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Invalid Credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden px-4">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20"
            >
              <ShieldCheck className="text-white w-10 h-10" />
            </motion.div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              Nex<span className="text-purple-500">badi</span> Login
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Student Ecosystem Access</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold mb-4 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-black/20 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-white focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-black/20 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-white focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role Select */}
            <div className="relative group">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-500 transition-colors z-10" />
              <select
                value={role}
                onChange={(e) => { setRole(e.target.value); setSubRole(""); }}
                className="w-full bg-black/20 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-slate-300 focus:border-purple-500/50 transition-all font-black uppercase text-[11px] tracking-widest appearance-none cursor-pointer relative"
              >
                <option value="" className="bg-[#0f172a]">Select Main Role</option>
                {Object.keys(roleOptions).map((r) => (
                  <option key={r} value={r} className="bg-[#0f172a]">{r.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            {/* Sub-Role Select */}
            <AnimatePresence>
              {role && roleOptions[role].length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative group"
                >
                  <select
                    value={subRole}
                    onChange={(e) => setSubRole(e.target.value)}
                    className="w-full bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl outline-none text-purple-400 focus:border-purple-500 transition-all font-black uppercase text-[11px] tracking-widest appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0f172a]">Select Your Specialty</option>
                    {roleOptions[role].map((sr) => (
                      <option key={sr} value={sr.toLowerCase().replace(/\s/g, "")} className="bg-[#0f172a]">
                        {sr.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 pointer-events-none" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full p-4 rounded-2xl font-black uppercase italic tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-500/10 ${
                isLoading ? 'bg-slate-700 text-slate-400' : 'bg-white text-black hover:bg-purple-500 hover:text-white'
              }`}
            >
              {isLoading ? "Verifying..." : "Enter Nexbadi"} 
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </div>

          <p className="mt-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-wider leading-relaxed">
            New to the community? <br/>
            <Link to="/signup" className="text-purple-500 hover:text-white transition-colors underline decoration-purple-500/30 underline-offset-4">
              Create a free account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}