// src/services/authService.js
import axiosInstance from "../utils/axiosInstance";

/**
 * Login user and store token & user info in localStorage
 * @param {string} email
 * @param {string} password
 * @returns {object} user
 */
export const loginUser = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  const { token, user } = response.data;

  localStorage.setItem("token", token);
  localStorage.setItem("userId", user.id || user._id);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};

/**
 * Logout user and clear localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
};

/**
 * Signup user
 * @param {object} payload - user data (name, email, password, etc.)
 * @returns {object} response data
 */
export const signup = async (payload) => {
  const response = await axiosInstance.post("/auth/signup", payload);
  return response.data;
};

/**
 * Generic login function
 * @param {object} payload - { email, password }
 * @returns {object} response data
 */
export const login = async (payload) => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
};

/**
 * Get current logged-in user info
 * @returns {object} user data
 */
export const me = async () => {
  const response = await axiosInstance.get("/auth/me");
  const data = response.data;
  return data.user != null ? data.user : data;
};
