// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const UserContext = createContext();

function getStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function getStoredUser() {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearStoredAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔹 [UserContext] Initializing user context...");
    const token = getStoredToken();
    const storedUser = getStoredUser();

    console.log("🔹 [UserContext] Token found:", token ? "✓" : "✗");
    console.log("🔹 [UserContext] Stored user:", storedUser ? "✓" : "✗");

    if (!token) {
      console.log("🔹 [UserContext] No token, setting user to null");
      setUser(null);
      setLoading(false);
      return;
    }

    // Show user from storage immediately so dashboard doesn't flash to login
    if (storedUser) {
      console.log("🔹 [UserContext] Setting user from storage immediately");
      setUser(storedUser);
    }

    console.log("🔹 [UserContext] Verifying token with /auth/me...");
    axiosInstance
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        console.log("✅ [UserContext] /auth/me response:", res.data);
        setUser(res.data.user || res.data);
      })
      .catch((err) => {
        console.error("❌ [UserContext] /auth/me failed:", err.message);
        clearStoredAuth();
        setUser(null);
      })
      .finally(() => {
        console.log("🔹 [UserContext] Loading complete");
        setLoading(false);
      });
  }, []);

  const logout = () => {
    clearStoredAuth();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook with safety check
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    console.warn('useUser must be used inside a UserProvider');
    return { user: null, setUser: () => {}, loading: false, logout: () => {} };
  }
  return context;
};
