import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaImage, FaUserCircle 
} from "react-icons/fa";
import { ShoppingBag, PlusCircle, Search, Trash2, Edit3, PhoneCall, Package, Info, IndianRupee } from "lucide-react";
import axios from "axios";
import StuNav from "../StudentNavbar";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PROD_API;

export default function StudentMarketplace() {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    price: "",
    sellerName: "",
    mobile: "",
    image: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchItems();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data);
      setFormData((prev) => ({ ...prev, sellerName: res.data.name }));
    } catch (err) { console.error(err); }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/marketplace/items`);
      setAllItems(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      if (editItemId) {
        await axios.put(`${BASE_URL}/api/marketplace/update/${editItemId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditItemId(null);
      } else {
        await axios.post(`${BASE_URL}/api/marketplace/sell`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchItems();
      setFormData({
        itemName: "", description: "", price: "",
        sellerName: currentUser?.name || "",
        mobile: "", image: null,
      });
      setPreview(null);
      alert("✅ Published Successfully!");
    } catch (err) { alert("❌ Failed!"); }
  };

  const handleEdit = (item) => {
    setEditItemId(item._id);
    setFormData({
      itemName: item.itemName,
      description: item.description,
      price: item.price,
      sellerName: item.sellerName,
      mobile: item.mobile,
      image: null,
    });
    if (item.image) setPreview(`${BASE_URL}/uploads/sell/${item.image}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/marketplace/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) { console.error(err); }
  };

  const filteredItems = searchQuery
    ? allItems.filter((item) =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allItems;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden">
      <StuNav />
      
      {/* 🌌 Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-50 dark:opacity-100">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-28 pb-20 px-4">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
              CAMPUS <span className="text-emerald-500 italic">MARKET</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Verified Peer-to-Peer Trading</p>
          </div>
          
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 pl-12 pr-4 py-3 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold text-slate-800 dark:text-white shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 📝 Listing Form (Sticky) */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 rounded-[2.5rem] shadow-xl sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><PlusCircle size={20}/></div>
                <h2 className="text-lg font-black uppercase text-slate-800 dark:text-white">{editItemId ? "Edit Item" : "Post Item"}</h2>
              </div>

              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <input name="itemName" placeholder="What are you selling?" value={formData.itemName} onChange={handleInputChange} required className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-xl outline-none focus:ring-2 ring-emerald-500/20 font-bold text-sm dark:text-white" />
                
                <textarea name="description" placeholder="Short description..." rows="2" value={formData.description} onChange={handleInputChange} required className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-xl outline-none focus:ring-2 ring-emerald-500/20 font-medium text-sm dark:text-white resize-none" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleInputChange} required className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 pl-9 pr-3 py-3 rounded-xl outline-none font-bold text-sm dark:text-white" />
                  </div>
                  <input name="mobile" type="tel" placeholder="Mobile" maxLength="10" value={formData.mobile} onChange={handleInputChange} required className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-3 py-3 rounded-xl outline-none font-bold text-sm dark:text-white" />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 ml-2">Product Image</p>
                  {!preview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl cursor-pointer bg-slate-50 dark:bg-black/20 hover:bg-emerald-500/5 transition-all">
                      <FaImage className="text-slate-300" size={24} />
                      <span className="text-[10px] font-bold text-slate-400 mt-2">UPLOAD PHOTO</span>
                      <input name="image" type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
                    </label>
                  ) : (
                    <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-emerald-500/30">
                      <img src={preview} alt="preview" className="w-full h-full object-contain bg-black/5" />
                      <button type="button" onClick={() => {setPreview(null); setFormData(p => ({...p, image: null}))}} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg"><Trash2 size={12}/></button>
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                  {editItemId ? "SAVE CHANGES" : "PUBLISH NOW"}
                </button>
              </form>
            </div>
          </div>

          {/* 🛍️ Market Feed */}
          <div className="flex-1">
            {loading ? (
              <div className="py-20 text-center animate-pulse font-black text-slate-400 uppercase tracking-widest">Inventory Scanning...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <motion.div
                        layout
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                      >
                        {/* Image Container - FIXED CUTTING PROBLEM */}
                        <div className="relative h-64 w-full bg-slate-100 dark:bg-black/40 flex items-center justify-center p-4">
                          {item.image ? (
                            <img
                              src={`${BASE_URL}/uploads/sell/${item.image}`}
                              alt={item.itemName}
                              className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <Package className="text-slate-300" size={48} />
                          )}
                          <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full font-black text-xs shadow-lg">
                            ₹{item.price}
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate">{item.itemName}</h3>
                            {currentUser?._id === item.user?._id && (
                              <div className="flex gap-2 shrink-0">
                                <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><Edit3 size={16}/></button>
                                <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-6 line-clamp-2 italic leading-relaxed">
                            "{item.description}"
                          </p>

                          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-emerald-500">
                                <FaUserCircle size={18} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase text-slate-400">Seller</span>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-24">{item.sellerName}</span>
                              </div>
                            </div>

                            <a
                              href={`tel:${item.mobile}`}
                              className="flex items-center gap-2 bg-slate-900 dark:bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-500 transition-all shadow-md"
                            >
                              <PhoneCall size={12} /> CONTACT
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
                      <ShoppingBag size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4 opacity-40" />
                      <p className="text-slate-500 font-black uppercase italic tracking-widest">No listings found.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Campus Economic Protocol © 2026</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}