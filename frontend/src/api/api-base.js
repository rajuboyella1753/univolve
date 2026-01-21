
import axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PROD_API;

console.log("🌐 API Base URL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
