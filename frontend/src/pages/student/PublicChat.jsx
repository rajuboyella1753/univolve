import { useState, useEffect } from "react";
import api from "../../api/api-base";
import StuNav from "../StudentNavbar";
import {
  FaHeart,
  // FaRegComment,
  FaShare,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicChat() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [commentInput, setCommentInput] = useState({});
  const [showComments, setShowComments] = useState({});
  const [userId, setUserId] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingCaption, setEditingCaption] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/public-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch posts");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(res.data._id);
    } catch (err) {
      console.error("Profile fetch failed");
    }
  };

  const uploadToServer = async () => {
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("caption", caption);

      const token = localStorage.getItem("token");
      await api.post("/api/public-posts/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setFile(null);
      setCaption("");
      setSuccess("✅ Post uploaded successfully!");
      setError("");
      fetchPosts();
    } catch (err) {
      console.error("Upload error:", err);
      setError("❌ Failed to post. Try again.");
    }
  };

  const handleUpload = async () => {
    if (!file && !caption.trim()) {
      return setError("Enter a caption or select a file");
    }

    if (file?.type.startsWith("video")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        if (video.duration > 180) {
          setError("⛔ Video must be under 3 minutes");
        } else {
          uploadToServer();
        }
      };
      video.src = URL.createObjectURL(file);
    } else {
      uploadToServer();
    }
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      await api.post(
        `/api/public-posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleComment = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      await api.post(
        `/api/public-posts/${postId}/comment`,
        { comment: commentInput[postId] || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentInput((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

const handleEditPost = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    await api.put(
      `/api/public-posts/${postId}`,
      { caption: editingCaption },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingPostId(null);
    fetchPosts();
  } catch (err) {
    console.error("Edit post error:", err);
  }
};

const handleDeletePost = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    await api.delete(`/api/public-posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  } catch (err) {
    console.error("Delete post error:", err);
  }
};
const handleEditComment = async (postId, commentId) => {
  const token = localStorage.getItem("token");
  try {
    await api.put(
      `/api/public-posts/${postId}/comments/${commentId}`,
      { comment: editingCommentText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingCommentId(null);
    fetchPosts();
  } catch (err) {
    console.error("Edit comment error:", err);
  }
};

const handleDeleteComment = async (postId, commentId) => {
  const token = localStorage.getItem("token");
  try {
    await api.delete(`/api/public-posts/${postId}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  } catch (err) {
    console.error("Delete comment error:", err);
  }
};






const handleSocialShare = (post) => {
  const baseUrl = window.location.origin;
  const postLink = `${baseUrl}/public-post/${post._id}`;
  const message = encodeURIComponent(`${post.caption}\n\nCheck this post: ${postLink}`);
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, "_blank");
};




  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const filterPosts = () => {
    let filtered = [...posts];
    if (filterType !== "all") {
      filtered = filtered.filter((p) => p.type === filterType);
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.caption?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, filterType, posts]);

  return (
    <>
      <StuNav />
    
        <div className="bg-gradient-to-br from-slate-100 to-blue-50 pt-20 px-4 md:px-6 max-w-7xl mx-auto min-h-[calc(100vh-80px)] pb-8">
    <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">📢 Carrer Experience</h1>

    {error && <p className="text-red-600 text-center">{error}</p>}
    {success && <p className="text-green-600 text-center">{success}</p>}

    <div className="flex flex-col md:flex-row gap-6 md:h-[calc(100vh-200px)]">
      {/* Input Left Fixed Height in Desktop */}
      <div className="bg-white p-6 shadow-xl rounded-xl w-full md:w-1/3 border border-blue-100 space-y-4 overflow-y-auto max-h-[80vh] md:max-h-full">
        <div>
          <label className="text-sm font-medium text-gray-700">Upload Media</label>
          <input
            type="file"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Caption</label>
          <textarea
            rows="3"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write your caption here..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded shadow hover:from-blue-600 hover:to-indigo-700"
        >
          Post
        </button>

        <div>
          <label className="text-sm font-medium text-gray-700">Filter Posts</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['all', 'image', 'video', 'text'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-xs px-3 py-1 rounded-full border ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {type === 'text' ? 'Text' : type === 'all' ? 'All' : `${type[0].toUpperCase()}${type.slice(1)}s`}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Posts Right Scrollable Only */}
      <div className="flex flex-col w-full md:w-2/3 overflow-y-auto">
        <div className="pr-1">
          {filteredPosts.length === 0 ? (
            <p className="text-gray-500 text-center mt-6">No posts found.</p>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white shadow rounded-lg p-4 mb-4 border border-gray-100"
              >
                <p className="font-semibold text-blue-700 text-sm">{post.senderName}</p>

                {post.type === "image" ? (
                  <img
                    src={`${api.defaults.baseURL}${post.contentUrl}`}
                    alt="upload"
                    className="my-2 rounded max-h-80 w-full object-contain"
                  />
                ) : post.type === "video" ? (
                  <video controls className="w-full rounded my-2 max-h-80">
                    <source src={`${api.defaults.baseURL}${post.contentUrl}`} />
                  </video>
                ) : null}

                {editingPostId === post._id ? (
  <div className="mb-2">
    <textarea
      className="w-full border p-1 rounded text-sm"
      value={editingCaption}
      onChange={(e) => setEditingCaption(e.target.value)}
    />
    <div className="flex gap-2 mt-1">
      <button
        onClick={() => handleEditPost(post._id)}
        className="text-xs bg-green-600 text-white px-2 py-1 rounded"
      >
        Save
      </button>
      <button
        onClick={() => setEditingPostId(null)}
        className="text-xs bg-gray-300 px-2 py-1 rounded"
      >
        Cancel
      </button>
    </div>
  </div>
) : (
  <p className="text-gray-800 mb-2 text-sm">{post.caption}</p>
)}
{userId?.toString() === post.senderId?.toString() && (


  <div className="flex gap-2 text-xs text-blue-600 mb-2">
    <button
      onClick={() => {
        setEditingPostId(post._id);
        setEditingCaption(post.caption);
      }}
    >
      ✏ Edit
    </button>
    <button
      onClick={() => handleDeletePost(post._id)}
      className="text-red-600"
    >
      🗑 Delete
    </button>
  </div>
)}


                <div className="flex items-center gap-4 text-gray-600 text-xs mb-2">
                  <button onClick={() => handleLike(post._id)} className="flex items-center gap-1">
                    <FaHeart className="text-red-500" /> {post.likes.length}
                  </button>
                  <button onClick={() => toggleComments(post._id)} className="flex items-center gap-1">
                    {showComments[post._id] ? <FaChevronUp /> : <FaChevronDown />} {post.comments.length}
                  </button>
                
                  <button onClick={() => handleSocialShare(post)} className="flex items-center gap-1">
                    <FaShare /> Share
                  </button>


                </div>

                <AnimatePresence initial={false}>
                  {showComments[post._id] && (
                    <motion.div
                      className="mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex gap-2 mb-2">
                        <input
                          className="border p-1 flex-1 rounded text-sm"
                          value={commentInput[post._id] || ""}
                          onChange={(e) =>
                            setCommentInput((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                          placeholder="Write a comment..."
                        />
                        <button
                          onClick={() => handleComment(post._id)}
                          className="bg-blue-600 text-white px-3 rounded text-sm"
                        >
                          Send
                        </button>
                      </div>
{console.log("Logged-in User ID:", userId)}
{console.log("Post sender ID:", post.senderId)}
{post.comments.map((c) => (
  <>
    {console.log("Comment userId:", c.userId)}
    {console.log("Logged-in userId:", userId)}
    ...
  </>
))}

    {post.comments.map((c, i) => (
  <div key={i} className="bg-gray-100 rounded p-2 text-xs mb-1">
    <strong>{c.name}:</strong>{" "}
    {editingCommentId === c._id ? (
      <>
        <input
          value={editingCommentText}
          onChange={(e) => setEditingCommentText(e.target.value)}
          className="border rounded px-1 py-0.5 text-xs w-full mt-1"
        />
        <div className="flex gap-1 mt-1">
          <button
            onClick={() => handleEditComment(post._id, c._id)}
            className="text-green-600"
          >
            Save
          </button>
          <button onClick={() => setEditingCommentId(null)}>Cancel</button>
        </div>
      </>
    ) : (
      <>
        {c.comment}
        {userId?.toString() === c.userId?.toString() && (

          <div className="mt-1 flex gap-2 text-blue-600">
            <button
              onClick={() => {
                setEditingCommentId(c._id);
                setEditingCommentText(c.comment);
              }}
              className="hover:underline"
            >
              ✏ Edit
            </button>
            <button
              onClick={() => handleDeleteComment(post._id, c._id)}
              className="text-red-600 hover:underline"
            >
              🗑 Delete
            </button>
          </div>
        )}
      </>
    )}
  </div>
))}


                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>

    </>
  );
}
