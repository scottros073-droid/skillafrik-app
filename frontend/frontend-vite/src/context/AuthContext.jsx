import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import axiosInstance from "../utils/axiosInstance";

// 1️⃣ Create Context
const AuthContext = createContext(null);

// 2️⃣ Custom Hook (Safe Version)
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};

// 3️⃣ Provider Component
export const AuthProvider = ({ children }) => {
  // Lazy initialization (runs once)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token && user) {
        try {
          // Verify token with backend
          const response = await axiosInstance.get("/auth/me");
          setUser(response.data.user);
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ===== Signup =====
  const signup = async (userData) => {
    if (loading) {
      throw "Signup in progress. Please wait.";
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/signup", userData);

      const payload = response?.data || {};
      const token = payload.token || payload.data?.token;
      const userInfo = payload.user || payload.data?.user;

      if (!token || !userInfo) {
        throw new Error("Signup failed: invalid server response.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      setUser(userInfo);
      setLoading(false);

      return userInfo;
    } catch (error) {
      setLoading(false);
      console.error("Signup error:", error);

      // Axios error object parsing and fallback
      let message = "Signup failed. Try again.";

      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data.message === "string") {
          message = data.message;
        } else if (typeof data.error === "string") {
          message = data.error;
        }
      } else if (error?.message) {
        message = error.message;
      }

      throw message;
    }
  };

  // ===== Login =====
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", { email, password });

      const payload = response?.data || {};
      const token = payload.token || payload.data?.token;
      const userInfo = payload.user || payload.data?.user;

      if (!token || !userInfo) {
        throw new Error("Login failed: invalid server response.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      setUser(userInfo);
      setLoading(false);

      return userInfo;
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed. Check your credentials and try again.";
      throw message;
    }
  };

  // ===== Logout =====
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ===== Forgot Password =====
  const forgotPassword = async (email) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  };

  // ===== Reset Password =====
  const resetPassword = async (token, password) => {
    try {
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  };

  // Memoize context value (performance best practice)
  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      forgotPassword,
      resetPassword,
      loading,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
