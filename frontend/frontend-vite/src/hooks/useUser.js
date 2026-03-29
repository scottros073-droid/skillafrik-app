// src/hooks/useUser.js
import { useState, useEffect } from "react";
import { me } from "../services/authService";

/**
 * Custom hook to get current logged-in user
 */
export default function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await me();
      setUser(res.user || res);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, fetchUser, setUser };
}
