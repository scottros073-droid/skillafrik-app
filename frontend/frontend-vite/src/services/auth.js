// 📁 src/services/auth.js

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Login user
 */
export const loginUser = async (data) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

/**
 * Register user
 */
export const registerUser = async (data) => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
};
