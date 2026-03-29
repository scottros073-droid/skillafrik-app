// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { me } from "../services/authService"; // backend call to /auth/me

export default function useAuth() {
  const [user, setUser] = useState(null);       // full user object
  const [userRole, setUserRole] = useState(null); // user's role, e.g., 'admin' or 'user'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await me(); // fetch logged-in user
        setUser(res.user || res); 
        setUserRole(res.user?.role || res.role || null); // set role if exists
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, userRole, loading, setUser };
}
