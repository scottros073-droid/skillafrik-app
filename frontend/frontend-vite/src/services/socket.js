import { io } from "socket.io-client";

let socket = null;

export function connectSocket() {
  if (socket) return socket;
  const token = localStorage.getItem("token");
  socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_SOCKET || 'http://localhost:5000', {
    autoConnect: true,
    auth: { token },
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect_error', err.message);
  });

  return socket;
}

export function getSocket() { return socket; }

export function disconnectSocket() {
  if (socket) socket.disconnect();
  socket = null;
}
