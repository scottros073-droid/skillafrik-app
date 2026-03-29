// src/utils/socket.js
import { io } from "socket.io-client";

// Use Vite env variable for backend URL
const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket", "polling"], // fallback if websocket fails
});

export default socket;
