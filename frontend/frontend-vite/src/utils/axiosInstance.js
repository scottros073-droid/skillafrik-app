// src/utils/axiosInstance.js
import axios from "axios";

const DEFAULT_API_BASE = "http://localhost:5000/api";
const API_BASE =
  (import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/\/+$/, "") ||
  DEFAULT_API_BASE;

// helpful debug if connection problems occur
if (import.meta.env.MODE === "development") {
  console.log("[axiosInstance] API_BASE set to", API_BASE);
}

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ===============================
// Request Interceptor
// ===============================
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Normalize endpoint to avoid /api/api duplication
    if (config.url && config.url.startsWith("/api/")) {
      config.url = config.url.replace(/^\/api/, "");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// Response Interceptor
// ===============================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Only handle real auth failure
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Soft redirect (no hard reload)
      if (!window.location.pathname.includes("/login")) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;