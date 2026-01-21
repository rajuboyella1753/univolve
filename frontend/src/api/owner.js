// 📁 src/api/owner.js
import axios from "axios";

// Dynamically choose base URL from .env file
const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PROD_API;

console.log("🛠️ Owner API Base URL:", baseURL); // optional debug

const ownerApi = axios.create({
  baseURL: `${baseURL}/api/owner`, // append subroute
  withCredentials: true,
});

// Attach token for protected routes
ownerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export functions
export const uploadItem = (data) =>
  ownerApi.post("/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const fetchClothes = () => ownerApi.get("/items/clothes");

export default ownerApi;
