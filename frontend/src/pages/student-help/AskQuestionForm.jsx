import { useState, useEffect } from "react";
import apiBase from "../../api/api-base";
import StuNav from "../StudentNavbar";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Search, 
  Send, 
  PlusCircle, 
  ChevronRight,
  BookOpen,
  Briefcase,
  GraduationCap
} from "lucide-react";

export default function StudentHelpCorner() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Academics",
    branch: "",
    year: "",
  });

  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [replies, setReplies] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await apiBase.get("/api/student-help");
        setQuestions(res.data);
        setFilteredQuestions(res.data);
        for (let q of res.data) fetchReplies(q._id);
      } catch (err) {
        console.error("Failed to load questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  const fetchReplies = async (questionId) => {
    try {
      const res = await apiBase.get(`/api/student-help/replies/${questionId}`);
      setReplies((prev) => ({ ...prev, [questionId]: res.data }));
    } catch (err) {
      console.error("Error fetching replies", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const duplicate = questions.find(
      (q) => q.title.toLowerCase().trim() === formData.title.toLowerCase().trim()
    );

    if (duplicate) {
      setSelectedQuestionId(duplicate._id);
      alert("This question is already posted.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiBase.post("/api/student-help", formData);
      const newQuestion = res.data;
      setQuestions([newQuestion, ...questions]);
      setFilteredQuestions([newQuestion, ...filteredQuestions]);
      fetchReplies(newQuestion._id);
      setSelectedQuestionId(newQuestion._id);
      setFormData({ title: "", description: "", category: "Academics", branch: "", year: "" });
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (questionId) => {
    const replyText = replyInputs[questionId];
    if (!replyText || replyText.trim() === "") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in to reply.");

      await apiBase.post(
        "/api/student-help/replies",
        { questionId, replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReplyInputs((prev) => ({ ...prev, [questionId]: "" }));
      fetchReplies(questionId);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to post reply.");
    }
  };

  const handleMarkHelpful = async (replyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("User not authenticated.");

      await apiBase.post(
        `/api/student-help/replies/${replyId}/mark-helpful`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Reply marked as helpful! 10 points awarded! 🌟");
    } catch (err) {
      alert(err.response?.data?.error || "Error marking helpful");
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({ ...formData, title });
    const match = questions.find((q) => q.title.toLowerCase().trim() === title.toLowerCase().trim());
    setSelectedQuestionId(match ? match._id : null);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredQuestions(
      questions.filter(
        (q) =>
          (q.description.toLowerCase().includes(value.toLowerCase()) ||
            q.category.toLowerCase().includes(value.toLowerCase())) &&
          (!selectedCategory || q.category === selectedCategory)
      )
    );
  };

  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setFilteredQuestions(
      questions.filter(
        (q) =>
          (!category || q.category === category) &&
          (q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  };

  const selectedQuestion = questions.find((q) => q._id === selectedQuestionId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500">
      <StuNav />
      
      <div className="pt-32 pb-12 px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
          NEXBADI <span className="text-indigo-600">HELP CORNER</span>
        </motion.h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                  <PlusCircle className="text-indigo-600" /> Ask Expert
                </h2>
                <Link to="/univolve-solvers" className="text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-600 px-3 py-1 rounded-full">Top Solvers</Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Question title..." value={formData.title} onChange={handleTitleChange} required className="w-full bg-slate-50 dark:bg-black/20 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                <textarea placeholder="Describe in detail..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required className="w-full bg-slate-50 dark:bg-black/20 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                <div className="grid grid-cols-2 gap-3">
                   <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl outline-none text-xs font-black text-indigo-600 uppercase">
                    <option>Academics</option><option>Placements</option><option>Career</option>
                  </select>
                  <input type="text" placeholder="Branch" value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} required className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl outline-none text-xs font-bold uppercase" />
                </div>
                <input type="text" placeholder="Year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required className="w-full bg-slate-50 dark:bg-black/20 p-4 rounded-2xl outline-none text-xs font-bold uppercase" />
                <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/30 active:scale-95">
                  {loading ? "Transmitting..." : "Post Question"}
                </button>
              </form>
            </motion.div>
          </div>

          {/* MIDDLE: LIST */}
          <div className="lg:col-span-4 space-y-4">
             <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search queries..." className="w-full bg-white dark:bg-slate-900 p-4 pl-12 rounded-2xl outline-none border border-slate-200 dark:border-white/5 font-bold text-sm" />
                </div>
                <select value={selectedCategory} onChange={handleCategoryFilter} className="bg-white dark:bg-slate-900 px-4 rounded-2xl border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase text-slate-500">
                  <option value="">All</option><option value="Academics">Acad</option><option value="Placements">Place</option><option value="Career">Career</option>
                </select>
             </div>

             <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {filteredQuestions.map((q) => (
                  <motion.div key={q._id} onClick={() => { setSelectedQuestionId(q._id); fetchReplies(q._id); }} className={`cursor-pointer p-6 rounded-[2rem] border transition-all duration-300 relative group ${selectedQuestionId === q._id ? "bg-indigo-600 border-indigo-500 shadow-xl" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5"}`}>
                    <div className={`text-sm font-black uppercase italic mb-2 ${selectedQuestionId === q._id ? "text-white" : "text-indigo-600"}`}>{q.title}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedQuestionId === q._id ? "text-indigo-100" : "text-slate-400"}`}>
                       {q.category} • {q.branch}
                    </div>
                    <ChevronRight className={`absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all ${selectedQuestionId === q._id ? "text-white" : "text-indigo-500"}`} size={20} />
                  </motion.div>
                ))}
             </div>
          </div>

          {/* RIGHT: REPLIES SECTION */}
          <div className="lg:col-span-4">
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 h-[75vh] flex flex-col shadow-2xl relative">
                <h2 className="text-lg font-black uppercase italic text-indigo-600 mb-6 flex items-center gap-2">
                   <MessageCircle size={20} /> Solution Hub
                </h2>
                
                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                   {selectedQuestionId ? (
                     <>
                        <div className="p-5 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl border border-indigo-100 dark:border-indigo-500/20">
                           <h3 className="font-black text-indigo-700 dark:text-indigo-400 text-sm uppercase italic mb-2">
                             {questions.find(q => q._id === selectedQuestionId)?.title}
                           </h3>
                           <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                             {questions.find(q => q._id === selectedQuestionId)?.description}
                           </p>
                        </div>

                        <div className="space-y-4">
                           {replies[selectedQuestionId]?.map((r) => (
                             <div key={r._id} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent group">
                                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-3">{r.replyText}</p>
                                <div className="flex justify-between items-center">
                                   <div className="text-[10px] font-bold text-indigo-500 italic">↪ {r.repliedBy?.name || 'Solver'}</div>
                                   <button onClick={() => handleMarkHelpful(r._id)} className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-emerald-500 hover:text-white transition-all">Mark Helpful</button>
                                </div>
                             </div>
                           ))}
                           {(!replies[selectedQuestionId] || replies[selectedQuestionId].length === 0) && (
                             <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase italic">No solutions yet.</div>
                           )}
                        </div>
                     </>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                        <MessageCircle size={60} className="mb-4 text-indigo-500" />
                        <p className="text-sm font-black uppercase tracking-[0.2em]">Select a query to see details & reply</p>
                     </div>
                   )}
                </div>

                {/* ✅ REPLY INPUT - ALWAYS VISIBLE IF QUESTION SELECTED */}
                {selectedQuestionId && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                     <div className="relative">
                        <input
                          type="text"
                          placeholder="Your solution..."
                          value={replyInputs[selectedQuestionId] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setReplyInputs((prev) => ({ ...prev, [selectedQuestionId]: val }));
                          }}
                          className="w-full bg-slate-50 dark:bg-black/40 p-4 pr-14 rounded-2xl outline-none text-sm font-medium border border-transparent focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                        />
                        <button onClick={() => handleReplySubmit(selectedQuestionId)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                          <Send size={18} />
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}