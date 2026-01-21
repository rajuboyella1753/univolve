// import { useEffect, useState } from "react";
// import api from "../../api/api-base";
// import StuNav from "../StudentNavbar";
// import { FaHeart, FaRegComment } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";

// export default function ExploreHappiness() {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [place, setPlace] = useState("");
//   const [description, setDescription] = useState("");
//   const [posts, setPosts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [commentInput, setCommentInput] = useState({});
//   const [showComments, setShowComments] = useState({});
//   const [error, setError] = useState("");
//   const [userLocation, setUserLocation] = useState(null);
//   const [distances, setDistances] = useState({});

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       (err) => console.error("Location access denied", err)
//     );
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.get("/api/happiness", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPosts(res.data);

//       if (userLocation) {
//         const newDistances = {};
//         res.data.forEach((post) => {
//           if (post.lat && post.lng) {
//             const dist = haversineDistance(
//               userLocation.lat,
//               userLocation.lng,
//               post.lat,
//               post.lng
//             );
//             newDistances[post._id] = dist.toFixed(2);
//           }
//         });
//         setDistances(newDistances);
//       }
//     } catch (err) {
//       console.error("Fetch posts failed", err);
//     }
//   };

//   const haversineDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;
//     const R = 6371;
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const handleUpload = async () => {
//     if (!file || !place.trim()) {
//       return setError("\ud83d\udccc Please upload an image and enter a place name.");
//     }

//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("placeName", place);
//     formData.append("description", description);

//     try {
//       const token = localStorage.getItem("token");
//       await api.post("/api/happiness/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setFile(null);
//       setPreview(null);
//       setPlace("");
//       setDescription("");
//       setError("");
//       fetchPosts();
//     } catch (err) {
//       console.error("Upload failed", err);
//       setError("\u274c Upload failed. Try again.");
//     }
//   };

//   const handleLike = async (postId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await api.post(`/api/happiness/${postId}/like`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchPosts();
//     } catch (err) {
//       console.error("Like failed", err);
//     }
//   };

//   const handleComment = async (postId) => {
//     const token = localStorage.getItem("token");
//     try {
//       await api.post(
//         `/api/happiness/${postId}/comment`,
//         { comment: commentInput[postId] || "" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCommentInput((prev) => ({ ...prev, [postId]: "" }));
//       fetchPosts();
//     } catch (err) {
//       console.error("Comment failed", err);
//     }
//   };

//   const toggleComments = (postId) => {
//     setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//     if (selectedFile) {
//       setPreview(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleViewRoute = () => {
//     if (!searchTerm.trim()) return;
//     const destination = encodeURIComponent(searchTerm);
//     const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
//     window.open(mapsUrl, "_blank");
//   };

//   const filteredPosts = posts.filter((p) =>
//     p.placeName?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//       <StuNav />
//       <div className="pt-24 px-4 md:px-10 max-w-[1400px] mx-auto">
//         <h1 className="text-4xl font-bold text-center text-emerald-700 mb-6">
//           🌿 Explore Happiness
//         </h1>

//         {error && <p className="text-center text-red-600 mb-4">{error}</p>}

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Upload Form */}
//           <div className="bg-white p-6 rounded-xl shadow-xl h-fit">
//             <h2 className="text-lg font-semibold text-emerald-700 mb-2">
//               Share a Beautiful Place
//             </h2>

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full border px-3 py-2 rounded-lg text-sm"
//             />

//             {preview && (
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="rounded-lg mt-2 max-h-52 object-cover w-full border"
//               />
//             )}

//             <input
//               type="text"
//               placeholder="📍 Place name"
//               value={place}
//               onChange={(e) => setPlace(e.target.value)}
//               className="w-full border px-3 py-2 rounded-lg text-sm mt-3"
//             />

//             <textarea
//               placeholder="🌸 Short description..."
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full border px-3 py-2 rounded-lg text-sm mt-2"
//             ></textarea>

//             <button
//               onClick={handleUpload}
//               className="bg-emerald-600 text-white px-4 py-2 rounded-lg w-full hover:bg-emerald-700 mt-3 transition"
//             >
//               Upload
//             </button>
//           </div>

//           {/* Posts with Search */}
//           <div className="md:col-span-2 flex flex-col max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
//             <div className="sticky top-0 z-10 bg-white pb-4 pt-1 flex gap-2">
//               <input
//                 type="text"
//                 placeholder="🔍 Search places..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="flex-1 border px-4 py-2 rounded-lg"
//               />
//               <button
//                 onClick={handleViewRoute}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//               >
//                 View Route
//               </button>
//             </div>

//             {filteredPosts.length === 0 ? (
//               <p className="text-gray-500 text-center mt-4">No places found.</p>
//             ) : (
//               filteredPosts.map((post) => (
//                 <div key={post._id} className="bg-white p-5 shadow-md rounded-xl mb-6">
//                   <h3 className="text-xl font-semibold text-emerald-800 mb-1">
//                     {post.placeName}
//                   </h3>
//                   {distances[post._id] && (
//                     <p className="text-sm text-gray-500 mb-1">
//                       📍 {distances[post._id]} km away from you
//                     </p>
//                   )}
//                   <p className="text-gray-600 text-sm mb-2">{post.description}</p>
//                   <img
//                     src={`${api.defaults.baseURL}${post.imageUrl}`}
//                     alt={post.placeName}
//                     className="w-full max-h-96 object-cover rounded-lg mb-3"
//                   />

//                   <div className="flex gap-6 text-gray-600 text-sm items-center">
//                     <button onClick={() => handleLike(post._id)} className="flex items-center gap-2">
//                       <FaHeart className="text-red-500" /> {post.likes.length} Likes
//                     </button>
//                     <button onClick={() => toggleComments(post._id)} className="flex items-center gap-2">
//                       <FaRegComment /> {post.comments.length} Comments
//                     </button>
//                   </div>

//                   <AnimatePresence>
//                     {showComments[post._id] && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="mt-4 space-y-3"
//                       >
//                         <div className="flex gap-2">
//                           <input
//                             className="border flex-1 px-3 py-2 rounded-lg text-sm"
//                             placeholder="Write a comment..."
//                             value={commentInput[post._id] || ""}
//                             onChange={(e) =>
//                               setCommentInput((prev) => ({
//                                 ...prev,
//                                 [post._id]: e.target.value,
//                               }))
//                             }
//                           />
//                           <button
//                             onClick={() => handleComment(post._id)}
//                             className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm"
//                           >
//                             Send
//                           </button>
//                         </div>

//                         {post.comments.map((c, i) => (
//                           <div key={i} className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
//                             <strong>{c.name}:</strong> {c.comment}
//                           </div>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
//!//!
// import React, { useState } from "react";
// import { geocodePlace, fetchNearbyPlaces } from "./helpers/routeUtils";
// import StuNav from "../StudentNavbar";

// export default function ExploreHappiness() {
//   const [placeName, setPlaceName] = useState("");
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     setLoading(true);
//     setPlaces([]);

//     const coords = await geocodePlace(placeName);
//     if (!coords) {
//       alert("Place not found.");
//       setLoading(false);
//       return;
//     }

//     const nearby = await fetchNearbyPlaces(coords.lat, coords.lng);
//     setPlaces(nearby);
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <StuNav />
//       <div className="max-w-xl mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-4 text-center text-purple-600">Explore Beautiful Places</h1>

//         <div className="flex gap-2 mb-4">
//           <input
//             type="text"
//             placeholder="Enter a place (e.g. Tirupati)"
//             className="flex-1 px-4 py-2 border rounded shadow"
//             value={placeName}
//             onChange={(e) => setPlaceName(e.target.value)}
//           />
//           <button
//             onClick={handleSearch}
//             className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//           >
//             Search
//           </button>
//         </div>

//         {loading && <p className="text-center text-gray-500">Loading places...</p>}

//         <div className="grid gap-4">
//           {places.map((place, index) => (
//             <div key={index} className="p-4 bg-white rounded shadow border">
//               <h2 className="text-lg font-semibold">{place.properties.name || "Unnamed Place"}</h2>
//               <p className="text-sm text-gray-500">{place.properties.formatted}</p>
//               <p className="text-sm text-gray-400 capitalize">{place.properties.categories?.[0]}</p>
//             </div>
//           ))}
//         </div>

//         {places.length === 0 && !loading && (
//           <p className="text-center text-gray-400 mt-10">No places to show.</p>
//         )}
//       </div>
//     </div>
//   );
// }
//!//!
// import React, { useEffect, useState } from "react";
// import StuNav from "../StudentNavbar";
// import { geocodePlace, fetchNearbyPlaces, calculateDistance } from "./helpers/routeUtils";

// const categories = [
//   { label: "All", value: "" },
//   { label: "Tourist Sights", value: "tourism.sights" },
//   { label: "Entertainment", value: "entertainment" },
//   { label: "Parks & Gardens", value: "leisure.park" },
//   { label: "Natural Attractions", value: "natural" },
//   { label: "Restaurants", value: "catering.restaurant" },
//   { label: "Religious Places", value: "religion" },
// ];

// export default function ExploreHappiness() {
//   const [placeName, setPlaceName] = useState("");
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [userLocation, setUserLocation] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         });
//       },
//       (err) => console.error("Geolocation error:", err)
//     );
//   }, []);

//   const handleSearch = async () => {
//     setLoading(true);
//     setPlaces([]);

//     const coords = await geocodePlace(placeName);
//     if (!coords) {
//       alert("Place not found.");
//       setLoading(false);
//       return;
//     }

//     const nearby = await fetchNearbyPlaces(coords.lat, coords.lng, selectedCategory);
//     setPlaces(nearby);
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <StuNav />
//       <div className="max-w-6xl mx-auto pt-28 px-4">
//         <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
//           Explore Beautiful Places
//         </h1>

//         {/* Input & Dropdown */}
//         <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
//           <input
//             type="text"
//             placeholder="Enter a place (e.g. Tirupati)"
//             className="w-full md:w-1/2 px-4 py-2 border border-purple-300 rounded shadow"
//             value={placeName}
//             onChange={(e) => setPlaceName(e.target.value)}
//           />
//           <select
//             className="w-full md:w-1/4 px-4 py-2 border border-purple-300 rounded shadow"
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//           >
//             {categories.map((cat, idx) => (
//               <option key={idx} value={cat.value}>
//                 {cat.label}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={handleSearch}
//             className="bg-purple-600 text-white px-6 py-2 rounded shadow hover:bg-purple-700 transition"
//           >
//             Search
//           </button>
//         </div>

//         {loading && <p className="text-center text-gray-500">Loading places...</p>}

//         {/* Results */}
//         {places.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {places.map((place, index) => {
//               const props = place.properties;
//               const distance = userLocation
//                 ? `${calculateDistance(userLocation, {
//                     lat: props.lat,
//                     lng: props.lon,
//                   }).toFixed(2)} km`
//                 : "N/A";

//               const kind = props.kinds?.split(",")[0]?.replace("_", " ") || "N/A";

//               return (
//                 <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
//                   {props.datasource?.raw?.preview_image ? (
//                     <img
//                       src={props.datasource.raw.preview_image}
//                       alt={props.name}
//                       className="w-full h-48 object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
//                       No Image
//                     </div>
//                   )}
//                   <div className="p-4">
//                     <h2 className="text-xl font-bold text-purple-800">{props.name || "Unnamed Place"}</h2>
//                     <p className="text-sm text-gray-600 mb-1">{props.formatted}</p>
//                     <p className="text-sm text-gray-500 mb-1">
//                       <strong>Category:</strong> {kind}
//                     </p>
//                     <p className="text-sm text-indigo-600 font-semibold">
//                       <strong>Distance:</strong> {distance}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {!loading && places.length === 0 && (
//           <p className="text-center text-gray-400 mt-10">No places to show.</p>
//         )}
//       </div>
//     </div>
//   );
// }
//!//!//!
import React, { useEffect, useState } from "react";
import StuNav from "../StudentNavbar";
import {
  geocodePlace,
  fetchNearbyPlaces,
  calculateDistance,
  fetchImageFromPexels,
} from "./helpers/routeUtils";
import { getPlaceImage } from "./helpers/fetchPlaceImage";


const categories = [
  { label: "All", value: "" },
  { label: "Tourist Sights", value: "tourism.sights" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Parks & Gardens", value: "leisure.park" },
  { label: "Natural Attractions", value: "natural" },
  { label: "Restaurants", value: "catering.restaurant" },
  { label: "Religious Places", value: "religion" },
];

export default function ExploreHappiness() {
  const [placeName, setPlaceName] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  
const handleSearch = async () => {
  setLoading(true);
  setPlaces([]);

  const coords = await geocodePlace(placeName);
  if (!coords) {
    alert("Place not found.");
    setLoading(false);
    return;
  }

  const nearby = await fetchNearbyPlaces(coords.lat, coords.lng, selectedCategory);

  const enrichedPlaces = await Promise.all(
    nearby.map(async (place) => {
      const image = await getPlaceImage(place);
      return {
        ...place,
        image,
      };
    })
  );

  setPlaces(enrichedPlaces);
  setLoading(false);
};
 
  return (
    <div className="min-h-screen bg-gray-50">
      <StuNav />
      <div className="max-w-6xl mx-auto pt-28 px-4">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
          Explore Beautiful Places
        </h1>

        {/* Search Input */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter a place (e.g. Tirupati)"
            className="w-full md:w-1/2 px-4 py-2 border border-purple-300 rounded shadow"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
          />
          <select
            className="w-full md:w-1/4 px-4 py-2 border border-purple-300 rounded shadow"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-6 py-2 rounded shadow hover:bg-purple-700 transition"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Loading places...</p>}

        {/* Results Grid */}
        {places.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place, index) => {
              const props = place.properties;
              const distance = userLocation
                ? `${calculateDistance(userLocation, {
                    lat: props.lat,
                    lng: props.lon,
                  }).toFixed(2)} km`
                : "N/A";

              const kind = props.kinds?.split(",")[0]?.replace("_", " ") || "N/A";

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {/* {place.image ? (
                    <img
                      src={place.image}
                      alt={props.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )} */}
                  {place.image ? (
  <img
    src={place.image}
    alt={props.name}
    className="w-full h-48 object-cover"
  />
) : (
  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
    No Image
  </div>
)}

                  <div className="p-4">
                    <h2 className="text-xl font-bold text-purple-800">
                      {props.name || "Unnamed Place"}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">{props.formatted}</p>
                    <p className="text-sm text-gray-500 mb-1">
                      <strong>Category:</strong> {kind}
                    </p>
                    <p className="text-sm text-indigo-600 font-semibold">
                      <strong>Distance:</strong> {distance}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && places.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No places to show.</p>
        )}
      </div>
    </div>
  );
}
