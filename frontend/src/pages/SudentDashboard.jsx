import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenIcon,
  UserGroupIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon,
  PhotoIcon,
  MegaphoneIcon,
  ExclamationTriangleIcon,
  LifebuoyIcon
  // AcademicCapIcon,
  // MusicalNoteIcon,
  // HeartIcon,
  // ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { MapPinIcon, ShoppingBagIcon, ArrowRightIcon } from "lucide-react";
import StudentNavbar from "./StudentNavbar";

// ✅ Updated Colors based on Official Deep Indigo Theme
const cards = [
   {
    title: "Library Book Search",
    desc: "Find books and know the exact library floor easily.",
    icon: BookOpenIcon,
    color: "from-blue-500 to-indigo-600",
    link: "/student/library",
    badge: "Utility",
  },
    {
    title: "Job Portal",
    desc: "Internships & jobs curated for MBU students.",
    icon: ArrowTrendingUpIcon,
    color: "from-indigo-600 to-violet-700",
    link: "/job-portal",
    badge: "Latest",
  },
  {
    title: "Student Help Corner",
    desc: "Seniors guide juniors on academics, placements, and career advice.",
    icon: UserGroupIcon,
    color: "from-blue-400 to-cyan-500",
    link: "/student-help",
    badge: "Community",
  },
  {
    title: "MBU Tails (News)",
    desc: "Get the latest verified news and updates from the MBU campus.",
    icon: MegaphoneIcon,
    color: "from-indigo-500 to-blue-700",
    link: "/mbu-tails",
    badge: "News Feed",
  },
  // {
  //   title: "Golden Memories",
  //   desc: "A special page to relive the best moments of campus life.",
  //   icon: PhotoIcon,
  //   color: "from-yellow-400 to-orange-500",
  //   link: "/golden-page",
  //   badge: "Exclusive",
  // },
  {
    title: "Interview Experience",
    desc: "Read real interview experiences shared by seniors.",
    icon: BriefcaseIcon,
    color: "from-blue-600 to-indigo-800",
    link: "/interview-experience",
    badge: "Career",
  },
  // {
  //   title: "Explore Happiness",
  //   desc: "Discover beautiful nearby places shared by students.",
  //   icon: MapPinIcon,
  //   color: "from-teal-400 to-cyan-600",
  //   link: "/explore-happiness",
  //   badge: "Lifestyle",
  // },
  {
    title: "Campus Marketplace",
    desc: "Buy & sell items easily within the campus.",
    icon: ShoppingBagIcon,
    color: "from-indigo-400 to-blue-600",
    link: "/student-marketplace",
    badge: "Finance",
  },
  {
    title: "Freelancing",
    desc: "Find real projects and build your portfolio.",
    icon: GlobeAltIcon,
    color: "from-blue-500 to-indigo-600",
    link: "/freelance",
    badge: "Portfolio",
  },

  // {
  //   title: "Student Rights",
  //   desc: "Know your rights and legal information for safety.",
  //   icon: ShieldCheckIcon,
  //   color: "from-red-500 to-rose-700",
  //   link: "/student-rights-info",
  //   badge: "Safety",
  // },
  {
    title: "Monthly Article",
    desc: "One inspiring topic every month for students.",
    icon: DocumentTextIcon,
    color: "from-indigo-700 to-blue-900",
    link: "/monthly-article",
    badge: "Read",
  },
  // {
  //   title: "Fitness & Diet",
  //   desc: "Get protein-rich diet plans and fitness tips.",
  //   icon: HeartIcon,
  //   color: "from-rose-400 to-pink-600",
  //   link: "/fitness-protein",
  //   badge: "Health",
  // },
  // {
  //   title: "Devotional Wisdom",
  //   desc: "Spiritual lessons and wisdom for a peaceful life.",
  //   icon: MusicalNoteIcon,
  //   color: "from-orange-400 to-red-600",
  //   link: "/devotional-lessons",
  //   badge: "Wisdom",
  // },
  
    // {
    //   title: "Disha Complaint",
    //   desc: "Emergency safety portal and complaint registration for female students.",
    //   icon: ExclamationTriangleIcon,
    //   color: "from-pink-500 to-rose-600",
    //   link: "/girl-complaint",
    //   badge: "Safety",
    //   genderReq: "female" 
    // },
  
    // {
    //   title: "Police Complaint",
    //   desc: "Direct access to report issues and register police complaints.",
    //   icon: LifebuoyIcon,
    //   color: "from-blue-600 to-slate-800",
    //   link: "/police-complaint",
    //   badge: "Legal",
    // },
  {
    title: "Suggestions",
    desc: "Send ideas or issues directly to Admin.",
    icon: ChatBubbleBottomCenterTextIcon,
    color: "from-slate-700 to-slate-900",
    link: "/suggestion-box",
    badge: "Feedback",
  },
];

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    data && setStudent(JSON.parse(data));
  }, []);

  if (!student)
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-500">
      <StudentNavbar />

      {/* 🌌 Atmospheric Glows matching Navbar Colors */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Hero Section */}
      <div className="pt-36 pb-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <SparklesIcon className="w-3 h-3" /> Student Universe
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 italic uppercase">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{student.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="max-w-2xl mx-auto text-indigo-200/60 font-medium">
            Your personal campus companion. NEXBADI is designed to empower every MBU student with resources, community, and growth.
          </p>
        </motion.div>
      </div>

      {/* Dashboard Grid */}
      <section className="max-w-7xl mx-auto mt-10 px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, desc, icon: Icon, color, link, badge }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Card Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity rounded-[2rem]`}></div>

              <div className="relative h-full bg-[#1e1b4b]/30 backdrop-blur-xl rounded-[2rem] p-8 border border-indigo-500/20 transition-all group-hover:border-blue-400/30 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] shadow-sm">
                
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg shadow-black/10`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 border border-white/5 bg-white/5 px-3 py-1 rounded-full">
                    {badge}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors tracking-tight italic uppercase leading-tight">
                  {title}
                </h2>
                <p className="text-sm text-indigo-200/60 leading-relaxed mb-8">
                  {desc}
                </p>

                <Link
                  to={link}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 transition-colors hover:text-blue-300"
                >
                  Explore Now <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-indigo-500/20 bg-slate-950/50 text-center px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 opacity-60">
          © 2026 <span className="text-blue-400 font-black">NEXBADI</span> | MBU Student Ecosystem
        </p>
        <p className="mt-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">
          Built with ❤️ by 4th Year B.Tech CSE – For the future of MBU
        </p>
      </footer>
    </div>
  );
}