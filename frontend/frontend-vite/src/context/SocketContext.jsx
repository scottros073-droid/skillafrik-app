// =============================
// SocketContext.jsx
// =============================
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

// Create context
export const SocketContext = createContext(null);

// Provider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const socketInstance = io(apiUrl, {
      transports: ["websocket"],
      autoConnect: true,
      auth: {
        token,
      },
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("⚡ Socket connected:", socketInstance.id);
      if (token) {
        socketInstance.emit("join", { token });
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("⚡ Socket disconnected");
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !user) return;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      socket.emit("join", { token });
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook
export const useSocket = () => {
  return useContext(SocketContext);
};
