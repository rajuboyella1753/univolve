import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Users, ChevronDown, Rocket, ShieldCheck } from "lucide-react";
import api from "../api/api-base";

const roleOptions = {
  admin: [
    { label: "Super Admin", value: "superadmin" },
    { label: "Content Admin", value: "contentadmin" },
    { label: "Support Admin", value: "supportadmin" },
  ],
  // owner: [] <- Removed owners from here
  student: [], 
};

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    subrole: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setFormData((prev) => ({ ...prev, role: value, subrole: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, password, role, subrole, gender } = formData;

    if (!role) {
      setError("Please select a role.");
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (role === "admin" && subrole === "superadmin" && email !== "rajuboyella737@sudara.org") {
      setError("Only authorized email can signup as Super Admin.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        role: role.toLowerCase(),
        subrole: subrole.toLowerCase(),
        gender,
      });

      if (res.status === 201) {
        if (role === "student") {
          alert("Signup successful!");
        } else {
          alert("Signup successful! Awaiting admin approval.");
        }
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20"
            >
              <Rocket className="text-white w-9 h-9" />
            </motion.div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              Join Nex<span className="text-purple-500">badi</span>
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Create your student account</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold mb-6 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full bg-black/20 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-white focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full bg-black/20 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-white focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full bg-black/20 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-white focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-slate-300 focus:border-purple-500/50 transition-all font-bold uppercase text-[11px] tracking-widest appearance-none cursor-pointer relative"
                  required
                >
                  <option value="" className="bg-[#0f172a]">Gender</option>
                  <option value="male" className="bg-[#0f172a]">Male</option>
                  <option value="female" className="bg-[#0f172a]">Female</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/5 p-4 pl-12 rounded-2xl outline-none text-slate-300 focus:border-purple-500/50 transition-all font-black uppercase text-[11px] tracking-widest appearance-none cursor-pointer relative"
                required
              >
                <option value="" className="bg-[#0f172a]">Select Your Role</option>
                {Object.keys(roleOptions).map((r) => (
                  <option key={r} value={r} className="bg-[#0f172a]">{r.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <AnimatePresence>
              {formData.role && roleOptions[formData.role].length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative group overflow-hidden"
                >
                  <select
                    name="subrole"
                    value={formData.subrole}
                    onChange={handleChange}
                    className="w-full bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl outline-none text-purple-400 focus:border-purple-500 transition-all font-black uppercase text-[11px] tracking-widest appearance-none cursor-pointer"
                    required
                  >
                    <option value="" className="bg-[#0f172a]">Select Specialty</option>
                    {roleOptions[formData.role].map((sr) => (
                      <option key={sr.value} value={sr.value} className="bg-[#0f172a]">
                        {sr.label.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 pointer-events-none" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full p-4 mt-4 rounded-2xl font-black uppercase italic tracking-widest text-xs shadow-xl shadow-purple-500/10 transition-all ${
                loading ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-white text-black hover:bg-purple-600 hover:text-white"
              }`}
            >
              {loading ? "Creating Account..." : "Start Your Journey"}
            </motion.button>

            <p className="mt-6 text-center text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              Already a member?{" "}
              <Link to="/" className="text-purple-500 hover:text-white transition-colors underline decoration-purple-500/30 underline-offset-4">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}