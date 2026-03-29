// src/services/userService.js
import axios from "axios";
import API_URL from "../api";

// GET user profile
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to load user profile:", error);
    throw error;
  }
};
