// frontend/src/api/axios.js
import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://skillafrik-backend.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
